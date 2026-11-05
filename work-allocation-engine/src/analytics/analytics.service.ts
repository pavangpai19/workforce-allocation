import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AllocationTrendsFilterDto } from './dto/dashboard-metrics.dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Get organization-wide dashboard metrics.
   * - Active projects count
   * - Active allocations count
   * - Pending proposals count
   * - Active alerts count
   * - Average allocation utilization
   */
  async getDashboardMetrics(managerId?: string) {
    const supabase = this.supabaseService.getClient();

    // 1. Query projects count
    let projectsQuery = supabase
      .from('projects')
      .select('id, name, status', { count: 'exact' });

    if (managerId) {
      projectsQuery = projectsQuery.eq('manager_id', managerId);
    }

    const { data: projects, count: projectsCount, error: projErr } = await projectsQuery;
    if (projErr) {
      this.logger.warn(`Failed to count projects: ${projErr.message}`);
    }

    const activeProjectsCount = (projects || []).filter(
      (p: any) => !p.status || p.status === 'ACTIVE' || p.status === 'IN_PROGRESS',
    ).length || projectsCount || 0;

    // 2. Query active allocations
    const { data: allocations, count: allocCount, error: allocErr } = await supabase
      .from('allocations')
      .select('id, employee_id, allocated_hours, allocated_hours_per_week, status', { count: 'exact' })
      .eq('status', 'ACTIVE');

    if (allocErr) {
      this.logger.warn(`Failed to count allocations: ${allocErr.message}`);
    }

    const activeAllocationsCount = allocCount ?? (allocations || []).length;

    // 3. Query pending proposals
    const { data: proposals, count: propCount, error: propErr } = await supabase
      .from('allocation_proposals')
      .select('id, status', { count: 'exact' })
      .eq('status', 'PENDING_APPROVAL');

    if (propErr) {
      this.logger.warn(`Failed to count proposals: ${propErr.message}`);
    }

    const pendingProposalsCount = propCount ?? (proposals || []).length;

    // 4. Query active alerts
    const { data: alerts, count: alertCount, error: alertErr } = await supabase
      .from('alerts')
      .select('id, status', { count: 'exact' })
      .eq('status', 'ACTIVE');

    if (alertErr) {
      this.logger.warn(`Failed to count alerts: ${alertErr.message}`);
    }

    const activeAlertsCount = alertCount ?? (alerts || []).length;

    // 5. Query workforce capacity and calculate utilization
    const { data: employees } = await supabase
      .from('employees')
      .select('id, weekly_capacity_hours, max_capacity_hours, current_workload_hours');

    const safeEmployees = employees || [];
    const totalCapacity = safeEmployees.reduce(
      (sum: number, e: any) =>
        sum + Number(e.max_capacity_hours || e.weekly_capacity_hours || 40),
      0,
    );

    const totalAllocated = (allocations || []).reduce(
      (sum: number, a: any) =>
        sum + Number(a.allocated_hours_per_week ?? a.allocated_hours ?? 0),
      0,
    );

    const avgUtilization = totalCapacity > 0 ? totalAllocated / totalCapacity : 0;

    return {
      active_projects_count: activeProjectsCount,
      active_allocations_count: activeAllocationsCount,
      pending_proposals_count: pendingProposalsCount,
      active_alerts_count: activeAlertsCount,
      total_employees_count: safeEmployees.length,
      total_workforce_capacity_hours: totalCapacity,
      total_allocated_hours: totalAllocated,
      average_allocation_utilization: Number(avgUtilization.toFixed(4)),
      average_utilization_percentage: Number((avgUtilization * 100).toFixed(1)),
    };
  }

  /**
   * Get project analytics:
   * - Staffing requirements
   * - Allocated vs required headcount
   * - Coverage percentage
   * - Active team member performance predictions
   */
  async getProjectAnalytics(projectId: string) {
    const supabase = this.supabaseService.getClient();

    // 1. Fetch project
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .select('*')
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
      throw new BadRequestException(`Failed to fetch requirements: ${reqErr.message}`);
    }

    // 3. Fetch active allocations for project
    const { data: allocations, error: allocErr } = await supabase
      .from('allocations')
      .select(
        `
        *,
        employees (
          id,
          name,
          email,
          weekly_capacity_hours,
          efficiency_score,
          reliability_score
        )
      `,
      )
      .eq('project_id', projectId)
      .eq('status', 'ACTIVE');

    if (allocErr) {
      throw new BadRequestException(`Failed to fetch allocations: ${allocErr.message}`);
    }

    // 4. Fetch latest proposal member scores if available
    const { data: proposals } = await supabase
      .from('allocation_proposals')
      .select('id, status, allocation_proposal_members (*)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1);

    const latestMembers = proposals?.[0]?.allocation_proposal_members || [];
    const memberScoreMap = new Map<string, any>();
    for (const m of latestMembers) {
      memberScoreMap.set(m.employee_id, {
        skill_match_score: m.skill_match_score,
        predicted_performance: m.predicted_performance,
        burnout_risk_probability: m.burnout_risk_probability,
        final_score: m.final_score,
      });
    }

    const safeReqs = requirements || [];
    const safeAllocs = allocations || [];

    const totalRequiredHeadcount = safeReqs.reduce(
      (sum: number, r: any) => sum + Number(r.required_headcount || 1),
      0,
    );

    const totalAllocatedHeadcount = safeAllocs.length;

    const coveragePercentage =
      totalRequiredHeadcount > 0
        ? Math.min(100, (totalAllocatedHeadcount / totalRequiredHeadcount) * 100)
        : totalAllocatedHeadcount > 0
          ? 100
          : 0;

    const teamMembers = safeAllocs.map((alloc: any) => {
      const scores = memberScoreMap.get(alloc.employee_id) || {};
      return {
        allocation_id: alloc.id,
        employee_id: alloc.employee_id,
        name: alloc.employees?.name || 'Unknown',
        email: alloc.employees?.email,
        role: alloc.assigned_role || alloc.employees?.role,
        allocated_hours: Number(alloc.allocated_hours_per_week ?? alloc.allocated_hours ?? 0),
        start_date: alloc.start_date || alloc.week_start_date,
        predicted_performance: scores.predicted_performance ?? 0.85,
        skill_match_score: scores.skill_match_score ?? 0.9,
        burnout_risk_probability: scores.burnout_risk_probability ?? 0.1,
      };
    });

    const avgPerformance =
      teamMembers.length > 0
        ? teamMembers.reduce((sum, m) => sum + (m.predicted_performance || 0), 0) /
          teamMembers.length
        : 0;

    return {
      project_id: projectId,
      project_name: project.name,
      project_priority: project.project_priority,
      required_headcount: totalRequiredHeadcount,
      allocated_headcount: totalAllocatedHeadcount,
      staffing_coverage_percentage: Number(coveragePercentage.toFixed(2)),
      staffing_status:
        coveragePercentage >= 100
          ? 'FULLY_STAFFED'
          : coveragePercentage > 0
            ? 'PARTIALLY_STAFFED'
            : 'UNSTAFFED',
      average_team_performance_score: Number(avgPerformance.toFixed(2)),
      requirements: safeReqs,
      team_members: teamMembers,
    };
  }

  /**
   * Get workload analysis for a single employee.
   * - Active allocations breakdown
   * - Hours sum vs capacity
   * - Utilization %
   */
  async getEmployeeWorkload(employeeId: string, requestingUser?: any) {
    const supabase = this.supabaseService.getClient();

    // Enforce authorization if employee
    if (requestingUser?.role === 'EMPLOYEE') {
      const callerId = requestingUser.employeeId || requestingUser.employee_id;
      if (callerId && callerId !== employeeId) {
        throw new ForbiddenException('Employees can only view their own workload analytics.');
      }
    }

    // 1. Fetch employee
    const { data: employee, error: empErr } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();

    if (empErr || !employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    // 2. Fetch active allocations
    const { data: allocations, error: allocErr } = await supabase
      .from('allocations')
      .select('*, projects (id, name, project_priority)')
      .eq('employee_id', employeeId)
      .eq('status', 'ACTIVE');

    if (allocErr) {
      throw new BadRequestException(`Failed to fetch allocations: ${allocErr.message}`);
    }

    const safeAllocs = allocations || [];

    const maxCapacityHours = Number(
      employee.max_capacity_hours || employee.weekly_capacity_hours || 40,
    );
    const weeklyCapacityHours = Number(employee.weekly_capacity_hours || 40);

    const totalAllocatedHours = safeAllocs.reduce(
      (sum: number, a: any) =>
        sum + Number(a.allocated_hours_per_week ?? a.allocated_hours ?? 0),
      0,
    );

    const utilizationPercentage =
      maxCapacityHours > 0 ? (totalAllocatedHours / maxCapacityHours) * 100 : 0;

    let workloadStatus = 'OPTIMAL';
    if (utilizationPercentage > 100) {
      workloadStatus = 'OVERLOADED';
    } else if (utilizationPercentage > 90) {
      workloadStatus = 'NEAR_CAPACITY';
    } else if (utilizationPercentage < 50) {
      workloadStatus = 'UNDERUTILIZED';
    }

    return {
      employee_id: employee.id,
      employee_name: employee.name,
      employee_role: employee.role,
      department: employee.department,
      weekly_capacity_hours: weeklyCapacityHours,
      max_capacity_hours: maxCapacityHours,
      total_allocated_hours: totalAllocatedHours,
      remaining_capacity_hours: Math.max(0, maxCapacityHours - totalAllocatedHours),
      utilization_percentage: Number(utilizationPercentage.toFixed(1)),
      workload_status: workloadStatus,
      active_allocations_count: safeAllocs.length,
      allocations: safeAllocs.map((a: any) => ({
        allocation_id: a.id,
        project_id: a.project_id,
        project_name: a.projects?.name,
        assigned_role: a.assigned_role,
        allocated_hours: Number(a.allocated_hours_per_week ?? a.allocated_hours ?? 0),
        start_date: a.start_date || a.week_start_date,
      })),
    };
  }

  /**
   * Get allocation time-series trends (new allocations, completions, releases).
   */
  async getAllocationTrends(filters?: AllocationTrendsFilterDto) {
    const supabase = this.supabaseService.getClient();

    let query = supabase.from('allocations').select('*');

    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    const { data: allocations, error } = await query;

    if (error) {
      this.logger.error(`Failed to fetch allocation trends: ${error.message}`);
      throw new BadRequestException(`Failed to fetch allocation trends: ${error.message}`);
    }

    const safeAllocs = allocations || [];

    const periodMap = new Map<
      string,
      {
        period: string;
        new_allocations: number;
        completions: number;
        releases: number;
        active_total: number;
      }
    >();

    for (const alloc of safeAllocs) {
      const dateStr = alloc.created_at || alloc.week_start_date || new Date().toISOString();
      const date = new Date(dateStr);
      // Group by year-month: YYYY-MM
      const periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!periodMap.has(periodKey)) {
        periodMap.set(periodKey, {
          period: periodKey,
          new_allocations: 0,
          completions: 0,
          releases: 0,
          active_total: 0,
        });
      }

      const item = periodMap.get(periodKey)!;
      item.new_allocations += 1;

      if (alloc.status === 'WORK_COMPLETED' || alloc.actual_end_date) {
        item.completions += 1;
      }
      if (alloc.status === 'RELEASED' || alloc.released_at) {
        item.releases += 1;
      }
      if (alloc.status === 'ACTIVE') {
        item.active_total += 1;
      }
    }

    const trends = Array.from(periodMap.values()).sort((a, b) =>
      a.period.localeCompare(b.period),
    );

    const totalNew = safeAllocs.length;
    const totalCompleted = safeAllocs.filter((a) => a.status === 'WORK_COMPLETED').length;
    const totalReleased = safeAllocs.filter((a) => a.status === 'RELEASED').length;

    return {
      date_range: {
        start_date: filters?.startDate || 'all-time',
        end_date: filters?.endDate || 'present',
      },
      total_records_analyzed: totalNew,
      total_new_allocations: totalNew,
      total_completed: totalCompleted,
      total_released: totalReleased,
      trends,
    };
  }

  /**
   * Aggregate staffing requirements across projects to rank skill demand.
   */
  async getSkillDemandAnalysis() {
    const supabase = this.supabaseService.getClient();

    // 1. Fetch all requirements with skills & projects
    const { data: requirements, error: reqErr } = await supabase
      .from('project_staffing_requirements')
      .select('*, skills (id, name), projects (id, name, status)');

    if (reqErr) {
      throw new BadRequestException(`Failed to analyze skill demand: ${reqErr.message}`);
    }

    // 2. Fetch employee skill supply
    const { data: employeeSkills } = await supabase
      .from('employee_skills')
      .select('skill_id, employee_id');

    const supplyMap = new Map<string, number>();
    for (const es of employeeSkills || []) {
      supplyMap.set(es.skill_id, (supplyMap.get(es.skill_id) || 0) + 1);
    }

    const skillMap = new Map<
      string,
      {
        skill_id: string;
        skill_name: string;
        demanded_headcount: number;
        total_hours_demanded_per_week: number;
        project_ids: Set<string>;
        project_names: Set<string>;
        available_supply: number;
      }
    >();

    for (const req of requirements || []) {
      const skillId = req.skill_id || req.skills?.id || req.required_role;
      const skillName = req.skills?.name || req.required_role || 'General Skill';
      const headcount = Number(req.required_headcount || 1);
      const hours = Number(req.allocation_hours_per_week || 40) * headcount;

      if (!skillMap.has(skillId)) {
        skillMap.set(skillId, {
          skill_id: skillId,
          skill_name: skillName,
          demanded_headcount: 0,
          total_hours_demanded_per_week: 0,
          project_ids: new Set<string>(),
          project_names: new Set<string>(),
          available_supply: supplyMap.get(skillId) || 0,
        });
      }

      const entry = skillMap.get(skillId)!;
      entry.demanded_headcount += headcount;
      entry.total_hours_demanded_per_week += hours;
      entry.project_ids.add(req.project_id);
      if (req.projects?.name) {
        entry.project_names.add(req.projects.name);
      }
    }

    const demandRanking = Array.from(skillMap.values())
      .map((item) => {
        const projectCount = item.project_ids.size;
        const deficit = Math.max(0, item.demanded_headcount - item.available_supply);
        let demandLevel = 'LOW';
        if (projectCount >= 3 || item.demanded_headcount >= 5) {
          demandLevel = 'HIGH';
        } else if (projectCount >= 2 || item.demanded_headcount >= 2) {
          demandLevel = 'MEDIUM';
        }

        return {
          skill_id: item.skill_id,
          skill_name: item.skill_name,
          demanded_headcount: item.demanded_headcount,
          total_hours_demanded_per_week: item.total_hours_demanded_per_week,
          project_count: projectCount,
          projects: Array.from(item.project_names),
          available_supply_count: item.available_supply,
          supply_deficit: deficit,
          demand_level: demandLevel,
        };
      })
      .sort((a, b) => b.demanded_headcount - a.demanded_headcount || b.project_count - a.project_count);

    return demandRanking;
  }

  /**
   * System metrics backward compatibility.
   */
  async getSystemMetrics() {
    const supabase = this.supabaseService.getClient();
    const { data: logs } = await supabase.from('decision_logs').select('*');
    const safeLogs = logs ?? [];

    if (!safeLogs.length) {
      return {
        total_allocations: 0,
        avg_performance: 0,
        avg_risk: 0,
        avg_fairness: 0,
      };
    }

    const total = safeLogs.length;
    const avg_performance =
      safeLogs.reduce((a: number, b: any) => a + Number(b.performance || 0), 0) / total;
    const avg_risk =
      safeLogs.reduce((a: number, b: any) => a + Number(b.risk_score || 0), 0) / total;
    const avg_fairness =
      safeLogs.reduce((a: number, b: any) => a + Number(b.fairness || 0), 0) / total;

    return {
      total_allocations: total,
      avg_performance,
      avg_risk,
      avg_fairness,
    };
  }

  /**
   * Employee metrics backward compatibility.
   */
  async getEmployeeMetrics() {
    const supabase = this.supabaseService.getClient();
    const { data: logs } = await supabase.from('decision_logs').select('*');
    const safeLogs = logs ?? [];

    const map: Record<string, any> = {};
    safeLogs.forEach((log: any) => {
      if (!map[log.employee_id]) {
        map[log.employee_id] = {
          employee_id: log.employee_id,
          total_allocations: 0,
          total_performance: 0,
          total_risk: 0,
        };
      }
      map[log.employee_id].total_allocations += 1;
      map[log.employee_id].total_performance += Number(log.performance || 0);
      map[log.employee_id].total_risk += Number(log.risk_score || 0);
    });

    return Object.values(map).map((emp: any) => ({
      employee_id: emp.employee_id,
      total_allocations: emp.total_allocations,
      avg_performance: emp.total_performance / emp.total_allocations,
      avg_risk: emp.total_risk / emp.total_allocations,
    }));
  }
}