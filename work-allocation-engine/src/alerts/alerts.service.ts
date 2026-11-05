import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  AlertFilterDto,
  AlertSeverity,
  AlertStatus,
  AlertType,
  CreateAlertDto,
} from './dto/create-alert.dto';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Monitor employee workload capacity.
   * - Load > 100%: CAPACITY_EXCEEDED alert (CRITICAL/HIGH)
   * - Load > 90%: CAPACITY_WARNING alert (MEDIUM/HIGH)
   */
  async checkCapacityAlerts(employeeId: string) {
    const supabase = this.supabaseService.getClient();

    // 1. Fetch employee
    const { data: employee, error: empErr } = await supabase
      .from('employees')
      .select('id, name, weekly_capacity_hours, max_capacity_hours, current_workload_hours')
      .eq('id', employeeId)
      .single();

    if (empErr || !employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    // 2. Fetch active allocations for employee
    const { data: allocations, error: allocErr } = await supabase
      .from('allocations')
      .select('allocated_hours, allocated_hours_per_week, status')
      .eq('employee_id', employeeId)
      .eq('status', 'ACTIVE');

    if (allocErr) {
      this.logger.warn(`Could not query allocations for employee ${employeeId}: ${allocErr.message}`);
    }

    const maxCapacity = Number(
      employee.max_capacity_hours || employee.weekly_capacity_hours || 40,
    );

    let totalAllocatedHours = (allocations || []).reduce(
      (sum: number, a: any) =>
        sum + Number(a.allocated_hours_per_week ?? a.allocated_hours ?? 0),
      0,
    );

    if (totalAllocatedHours === 0 && employee.current_workload_hours) {
      totalAllocatedHours = Number(employee.current_workload_hours);
    }

    const utilization = maxCapacity > 0 ? totalAllocatedHours / maxCapacity : 1.0;
    let alertType: AlertType | null = null;
    let severity: AlertSeverity = AlertSeverity.LOW;
    let message = '';

    if (utilization > 1.0) {
      alertType = AlertType.CAPACITY_EXCEEDED;
      severity = AlertSeverity.CRITICAL;
      message = `Capacity exceeded: ${employee.name} is allocated ${totalAllocatedHours}h/${maxCapacity}h (${Math.round(utilization * 100)}% capacity).`;
    } else if (utilization > 0.9) {
      alertType = AlertType.CAPACITY_WARNING;
      severity = AlertSeverity.HIGH;
      message = `Capacity warning: ${employee.name} is allocated ${totalAllocatedHours}h/${maxCapacity}h (${Math.round(utilization * 100)}% capacity).`;
    }

    let createdAlert: any = null;

    if (alertType) {
      // Check if active alert already exists to prevent duplicate spam
      const { data: existingAlerts } = await supabase
        .from('alerts')
        .select('id, type, status')
        .eq('employee_id', employeeId)
        .eq('type', alertType)
        .eq('status', AlertStatus.ACTIVE);

      if (!existingAlerts || existingAlerts.length === 0) {
        const { data: alertData, error: alertErr } = await supabase
          .from('alerts')
          .insert([
            {
              type: alertType,
              severity,
              message,
              status: AlertStatus.ACTIVE,
              employee_id: employeeId,
              metadata: {
                total_allocated_hours: totalAllocatedHours,
                max_capacity_hours: maxCapacity,
                utilization_percentage: Math.round(utilization * 100),
                checked_at: new Date().toISOString(),
              },
            },
          ])
          .select()
          .single();

        if (alertErr) {
          this.logger.warn(`Failed to insert capacity alert: ${alertErr.message}`);
        } else {
          createdAlert = alertData;
        }
      } else {
        createdAlert = existingAlerts[0];
      }
    }

    return {
      employee_id: employeeId,
      employee_name: employee.name,
      total_allocated_hours: totalAllocatedHours,
      max_capacity_hours: maxCapacity,
      utilization_percentage: Math.round(utilization * 100),
      has_alert: alertType !== null,
      alert_type: alertType,
      severity: alertType ? severity : null,
      message: message || `Capacity healthy (${totalAllocatedHours}h/${maxCapacity}h).`,
      alert: createdAlert,
    };
  }

  /**
   * Monitor staffing gaps on a project.
   * - Queries project staffing requirements and active allocations.
   * - If filled headcount < required headcount, creates STAFFING_GAP alert.
   */
  async checkStaffingGapAlerts(projectId: string) {
    const supabase = this.supabaseService.getClient();

    // 1. Fetch project
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', projectId)
      .single();

    if (projErr || !project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // 2. Fetch staffing requirements
    const { data: requirements, error: reqErr } = await supabase
      .from('project_staffing_requirements')
      .select('*, skills (id, name)')
      .eq('project_id', projectId);

    if (reqErr) {
      throw new BadRequestException(`Failed to fetch staffing requirements: ${reqErr.message}`);
    }

    // 3. Fetch active allocations
    const { data: allocations, error: allocErr } = await supabase
      .from('allocations')
      .select('id, assigned_role, staffing_requirement_id, employee_id, status')
      .eq('project_id', projectId)
      .eq('status', 'ACTIVE');

    if (allocErr) {
      throw new BadRequestException(`Failed to fetch active allocations: ${allocErr.message}`);
    }

    const safeReqs = requirements || [];
    const safeAllocs = allocations || [];

    const gaps: Array<{
      requirement_id: string;
      role: string;
      skill_id?: string;
      skill_name?: string;
      required_headcount: number;
      filled_headcount: number;
      gap: number;
    }> = [];

    const createdAlerts: any[] = [];

    for (const req of safeReqs) {
      const requiredHeadcount = Number(req.required_headcount || 1);
      const filledHeadcount = safeAllocs.filter(
        (a) =>
          a.staffing_requirement_id === req.id ||
          (a.assigned_role &&
            req.required_role &&
            a.assigned_role.toLowerCase() === req.required_role.toLowerCase()),
      ).length;

      const gap = Math.max(0, requiredHeadcount - filledHeadcount);

      if (gap > 0) {
        const gapInfo = {
          requirement_id: req.id,
          role: req.required_role,
          skill_id: req.skill_id,
          skill_name: req.skills?.name || 'Unknown',
          required_headcount: requiredHeadcount,
          filled_headcount: filledHeadcount,
          gap,
        };
        gaps.push(gapInfo);

        const alertMessage = `Staffing gap on '${project.name}': Role '${req.required_role}' requires ${requiredHeadcount} headcount, but only ${filledHeadcount} assigned (gap: ${gap}).`;

        // Check if existing active alert exists for this requirement
        const { data: existingAlerts } = await supabase
          .from('alerts')
          .select('id, type, status')
          .eq('project_id', projectId)
          .eq('staffing_requirement_id', req.id)
          .eq('type', AlertType.STAFFING_GAP)
          .eq('status', AlertStatus.ACTIVE);

        if (!existingAlerts || existingAlerts.length === 0) {
          const { data: newAlert, error: alertInsertErr } = await supabase
            .from('alerts')
            .insert([
              {
                type: AlertType.STAFFING_GAP,
                severity: AlertSeverity.HIGH,
                message: alertMessage,
                status: AlertStatus.ACTIVE,
                project_id: projectId,
                staffing_requirement_id: req.id,
                metadata: {
                  project_name: project.name,
                  required_role: req.required_role,
                  skill_id: req.skill_id,
                  skill_name: req.skills?.name,
                  required_headcount: requiredHeadcount,
                  filled_headcount: filledHeadcount,
                  gap,
                  checked_at: new Date().toISOString(),
                },
              },
            ])
            .select()
            .single();

          if (!alertInsertErr && newAlert) {
            createdAlerts.push(newAlert);
          }
        }
      }
    }

    return {
      project_id: projectId,
      project_name: project.name,
      total_requirements: safeReqs.length,
      requirements_with_gaps_count: gaps.length,
      gaps,
      alerts_created: createdAlerts,
    };
  }

  /**
   * Monitor organization-wide hiring signals.
   * - Aggregates STAFFING_GAP alerts/requirements across projects.
   * - Groups by required_role and skill.
   * - If >3 projects need the same skill, triggers a HIRING_NEEDED signal.
   */
  async checkHiringSignals() {
    const supabase = this.supabaseService.getClient();

    // 1. Query all project staffing requirements with skills
    const { data: requirements, error: reqErr } = await supabase
      .from('project_staffing_requirements')
      .select('*, skills (id, name), projects (id, name, status)');

    if (reqErr) {
      throw new BadRequestException(`Failed to aggregate staffing requirements: ${reqErr.message}`);
    }

    // 2. Query all active allocations
    const { data: allocations, error: allocErr } = await supabase
      .from('allocations')
      .select('id, project_id, staffing_requirement_id, assigned_role, status')
      .eq('status', 'ACTIVE');

    if (allocErr) {
      throw new BadRequestException(`Failed to fetch active allocations: ${allocErr.message}`);
    }

    const safeReqs = requirements || [];
    const safeAllocs = allocations || [];

    // Map gaps by key: `${role}:::${skill_id || skill_name}`
    const gapMap = new Map<
      string,
      {
        role: string;
        skill_id: string;
        skill_name: string;
        project_ids: Set<string>;
        project_names: Set<string>;
        total_required_headcount: number;
        total_filled_headcount: number;
        total_gap: number;
      }
    >();

    for (const req of safeReqs) {
      const requiredHeadcount = Number(req.required_headcount || 1);
      const filledHeadcount = safeAllocs.filter(
        (a) =>
          a.project_id === req.project_id &&
          (a.staffing_requirement_id === req.id ||
            (a.assigned_role &&
              req.required_role &&
              a.assigned_role.toLowerCase() === req.required_role.toLowerCase())),
      ).length;

      const gap = Math.max(0, requiredHeadcount - filledHeadcount);

      if (gap > 0) {
        const skillName = req.skills?.name || 'General';
        const key = `${req.required_role}:::${req.skill_id || skillName}`;

        if (!gapMap.has(key)) {
          gapMap.set(key, {
            role: req.required_role,
            skill_id: req.skill_id || '',
            skill_name: skillName,
            project_ids: new Set<string>(),
            project_names: new Set<string>(),
            total_required_headcount: 0,
            total_filled_headcount: 0,
            total_gap: 0,
          });
        }

        const entry = gapMap.get(key)!;
        entry.project_ids.add(req.project_id);
        if (req.projects?.name) {
          entry.project_names.add(req.projects.name);
        }
        entry.total_required_headcount += requiredHeadcount;
        entry.total_filled_headcount += filledHeadcount;
        entry.total_gap += gap;
      }
    }

    const hiringSignals: any[] = [];
    const createdAlerts: any[] = [];

    for (const item of gapMap.values()) {
      const projectCount = item.project_ids.size;
      // Persistent gap condition: > 3 projects need the same skill/role (or >= 3)
      const isPersistent = projectCount >= 3;
      const urgency = projectCount >= 4 ? 'CRITICAL' : isPersistent ? 'HIGH' : 'MEDIUM';

      const signal = {
        role: item.role,
        skill_id: item.skill_id,
        skill_name: item.skill_name,
        affected_projects_count: projectCount,
        affected_projects: Array.from(item.project_names),
        total_required_headcount: item.total_required_headcount,
        total_filled_headcount: item.total_filled_headcount,
        total_headcount_gap: item.total_gap,
        is_persistent_gap: isPersistent,
        hiring_signal: isPersistent ? 'HIRING_NEEDED' : 'MONITOR',
        urgency,
        priority: isPersistent ? 1 : 2,
      };

      hiringSignals.push(signal);

      if (isPersistent) {
        const message = `Urgent hiring needed: Skill '${item.skill_name}' (${item.role}) is in demand across ${projectCount} projects with a deficit of ${item.total_gap} engineers.`;

        // Check existing active alert
        const { data: existingAlerts } = await supabase
          .from('alerts')
          .select('id, type, status')
          .eq('type', AlertType.HIRING_NEEDED)
          .eq('status', AlertStatus.ACTIVE);

        const alreadyExists = (existingAlerts || []).some(
          (a: any) => a.metadata?.skill_name === item.skill_name,
        );

        if (!alreadyExists) {
          const { data: newAlert, error: alertInsertErr } = await supabase
            .from('alerts')
            .insert([
              {
                type: AlertType.HIRING_NEEDED,
                severity: urgency === 'CRITICAL' ? AlertSeverity.CRITICAL : AlertSeverity.HIGH,
                message,
                status: AlertStatus.ACTIVE,
                metadata: {
                  role: item.role,
                  skill_id: item.skill_id,
                  skill_name: item.skill_name,
                  affected_projects_count: projectCount,
                  total_gap: item.total_gap,
                  checked_at: new Date().toISOString(),
                },
              },
            ])
            .select()
            .single();

          if (!alertInsertErr && newAlert) {
            createdAlerts.push(newAlert);
          }
        }
      }
    }

    return {
      total_skill_gaps: hiringSignals.length,
      persistent_hiring_signals_count: hiringSignals.filter((s) => s.is_persistent_gap).length,
      signals: hiringSignals.sort((a, b) => b.affected_projects_count - a.affected_projects_count),
      alerts_created: createdAlerts,
    };
  }

  /**
   * Get paginated alerts with filters.
   */
  async getAlerts(filters: AlertFilterDto) {
    const supabase = this.supabaseService.getClient();

    const page = Math.max(1, Number(filters?.page || 1));
    const limit = Math.min(100, Math.max(1, Number(filters?.limit || 20)));
    const offset = (page - 1) * limit;

    let query = supabase
      .from('alerts')
      .select(
        `
        *,
        employees (id, name, email),
        projects (id, name)
      `,
        { count: 'exact' },
      );

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.project_id) {
      query = query.eq('project_id', filters.project_id);
    }
    if (filters?.employee_id) {
      query = query.eq('employee_id', filters.employee_id);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: alerts, count, error } = await query;

    if (error) {
      this.logger.error(`Failed to fetch alerts: ${error.message}`);
      throw new BadRequestException(`Failed to fetch alerts: ${error.message}`);
    }

    const total = count ?? (alerts || []).length;
    const totalPages = Math.ceil(total / limit);

    return {
      alerts: alerts || [],
      total,
      page,
      limit,
      total_pages: totalPages,
    };
  }

  /**
   * Get single alert by ID.
   */
  async getAlertById(alertId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: alert, error } = await supabase
      .from('alerts')
      .select(
        `
        *,
        employees (id, name, email),
        projects (id, name)
      `,
      )
      .eq('id', alertId)
      .single();

    if (error || !alert) {
      throw new NotFoundException(`Alert with ID ${alertId} not found`);
    }

    return alert;
  }

  /**
   * Dismiss an alert with manager ID and reason.
   */
  async dismissAlert(alertId: string, managerId?: string, reason?: string) {
    const supabase = this.supabaseService.getClient();

    // 1. Verify alert exists
    await this.getAlertById(alertId);

    const dismissedAt = new Date().toISOString();
    const dismissalReason = reason || 'Dismissed by manager';

    // 2. Update status
    const { data: updatedAlert, error } = await supabase
      .from('alerts')
      .update({
        status: AlertStatus.DISMISSED,
        dismissed_at: dismissedAt,
        dismissed_by: managerId,
        dismissal_reason: dismissalReason,
      })
      .eq('id', alertId)
      .select(
        `
        *,
        employees (id, name, email),
        projects (id, name)
      `,
      )
      .single();

    if (error || !updatedAlert) {
      this.logger.error(`Failed to dismiss alert ${alertId}: ${error?.message}`);
      throw new BadRequestException(`Failed to dismiss alert: ${error?.message}`);
    }

    this.logger.log(`Alert ${alertId} dismissed by manager ${managerId || 'unknown'}.`);

    return updatedAlert;
  }
}
