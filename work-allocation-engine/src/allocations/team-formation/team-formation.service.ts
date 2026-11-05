import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { MlService } from '../../intelligence/ml/ml.service';
import { DecisionLogsService } from '../decision-logs/decision-logs.service';

export interface StaffingRequirement {
  id: string;
  project_id: string;
  required_role: string;
  skill_id: string;
  minimum_proficiency: number;
  required_headcount: number;
  allocation_hours_per_week: number;
  is_mandatory: boolean;
  priority: number;
  skills?: {
    id: string;
    name: string;
  };
}

export interface CandidateScore {
  employee_id: string;
  employee_name: string;
  staffing_requirement_id: string;
  proposed_role: string;
  skill_match_score: number;
  predicted_performance: number;
  fairness_adjustment: number;
  final_score: number;
  allocated_hours_per_week: number;
  availability_status: string;
  constraint_snapshot: Record<string, any>;
  explanation?: string;
}

@Injectable()
export class TeamFormationService {
  private readonly logger = new Logger(TeamFormationService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly mlService: MlService,
    private readonly decisionLogsService: DecisionLogsService,
  ) {}

  async generateTeamProposal(
    projectId: string,
    maxCandidatesPerRole = 5,
    includeFairness = true,
  ): Promise<{
    proposalId: string;
    proposedMembers: CandidateScore[];
    requestedTeamSize: number;
    selectedHeadcount: number;
    staffingGapSummary?: string;
    explanation?: string;
  }> {
    const client = this.supabase.getClient();

    // Step 1: Fetch Project
    const { data: project, error: projError } = await client
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projError || !project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    // Step 2: Fetch Staffing Requirements
    const { data: requirements, error: reqError } = await client
      .from('project_staffing_requirements')
      .select('*, skills(id, name)')
      .eq('project_id', projectId)
      .order('priority', { ascending: true });

    if (reqError || !requirements || requirements.length === 0) {
      throw new NotFoundException(
        `No staffing requirements found for project ${projectId}`,
      );
    }

    // Step 3: Fetch all active employees
    const { data: employees, error: empError } = await client
      .from('employees')
      .select('id, name, weekly_capacity_hours, efficiency_score, reliability_score');

    if (empError || !employees || employees.length === 0) {
      throw new NotFoundException('No employees available in system');
    }

    // Step 4: Fetch all employee skills
    const { data: employeeSkills } = await client
      .from('employee_skills')
      .select('employee_id, skill_id, proficiency_level');

    const safeEmployeeSkills = employeeSkills || [];

    // Step 5: Fetch existing active allocations to determine current workload
    const { data: activeAllocations } = await client
      .from('allocations')
      .select('employee_id, allocated_hours')
      .eq('status', 'ACTIVE');

    const workloadMap = new Map<string, number>();
    for (const alloc of activeAllocations || []) {
      const current = workloadMap.get(alloc.employee_id) || 0;
      workloadMap.set(alloc.employee_id, current + Number(alloc.allocated_hours || 0));
    }

    // Step 6: Multi-role evaluation with real Python ML inference & decision logging
    const allCandidates: CandidateScore[] = [];
    const assignedEmployeeIds = new Set<string>();
    let totalRequiredHeadcount = 0;

    for (const req of requirements) {
      const neededHeadcount = Number(req.required_headcount || 1);
      totalRequiredHeadcount += neededHeadcount;
      const minProficiency = Number(req.minimum_proficiency || 1);
      const requiredHours = Number(req.allocation_hours_per_week || 40);
      const roleName = req.required_role;
      const skillName = req.skills?.name || 'Required Skill';

      const eligibleCandidates: Array<{
        employee: any;
        skillMatchScore: number;
        proficiency: number;
        currentWorkload: number;
        availableCapacity: number;
        maxCapacity: number;
        mlPrediction: any;
        fairnessAdjustment: number;
        finalScore: number;
      }> = [];

      for (const employee of employees) {
        const empSkill = safeEmployeeSkills.find(
          (es: any) => es.employee_id === employee.id && es.skill_id === req.skill_id,
        );

        // Check if employee has the skill
        if (!empSkill) {
          continue;
        }

        const proficiency = Number(empSkill.proficiency_level ?? 0);
        const maxCapacity = Number(employee.weekly_capacity_hours || 40);
        const currentWorkload = workloadMap.get(employee.id) || 0;
        const availableCapacity = Math.max(0, maxCapacity - currentWorkload);

        // Hard constraint 1: Minimum proficiency check
        if (proficiency < minProficiency) {
          try {
            await this.decisionLogsService.logDecision({
              allocation_id: projectId,
              employee_id: employee.id,
              project_id: projectId,
              fairness: 0,
              performance: 0,
              skillScore: proficiency / 5.0,
              knowledge: 0.5,
              risk_score: 0.8,
              confidence: 0.3,
              final_score: 0.1,
              explanation: `Rejected for ${roleName}: Proficiency (${proficiency}/5 in ${skillName}) is below minimum requirement (${minProficiency}/5).`,
            });
          } catch (e: any) {
            this.logger.warn(`Decision log error: ${e.message}`);
          }
          continue;
        }

        // Hard constraint 2: Capacity check
        if (availableCapacity < requiredHours) {
          try {
            await this.decisionLogsService.logDecision({
              allocation_id: projectId,
              employee_id: employee.id,
              project_id: projectId,
              fairness: 0,
              performance: 0,
              skillScore: proficiency / 5.0,
              knowledge: 0.5,
              risk_score: 0.9,
              confidence: 0.3,
              final_score: 0.15,
              explanation: `Rejected for ${roleName}: Insufficient capacity. Available: ${availableCapacity} hrs/wk, Required: ${requiredHours} hrs/wk.`,
            });
          } catch (e: any) {
            this.logger.warn(`Decision log error: ${e.message}`);
          }
          continue;
        }

        // 9-Feature ML Inference via Python ML service
        const skillMatchScore = Math.min(1.0, Math.max(0.0, proficiency / 5.0));
        const workloadRatio = maxCapacity > 0 ? Math.min(1.0, currentWorkload / maxCapacity) : 0;
        const taskComplexity = Math.min(
          1.0,
          minProficiency * 0.15 + Number(project.project_priority || 3) * 0.05,
        );
        const estimatedHours = requiredHours;
        const projectPriority = Number(project.project_priority || 3);

        const mlResult = await this.mlService.predict(employee.id, {
          skill_match_score: skillMatchScore,
          workload_ratio: workloadRatio,
          task_complexity: taskComplexity,
          estimated_hours: estimatedHours,
          project_priority: projectPriority,
        });

        // Hard constraint 3: ML Burnout risk guardrail
        if (mlResult.burnout_probability > 0.85) {
          try {
            await this.decisionLogsService.logDecision({
              allocation_id: projectId,
              employee_id: employee.id,
              project_id: projectId,
              fairness: 0,
              performance: mlResult.predicted_performance,
              skillScore: skillMatchScore,
              knowledge: 0.5,
              risk_score: mlResult.burnout_probability,
              confidence: mlResult.delivery_confidence,
              final_score: 0.2,
              explanation: `Rejected for ${roleName}: High burnout risk (${(mlResult.burnout_probability * 100).toFixed(0)}%) exceeds governance safety threshold.`,
            });
          } catch (e: any) {
            this.logger.warn(`Decision log error: ${e.message}`);
          }
          continue;
        }

        // Composite scoring
        const fairnessAdjustment = includeFairness
          ? Math.max(0.0, 0.2 - workloadRatio * 0.2)
          : 0.0;

        const finalScore = Number(
          (
            skillMatchScore * 0.4 +
            mlResult.predicted_performance * 0.4 +
            fairnessAdjustment * 0.2
          ).toFixed(4),
        );

        eligibleCandidates.push({
          employee,
          skillMatchScore,
          proficiency,
          currentWorkload,
          availableCapacity,
          maxCapacity,
          mlPrediction: mlResult,
          fairnessAdjustment,
          finalScore,
        });
      }

      // Rank eligible candidates by finalScore descending
      eligibleCandidates.sort((a, b) => b.finalScore - a.finalScore);

      // Select top candidates up to neededHeadcount that haven't been assigned
      let selectedForThisReq = 0;

      for (const cand of eligibleCandidates) {
        if (
          !assignedEmployeeIds.has(cand.employee.id) &&
          selectedForThisReq < neededHeadcount
        ) {
          assignedEmployeeIds.add(cand.employee.id);
          selectedForThisReq++;

          const explanation = `Selected for ${roleName}: Skill match ${(cand.skillMatchScore * 100).toFixed(0)}% (Prof: ${cand.proficiency}/5 in ${skillName}), ML predicted performance ${(cand.mlPrediction.predicted_performance * 100).toFixed(0)}%, delivery confidence ${(cand.mlPrediction.delivery_confidence * 100).toFixed(0)}%, available capacity ${cand.availableCapacity}h/wk.`;

          const candidateScore: CandidateScore = {
            employee_id: cand.employee.id,
            employee_name: cand.employee.name,
            staffing_requirement_id: req.id,
            proposed_role: roleName,
            skill_match_score: Number(cand.skillMatchScore.toFixed(4)),
            predicted_performance: Number(cand.mlPrediction.predicted_performance.toFixed(4)),
            fairness_adjustment: Number(cand.fairnessAdjustment.toFixed(4)),
            final_score: cand.finalScore,
            allocated_hours_per_week: requiredHours,
            availability_status: 'AVAILABLE_NOW',
            constraint_snapshot: {
              skill_threshold_passed: true,
              minimum_proficiency_required: minProficiency,
              employee_proficiency: cand.proficiency,
              capacity_passed: true,
              available_capacity_hours: cand.availableCapacity,
              required_hours: requiredHours,
              burnout_risk_acceptable: true,
              burnout_risk_probability: cand.mlPrediction.burnout_probability,
              current_workload_hours: cand.currentWorkload,
              max_capacity_hours: cand.maxCapacity,
            },
            explanation,
          };

          allCandidates.push(candidateScore);

          // Log durable decision log for proposed candidate
          try {
            await this.decisionLogsService.logDecision({
              allocation_id: projectId,
              employee_id: cand.employee.id,
              project_id: projectId,
              fairness: cand.fairnessAdjustment,
              performance: cand.mlPrediction.predicted_performance,
              skillScore: cand.skillMatchScore,
              knowledge: 0.85,
              risk_score: cand.mlPrediction.burnout_probability,
              confidence: cand.mlPrediction.delivery_confidence,
              final_score: cand.finalScore,
              explanation,
            });
          } catch (e: any) {
            this.logger.warn(`Decision log error for proposed candidate: ${e.message}`);
          }
        } else {
          // Candidate evaluated but not selected (lower rank or already assigned)
          const rejectionReason = assignedEmployeeIds.has(cand.employee.id)
            ? `Not selected for ${roleName}: Candidate already assigned to another requirement in this proposal.`
            : `Evaluated for ${roleName} but ranked lower: Final score ${cand.finalScore.toFixed(3)} vs selected threshold (Proficiency: ${cand.proficiency}/5, ML Performance: ${cand.mlPrediction.predicted_performance.toFixed(2)}, Workload: ${cand.currentWorkload}h).`;

          try {
            await this.decisionLogsService.logDecision({
              allocation_id: projectId,
              employee_id: cand.employee.id,
              project_id: projectId,
              fairness: cand.fairnessAdjustment,
              performance: cand.mlPrediction.predicted_performance,
              skillScore: cand.skillMatchScore,
              knowledge: 0.7,
              risk_score: cand.mlPrediction.burnout_probability,
              confidence: cand.mlPrediction.delivery_confidence,
              final_score: cand.finalScore,
              explanation: rejectionReason,
            });
          } catch (e: any) {
            this.logger.warn(`Decision log error for rejected candidate: ${e.message}`);
          }
        }
      }
    }

    // Step 7: Create or update allocation_proposals record
    const { data: existingProposals } = await client
      .from('allocation_proposals')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    const draftProposal =
      (existingProposals || []).find((p: any) => p.status === 'DRAFT') ||
      existingProposals?.[0];
    const prevSummary = draftProposal?.proposal_summary || {};

    const { data: proposal, error: proposalError } = await client
      .from('allocation_proposals')
      .insert({
        project_id: projectId,
        status: 'PENDING_APPROVAL',
        requested_team_size: totalRequiredHeadcount,
        selected_headcount: allCandidates.length,
        proposal_summary: {
          ...prevSummary,
          generated_at: new Date().toISOString(),
          total_requirements: requirements.length,
          total_candidates: allCandidates.length,
          include_fairness: includeFairness,
          max_candidates_per_role: maxCandidatesPerRole,
        },
        explanation: `Generated deterministic team proposal with ${allCandidates.length} candidate slots across ${requirements.length} staffing requirements using 9-feature ML model inference.`,
      })
      .select()
      .single();

    if (proposalError || !proposal) {
      this.logger.error(`Failed to create proposal record: ${proposalError?.message}`);
      throw new ConflictException('Failed to create allocation proposal record');
    }

    // Step 8: Create allocation_proposal_members records
    const membersToInsert = allCandidates.map((c) => ({
      proposal_id: proposal.id,
      employee_id: c.employee_id,
      staffing_requirement_id: c.staffing_requirement_id,
      proposed_role: c.proposed_role,
      allocated_hours_per_week: c.allocated_hours_per_week,
      allocation_percentage: 100,
      eligibility_status: 'ELIGIBLE',
      constraint_snapshot: c.constraint_snapshot,
      score_breakdown: {
        skill_match_score: c.skill_match_score,
        predicted_performance: c.predicted_performance,
        fairness_adjustment: c.fairness_adjustment,
        final_score: c.final_score,
      },
      skill_match_score: c.skill_match_score,
      predicted_performance: c.predicted_performance,
      fairness_adjustment: c.fairness_adjustment,
      final_score: c.final_score,
      availability_status: c.availability_status,
      explanation: c.explanation || `Final score: ${c.final_score.toFixed(4)}`,
    }));

    if (membersToInsert.length > 0) {
      const { error: membersError } = await client
        .from('allocation_proposal_members')
        .insert(membersToInsert);

      if (membersError) {
        this.logger.error(`Failed to insert proposal members: ${membersError.message}`);
        await client.from('allocation_proposals').delete().eq('id', proposal.id);
        throw new ConflictException(
          `Failed to persist proposed team members: ${membersError.message}`,
        );
      }
    }

    const staffingGapSummary =
      allCandidates.length < totalRequiredHeadcount
        ? `Shortfall: ${totalRequiredHeadcount - allCandidates.length} positions could not be filled with eligible candidates.`
        : undefined;

    return {
      proposalId: proposal.id,
      proposedMembers: allCandidates,
      requestedTeamSize: totalRequiredHeadcount,
      selectedHeadcount: allCandidates.length,
      staffingGapSummary,
      explanation: `Generated ${allCandidates.length} candidate${allCandidates.length !== 1 ? 's' : ''} for ${requirements.length} role requirement${requirements.length !== 1 ? 's' : ''}.`,
    };
  }

  async getProposal(proposalId: string) {
    const client = this.supabase.getClient();

    const { data: proposal, error: propError } = await client
      .from('allocation_proposals')
      .select(
        `
        *,
        allocation_proposal_members (
          id,
          employee_id,
          proposed_role,
          staffing_requirement_id,
          allocated_hours_per_week,
          availability_status,
          skill_match_score,
          predicted_performance,
          fairness_adjustment,
          final_score,
          constraint_snapshot,
          score_breakdown,
          explanation,
          employees (
            id,
            name,
            email,
            weekly_capacity_hours
          )
        )
      `,
      )
      .eq('id', proposalId)
      .single();

    if (propError || !proposal) {
      throw new NotFoundException(`Proposal ${proposalId} not found`);
    }

    return proposal;
  }
}
