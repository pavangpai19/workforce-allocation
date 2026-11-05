import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import {
  CreateProposalPersistenceDto,
  ProposalStatus,
  ProposalAvailabilityStatus,
} from './dto/create-proposal-persistence.dto';
import { ApproveProposalDto } from './dto/approve-proposal.dto';
import { RejectProposalDto } from './dto/reject-proposal.dto';

@Injectable()
export class ProposalsService {
  private readonly logger = new Logger(ProposalsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async findById(proposalId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: proposal, error: propErr } = await supabase
      .from('allocation_proposals')
      .select('*')
      .eq('id', proposalId)
      .single();

    if (propErr || !proposal) {
      throw new NotFoundException(`Allocation proposal with ID ${proposalId} not found`);
    }

    const { data: members, error: memErr } = await supabase
      .from('allocation_proposal_members')
      .select(
        `
        *,
        employees (
          id,
          name,
          email,
          weekly_capacity_hours
        ),
        project_staffing_requirements (
          id,
          required_role,
          minimum_proficiency
        )
      `,
      )
      .eq('proposal_id', proposalId);

    if (memErr) {
      this.logger.warn(`Could not fetch members for proposal ${proposalId}: ${memErr.message}`);
    }

    return {
      ...proposal,
      members: members || [],
    };
  }

  async findByProjectId(projectId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('allocation_proposals')
      .select(
        `
        *,
        allocation_proposal_members (
          id,
          employee_id,
          proposed_role,
          final_score,
          availability_status,
          employees (id, name, email)
        )
      `,
      )
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(`Failed to fetch proposals for project: ${error.message}`);
    }

    return data || [];
  }

  async findAll(status?: string) {
    const supabase = this.supabaseService.getClient();

    let query = supabase
      .from('allocation_proposals')
      .select(
        `
        *,
        projects (id, name),
        allocation_proposal_members (
          id,
          employee_id,
          proposed_role,
          final_score,
          availability_status,
          employees (id, name, email)
        )
      `,
      )
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) {
      this.logger.warn(`Failed to fetch all proposals: ${error.message}`);
      return [];
    }

    return data || [];
  }

  async createProposal(dto: CreateProposalPersistenceDto) {
    const supabase = this.supabaseService.getClient();

    const initialStatus = dto.status || ProposalStatus.DRAFT;

    // 1. Insert proposal record
    const { data: proposal, error: propErr } = await supabase
      .from('allocation_proposals')
      .insert([
        {
          project_id: dto.project_id,
          requested_by: dto.requested_by,
          status: initialStatus,
          requested_team_size: dto.requested_team_size,
          selected_headcount: dto.selected_headcount,
          proposal_summary: dto.proposal_summary,
          staffing_gap_summary: dto.staffing_gap_summary,
          decision_weight_version: dto.decision_weight_version,
          model_version_summary: dto.model_version_summary,
          explanation: dto.explanation,
        },
      ])
      .select()
      .single();

    if (propErr || !proposal) {
      this.logger.error(`Failed to create proposal: ${propErr?.message}`);
      throw new BadRequestException(`Failed to persist allocation proposal: ${propErr?.message}`);
    }

    // 2. Insert member records if provided
    const memberRows = (dto.members || []).map((m) => ({
      proposal_id: proposal.id,
      employee_id: m.employee_id,
      staffing_requirement_id: m.staffing_requirement_id,
      proposed_role: m.proposed_role,
      allocated_hours_per_week: m.allocated_hours_per_week ?? 40,
      allocation_percentage: m.allocation_percentage ?? 100,
      eligibility_status: m.eligibility_status ?? 'ELIGIBLE',
      constraint_snapshot: m.constraint_snapshot ?? {},
      score_breakdown: m.score_breakdown ?? {},
      skill_match_score: m.skill_match_score,
      predicted_performance: m.predicted_performance,
      predicted_completion_hours: m.predicted_completion_hours,
      burnout_risk_probability: m.burnout_risk_probability,
      fairness_adjustment: m.fairness_adjustment,
      final_score: m.final_score,
      availability_status: m.availability_status || ProposalAvailabilityStatus.AVAILABLE_NOW,
      explanation: m.explanation,
    }));

    if (memberRows.length > 0) {
      const { error: memberErr } = await supabase
        .from('allocation_proposal_members')
        .insert(memberRows);

      if (memberErr) {
        this.logger.error(`Failed to insert proposal members: ${memberErr.message}`);
        // Clean up orphaned header
        await supabase.from('allocation_proposals').delete().eq('id', proposal.id);
        throw new BadRequestException(`Failed to persist proposal members: ${memberErr.message}`);
      }
    }

    return this.findById(proposal.id);
  }

  /**
   * Manager Proposal Approval.
   * State invariant: Commits to allocations only when proposal is in PENDING_APPROVAL.
   * Optimistic status claim prevents duplicate concurrent approvals.
   *
   * TODO (Phase 1B/1C): Replace multi-request proposal approval with a single PostgreSQL
   * RPC/stored function transaction using row locking (SELECT FOR UPDATE) for full database-level atomicity.
   */
  async approveProposal(
    proposalId: string,
    dto: ApproveProposalDto,
    currentUserEmployeeId?: string,
  ) {
    const supabase = this.supabaseService.getClient();

    // 1. Fetch current proposal state with members
    const proposal = await this.findById(proposalId);

    if (proposal.status !== 'PENDING_APPROVAL') {
      if (proposal.status === 'APPROVED') {
        throw new ConflictException(`Proposal ${proposalId} has already been approved.`);
      }
      if (proposal.status === 'REJECTED') {
        throw new BadRequestException(`Cannot approve proposal ${proposalId} because it was previously rejected.`);
      }
      throw new BadRequestException(
        `Proposal ${proposalId} cannot be approved because its current status is '${proposal.status}'. Only 'PENDING_APPROVAL' proposals can be approved.`,
      );
    }

    const reviewerId = dto.manager_id || currentUserEmployeeId || proposal.requested_by;

    // 2. Optimistic status claim: update status to APPROVED only if still PENDING_APPROVAL
    const { data: updatedRows, error: updateErr } = await supabase
      .from('allocation_proposals')
      .update({
        status: 'APPROVED',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId,
        review_comment: dto.review_comment,
      })
      .eq('id', proposalId)
      .eq('status', 'PENDING_APPROVAL')
      .select();

    if (updateErr) {
      throw new BadRequestException(`Failed to approve proposal: ${updateErr.message}`);
    }

    if (!updatedRows || updatedRows.length === 0) {
      throw new ConflictException(
        `Proposal ${proposalId} could not be approved due to a concurrent update or invalid status.`,
      );
    }

    // 3. Commit allocations for each proposed team member
    const createdAllocations: any[] = [];
    for (const member of proposal.members || []) {
      const { data: allocData, error: allocErr } = await supabase
        .from('allocations')
        .insert([
          {
            project_id: proposal.project_id,
            employee_id: member.employee_id,
            proposal_id: proposal.id,
            proposal_member_id: member.id,
            staffing_requirement_id: member.staffing_requirement_id,
            assigned_role: member.proposed_role,
            allocated_hours_per_week: member.allocated_hours_per_week ?? 40,
            allocated_hours: member.allocated_hours_per_week ?? 40,
            allocation_percentage: member.allocation_percentage ?? 100,
            status: 'ACTIVE',
            week_start_date: new Date().toISOString().split('T')[0],
          },
        ])
        .select();

      if (allocErr) {
        this.logger.error(
          `Failed to commit allocation for employee ${member.employee_id}: ${allocErr.message}`,
        );
        throw new BadRequestException(`Failed to commit allocation: ${allocErr.message}`);
      }

      const committedAlloc = allocData?.[0];
      if (committedAlloc) {
        createdAllocations.push(committedAlloc);

        // Record decision log & audit in both allocation_decisions and decision_logs
        await supabase.from('allocation_decisions').insert([
          {
            project_id: proposal.project_id,
            employee_id: member.employee_id,
            week_start_date: committedAlloc.week_start_date,
            fairness_score: member.fairness_adjustment ?? 0.85,
            performance_score: member.predicted_performance ?? 0.9,
            final_score: member.final_score ?? 0.9,
          },
        ]);

        await supabase.from('decision_logs').insert([
          {
            project_id: proposal.project_id,
            employee_id: member.employee_id,
            fairness: member.fairness_adjustment ?? 0.85,
            performance: member.predicted_performance ?? 0.9,
            skillscore: member.skill_match_score ?? 1.0,
            risk_score: member.burnout_risk_probability ?? 0.1,
            confidence: 0.95,
            final_score: member.final_score ?? 0.9,
            explanation:
              member.explanation ||
              `Approved allocation for ${member.proposed_role} under proposal ${proposal.id}.`,
          },
        ]);
      }
    }

    this.logger.log(
      `Proposal ${proposalId} successfully approved. ${createdAllocations.length} allocations committed.`,
    );

    return {
      message: 'Proposal successfully approved and allocations committed',
      proposal_id: proposalId,
      status: 'APPROVED',
      committed_allocations_count: createdAllocations.length,
      allocations: createdAllocations,
    };
  }

  /**
   * Manager Proposal Rejection.
   * Updates proposal status to REJECTED, preserves review comments, and commits 0 allocations.
   */
  async rejectProposal(
    proposalId: string,
    dto: RejectProposalDto,
    currentUserEmployeeId?: string,
  ) {
    const supabase = this.supabaseService.getClient();

    // 1. Fetch current proposal state
    const proposal = await this.findById(proposalId);

    if (proposal.status === 'APPROVED') {
      throw new BadRequestException(
        `Cannot reject proposal ${proposalId} because it has already been approved and committed.`,
      );
    }

    if (proposal.status === 'REJECTED') {
      throw new ConflictException(`Proposal ${proposalId} is already rejected.`);
    }

    if (proposal.status !== 'PENDING_APPROVAL') {
      throw new BadRequestException(
        `Proposal ${proposalId} cannot be rejected because its current status is '${proposal.status}'. Only 'PENDING_APPROVAL' proposals can be rejected.`,
      );
    }

    const reviewerId = dto.manager_id || currentUserEmployeeId || proposal.requested_by;

    // 2. Optimistic status claim: update status to REJECTED only if still PENDING_APPROVAL
    const { data: updatedRows, error: updateErr } = await supabase
      .from('allocation_proposals')
      .update({
        status: 'REJECTED',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId,
        review_comment: dto.review_comment,
      })
      .eq('id', proposalId)
      .eq('status', 'PENDING_APPROVAL')
      .select();

    if (updateErr) {
      throw new BadRequestException(`Failed to reject proposal: ${updateErr.message}`);
    }

    if (!updatedRows || updatedRows.length === 0) {
      throw new ConflictException(
        `Proposal ${proposalId} could not be rejected due to a concurrent update or invalid status.`,
      );
    }

    this.logger.log(`Proposal ${proposalId} marked as REJECTED. Zero allocations committed.`);

    return {
      message: 'Proposal rejected. Zero allocations were committed.',
      proposal_id: proposalId,
      status: 'REJECTED',
      reviewed_by: reviewerId,
      review_comment: dto.review_comment,
    };
  }
}
