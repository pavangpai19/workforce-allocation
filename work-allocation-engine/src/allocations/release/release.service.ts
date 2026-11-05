import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { ReportWorkCompletionDto } from './dto/report-work-completion.dto';
import { ConfirmReleaseDto, ReviewCompletionDto } from './dto/confirm-release.dto';

@Injectable()
export class ReleaseService {
  private readonly logger = new Logger(ReleaseService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Report work completion for an active allocation.
   * - Verifies allocation exists and status is ACTIVE.
   * - Verifies the reporting employee is assigned to the allocation.
   * - Transitions status to WORK_COMPLETED and sets actual_end_date.
   * - Logs the completion decision.
   */
  async reportWorkCompletion(
    allocationId: string,
    employeeId?: string,
    completionData?: ReportWorkCompletionDto,
  ) {
    const supabase = this.supabaseService.getClient();

    // 1. Fetch allocation
    const { data: allocation, error: fetchErr } = await supabase
      .from('allocations')
      .select('*, employees (id, name, email, role), projects (id, name)')
      .eq('id', allocationId)
      .single();

    if (fetchErr || !allocation) {
      throw new NotFoundException(`Allocation with ID ${allocationId} not found`);
    }

    // 2. Verify status is ACTIVE
    if (allocation.status !== 'ACTIVE') {
      throw new BadRequestException(
        `Allocation ${allocationId} cannot be marked complete because its current status is '${allocation.status}'. Only 'ACTIVE' allocations can be completed.`,
      );
    }

    // 3. Verify employee identity
    const reportingEmployeeId = completionData?.employee_id || employeeId;
    if (reportingEmployeeId && allocation.employee_id !== reportingEmployeeId) {
      throw new ForbiddenException(
        `Employee ${reportingEmployeeId} is not assigned to allocation ${allocationId}. Only the assigned employee or an administrator can report work completion.`,
      );
    }

    const actualEndDate = new Date().toISOString().split('T')[0];

    // 4. Update allocation status
    const { data: updatedAllocation, error: updateErr } = await supabase
      .from('allocations')
      .update({
        status: 'WORK_COMPLETED',
        actual_end_date: actualEndDate,
      })
      .eq('id', allocationId)
      .select('*, employees (id, name, email, role), projects (id, name)')
      .single();

    if (updateErr || !updatedAllocation) {
      this.logger.error(`Failed to update allocation completion: ${updateErr?.message}`);
      throw new BadRequestException(
        `Failed to update allocation to WORK_COMPLETED: ${updateErr?.message}`,
      );
    }

    // 5. Create decision log entry
    const explanation =
      completionData?.notes ||
      completionData?.deliverables_summary ||
      `Employee ${allocation.employees?.name || allocation.employee_id} reported work completion.`;

    const snapshot = {
      action: 'WORK_COMPLETED',
      reported_by: reportingEmployeeId || allocation.employee_id,
      completed_at: new Date().toISOString(),
      actual_end_date: actualEndDate,
      actual_hours_spent: completionData?.actual_hours_spent,
      notes: completionData?.notes,
      deliverables_summary: completionData?.deliverables_summary,
    };

    try {
      await supabase.from('decision_logs').insert([
        {
          allocation_id: allocationId,
          employee_id: allocation.employee_id,
          project_id: allocation.project_id,
          fairness: 1.0,
          performance: 1.0,
          skill_score: 1.0,
          knowledge_score: 1.0,
          risk_score: 0.0,
          confidence: 1.0,
          final_score: 1.0,
          explanation: `Work completion reported: ${explanation}`,
          decision_snapshot: snapshot,
        },
      ]);
    } catch (e: any) {
      this.logger.warn(`decision_logs insert failed: ${e?.message}`);
    }

    try {
      await supabase.from('allocation_decisions').insert([
        {
          allocation_id: allocationId,
          employee_id: allocation.employee_id,
          project_id: allocation.project_id,
          fairness_score: 1.0,
          performance_score: 1.0,
          skill_score: 1.0,
          knowledge_score: 1.0,
          risk_score: 0.0,
          confidence: 1.0,
          final_score: 1.0,
          explanation: `Work completion reported: ${explanation}`,
          decision_snapshot: snapshot,
        },
      ]);
    } catch (e: any) {
      this.logger.warn(`allocation_decisions dual-write failed: ${e?.message}`);
    }

    this.logger.log(
      `Allocation ${allocationId} successfully marked as WORK_COMPLETED by employee ${reportingEmployeeId || allocation.employee_id}.`,
    );

    return updatedAllocation;
  }

  /**
   * Manager review of completed work.
   * - Verifies allocation status is WORK_COMPLETED.
   * - Verifies manager has access to the project.
   * - Updates status to AWAITING_RELEASE_CONFIRMATION.
   * - Stores review notes in allocation_decisions.
   * - Returns allocation with review status.
   */
  async reviewCompletion(
    allocationId: string,
    managerId?: string,
    reviewData?: ReviewCompletionDto,
  ) {
    const supabase = this.supabaseService.getClient();

    // 1. Fetch allocation
    const { data: allocation, error: fetchErr } = await supabase
      .from('allocations')
      .select('*, employees (id, name, email, role), projects (id, name, created_by, manager_id)')
      .eq('id', allocationId)
      .single();

    if (fetchErr || !allocation) {
      throw new NotFoundException(`Allocation with ID ${allocationId} not found`);
    }

    // 2. Verify status is WORK_COMPLETED
    if (allocation.status !== 'WORK_COMPLETED') {
      throw new BadRequestException(
        `Allocation ${allocationId} cannot be reviewed because its current status is '${allocation.status}'. Only 'WORK_COMPLETED' allocations can be reviewed.`,
      );
    }

    // 3. Verify manager project access
    const effectiveManagerId = reviewData?.manager_id || managerId;
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .select('id, name, manager_id, created_by')
      .eq('id', allocation.project_id)
      .single();

    if (projErr || !project) {
      throw new NotFoundException(`Project ${allocation.project_id} not found`);
    }

    if (effectiveManagerId) {
      const { data: manager } = await supabase
        .from('employees')
        .select('id, name, role')
        .eq('id', effectiveManagerId)
        .single();

      if (
        project.manager_id &&
        manager &&
        manager.role === 'MANAGER' &&
        project.manager_id !== effectiveManagerId
      ) {
        throw new ForbiddenException(
          `Manager ${effectiveManagerId} does not have management access to project ${allocation.project_id}.`,
        );
      }
    }

    // 4. Update allocation status to AWAITING_RELEASE_CONFIRMATION
    const { data: updatedAllocation, error: updateErr } = await supabase
      .from('allocations')
      .update({
        status: 'AWAITING_RELEASE_CONFIRMATION',
      })
      .eq('id', allocationId)
      .select('*, employees (id, name, email, role), projects (id, name)')
      .single();

    if (updateErr || !updatedAllocation) {
      this.logger.error(`Failed to update allocation to AWAITING_RELEASE_CONFIRMATION: ${updateErr?.message}`);
      throw new BadRequestException(
        `Failed to update allocation status: ${updateErr?.message}`,
      );
    }

    // 5. Store review notes in allocation_decisions
    const reviewNotes =
      reviewData?.review_notes ||
      `Work completion reviewed and approved for release by manager ${effectiveManagerId || 'Manager'}.`;

    const snapshot = {
      action: 'AWAITING_RELEASE_CONFIRMATION',
      reviewed_by: effectiveManagerId,
      reviewed_at: new Date().toISOString(),
      review_notes: reviewNotes,
      performance_feedback: reviewData?.performance_feedback,
    };

    try {
      await supabase.from('allocation_decisions').insert([
        {
          allocation_id: allocationId,
          employee_id: allocation.employee_id,
          project_id: allocation.project_id,
          fairness_score: 1.0,
          performance_score: 1.0,
          skill_score: 1.0,
          knowledge_score: 1.0,
          risk_score: 0.0,
          confidence: 1.0,
          final_score: 1.0,
          explanation: `Completion reviewed: ${reviewNotes}`,
          decision_snapshot: snapshot,
        },
      ]);
    } catch (e: any) {
      this.logger.warn(`allocation_decisions insert failed: ${e?.message}`);
    }

    this.logger.log(
      `Allocation ${allocationId} reviewed by manager ${effectiveManagerId}. Status updated to AWAITING_RELEASE_CONFIRMATION.`,
    );

    return {
      ...updatedAllocation,
      review_status: 'AWAITING_RELEASE_CONFIRMATION',
      reviewed_by: effectiveManagerId,
      review_notes: reviewNotes,
    };
  }

  /**
   * Manager release confirmation.
   * - Verifies allocation status is AWAITING_RELEASE_CONFIRMATION.
   * - Updates status to RELEASED and sets released_at timestamp.
   * - Updates employee current_workload_hours (subtracts allocated hours).
   * - Logs decision for release audit.
   * - Returns released allocation with freed capacity info.
   */
  async confirmRelease(
    allocationId: string,
    managerId?: string,
    releaseData?: ConfirmReleaseDto,
  ) {
    const supabase = this.supabaseService.getClient();

    // 1. Fetch allocation with employee capacity info
    const { data: allocation, error: fetchErr } = await supabase
      .from('allocations')
      .select('*, employees (id, name, email, current_workload_hours, weekly_capacity_hours), projects (id, name)')
      .eq('id', allocationId)
      .single();

    if (fetchErr || !allocation) {
      throw new NotFoundException(`Allocation with ID ${allocationId} not found`);
    }

    // 2. Verify status is AWAITING_RELEASE_CONFIRMATION
    if (allocation.status !== 'AWAITING_RELEASE_CONFIRMATION') {
      throw new BadRequestException(
        `Allocation ${allocationId} cannot be released because its current status is '${allocation.status}'. Only 'AWAITING_RELEASE_CONFIRMATION' allocations can be confirmed for release.`,
      );
    }

    const releasedAt = new Date().toISOString();
    const effectiveManagerId = releaseData?.manager_id || managerId;

    // 3. Update allocation status to RELEASED
    const { data: updatedAllocation, error: updateErr } = await supabase
      .from('allocations')
      .update({
        status: 'RELEASED',
        released_at: releasedAt,
      })
      .eq('id', allocationId)
      .select('*, employees (id, name, email, current_workload_hours, weekly_capacity_hours), projects (id, name)')
      .single();

    if (updateErr || !updatedAllocation) {
      this.logger.error(`Failed to release allocation: ${updateErr?.message}`);
      throw new BadRequestException(
        `Failed to confirm release for allocation ${allocationId}: ${updateErr?.message}`,
      );
    }

    // 4. Update employee current_workload_hours
    const allocatedHours = Number(
      allocation.allocated_hours_per_week ?? allocation.allocated_hours ?? 0,
    );
    const currentWorkload = Number(allocation.employees?.current_workload_hours ?? 0);
    const newWorkload = Math.max(0, currentWorkload - allocatedHours);

    const { error: empErr } = await supabase
      .from('employees')
      .update({
        current_workload_hours: newWorkload,
      })
      .eq('id', allocation.employee_id);

    if (empErr) {
      this.logger.warn(
        `Failed to decrement employee ${allocation.employee_id} workload: ${empErr.message}`,
      );
    }

    // 5. Create decision log & audit
    const releaseNotes =
      releaseData?.release_notes ||
      `Employee released from project ${allocation.projects?.name || allocation.project_id}. Capacity restored by ${allocatedHours}h.`;

    const snapshot = {
      action: 'RELEASED',
      released_by: effectiveManagerId,
      released_at: releasedAt,
      freed_capacity_hours: allocatedHours,
      previous_workload_hours: currentWorkload,
      new_workload_hours: newWorkload,
      release_notes: releaseNotes,
    };

    try {
      await supabase.from('decision_logs').insert([
        {
          allocation_id: allocationId,
          employee_id: allocation.employee_id,
          project_id: allocation.project_id,
          fairness: 1.0,
          performance: 1.0,
          skill_score: 1.0,
          knowledge_score: 1.0,
          risk_score: 0.0,
          confidence: 1.0,
          final_score: 1.0,
          explanation: `Allocation release confirmed: ${releaseNotes}`,
          decision_snapshot: snapshot,
        },
      ]);
    } catch (e: any) {
      this.logger.warn(`decision_logs release insert failed: ${e?.message}`);
    }

    try {
      await supabase.from('allocation_decisions').insert([
        {
          allocation_id: allocationId,
          employee_id: allocation.employee_id,
          project_id: allocation.project_id,
          fairness_score: 1.0,
          performance_score: 1.0,
          skill_score: 1.0,
          knowledge_score: 1.0,
          risk_score: 0.0,
          confidence: 1.0,
          final_score: 1.0,
          explanation: `Allocation release confirmed: ${releaseNotes}`,
          decision_snapshot: snapshot,
        },
      ]);
    } catch (e: any) {
      this.logger.warn(`allocation_decisions release dual-write failed: ${e?.message}`);
    }

    this.logger.log(
      `Allocation ${allocationId} successfully released by manager ${effectiveManagerId}. Freed ${allocatedHours}h for employee ${allocation.employee_id}.`,
    );

    return {
      message: 'Allocation release successfully confirmed and employee capacity restored',
      allocation: updatedAllocation,
      freed_capacity_info: {
        freed_capacity_hours: allocatedHours,
        employee_id: allocation.employee_id,
        employee_name: allocation.employees?.name,
        previous_workload_hours: currentWorkload,
        new_workload_hours: newWorkload,
        released_at: releasedAt,
      },
    };
  }

  /**
   * Get all allocations ready for release in a project.
   * - Queries allocations with status WORK_COMPLETED or AWAITING_RELEASE_CONFIRMATION.
   * - Filters by project_id.
   * - Includes employee name, allocated hours, completion date.
   */
  async getReleasableAllocations(projectId: string) {
    const supabase = this.supabaseService.getClient();

    // 1. Verify project exists
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', projectId)
      .single();

    if (projErr || !project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // 2. Query releasable allocations
    const { data: allocations, error: allocErr } = await supabase
      .from('allocations')
      .select(
        `
        id,
        project_id,
        employee_id,
        assigned_role,
        allocated_hours,
        allocated_hours_per_week,
        allocation_percentage,
        status,
        start_date,
        planned_end_date,
        actual_end_date,
        week_start_date,
        released_at,
        created_at,
        employees (
          id,
          name,
          email,
          role,
          current_workload_hours,
          weekly_capacity_hours
        )
      `,
      )
      .eq('project_id', projectId)
      .in('status', ['WORK_COMPLETED', 'AWAITING_RELEASE_CONFIRMATION'])
      .order('actual_end_date', { ascending: false, nullsFirst: false });

    if (allocErr) {
      this.logger.error(`Failed to fetch releasable allocations: ${allocErr.message}`);
      throw new BadRequestException(
        `Failed to fetch releasable allocations for project ${projectId}: ${allocErr.message}`,
      );
    }

    const releasableList = (allocations || []).map((alloc: any) => ({
      id: alloc.id,
      allocation_id: alloc.id,
      project_id: alloc.project_id,
      employee_id: alloc.employee_id,
      employee_name: alloc.employees?.name || 'Unknown',
      employee_email: alloc.employees?.email,
      employee_role: alloc.employees?.role,
      assigned_role: alloc.assigned_role,
      allocated_hours: Number(
        alloc.allocated_hours_per_week ?? alloc.allocated_hours ?? 0,
      ),
      allocation_percentage: alloc.allocation_percentage,
      status: alloc.status,
      completion_date: alloc.actual_end_date || alloc.week_start_date,
      actual_end_date: alloc.actual_end_date,
      week_start_date: alloc.week_start_date,
      current_workload_hours: alloc.employees?.current_workload_hours,
      weekly_capacity_hours: alloc.employees?.weekly_capacity_hours,
      created_at: alloc.created_at,
    }));

    return releasableList;
  }
}
