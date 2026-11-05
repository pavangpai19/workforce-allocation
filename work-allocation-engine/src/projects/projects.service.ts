import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export interface CreateProjectDto {
  name: string;
  domain?: string;
  project_priority?: number;
  priority?: number;
  description?: string;
  estimated_total_hours?: number;
  deadline?: string;
  end_date?: string;
  start_date?: string;
  required_team_size?: number;
  staffing_requirements?: Array<{
    required_role?: string;
    role?: string;
    skill_name?: string;
    skill?: string;
    skill_id?: string;
    minimum_proficiency?: number;
    min_proficiency?: number;
    required_headcount?: number;
    headcount?: number;
    allocation_hours_per_week?: number;
    hours_per_week?: number;
    preferred_skills?: string[];
    experience_level?: string;
    complexity?: number;
  }>;
  constraints?: {
    availability_window_start?: string;
    availability_window_end?: string;
    max_workload_ratio?: number;
    urgency?: string;
    include_available_after_release?: boolean;
    manager_notes?: string;
  };
}

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const supabase = this.supabaseService.getClient();

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error(`Failed to fetch projects: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }

    if (!projects || projects.length === 0) {
      return [];
    }

    // Fetch requirements and latest proposals for all projects
    const projectIds = projects.map((p) => p.id);

    const { data: requirements } = await supabase
      .from('project_staffing_requirements')
      .select('*, skills(id, name)')
      .in('project_id', projectIds);

    const { data: proposals } = await supabase
      .from('allocation_proposals')
      .select('*')
      .in('project_id', projectIds)
      .order('created_at', { ascending: false });

    const { data: allocations } = await supabase
      .from('allocations')
      .select('project_id, employee_id, allocated_hours')
      .in('project_id', projectIds);

    // Map projects with unified metadata
    return projects.map((p) => {
      const pReqs = (requirements || []).filter((r: any) => r.project_id === p.id);
      const pProps = (proposals || []).filter((pr: any) => pr.project_id === p.id);
      const latestProposal = pProps[0];
      const proposalWithDomain = pProps.find((pr: any) => pr.proposal_summary?.domain) || latestProposal;
      const summary = proposalWithDomain?.proposal_summary || {};
      const pAllocs = (allocations || []).filter((a: any) => a.project_id === p.id);
      const uniqueAssignedEmployees = new Set(pAllocs.map((a: any) => a.employee_id));

      const requiredTeamSize =
        latestProposal?.requested_team_size ||
        pReqs.reduce((sum: number, r: any) => sum + Number(r.required_headcount || 1), 0) ||
        1;

      const currentTeamSize = uniqueAssignedEmployees.size;
      const staffingCoveragePct =
        requiredTeamSize > 0
          ? Math.min(100, Math.round((currentTeamSize / requiredTeamSize) * 100))
          : 0;

      return {
        id: p.id,
        name: p.name,
        domain: summary.domain || 'Cloud Platform',
        priority: p.project_priority || 3,
        description: summary.description || 'Enterprise project with deterministic staffing governance.',
        status: p.status || 'ACTIVE',
        estimated_total_hours: p.estimated_total_hours || 200,
        start_date: p.start_date,
        end_date: p.end_date,
        deadline: p.end_date,
        required_team_size: requiredTeamSize,
        current_team_size: currentTeamSize,
        staffing_coverage_pct: staffingCoveragePct,
        health_score: 95,
        delivery_risk_pct: 12,
        staffing_requirements: pReqs.map((r: any) => ({
          id: r.id,
          role: r.required_role,
          skill: r.skills?.name || 'General Engineering',
          min_proficiency: r.minimum_proficiency,
          headcount: r.required_headcount,
          hours_per_week: r.allocation_hours_per_week,
          filled_headcount: 0,
        })),
        latest_proposal: latestProposal || null,
        constraints: summary.constraints || null,
        created_at: p.created_at,
      };
    });
  }

  async findById(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Fetch requirements with skills
    const { data: requirements } = await supabase
      .from('project_staffing_requirements')
      .select('*, skills(id, name)')
      .eq('project_id', id)
      .order('priority', { ascending: true });

    // Fetch proposals with members and employee details
    const { data: proposals } = await supabase
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
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    // Fetch active allocations
    const { data: allocations } = await supabase
      .from('allocations')
      .select('*, employees(id, name, email, weekly_capacity_hours)')
      .eq('project_id', id);

    // Fetch decision logs
    const { data: rawDecisionLogs } = await supabase
      .from('decision_logs')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    // Attach employee details to decision logs
    const safeDecisionLogs = rawDecisionLogs || [];
    let decisionLogsWithEmployees = safeDecisionLogs;

    if (safeDecisionLogs.length > 0) {
      const empIds = [...new Set(safeDecisionLogs.map((d: any) => d.employee_id))];
      const { data: logEmployees } = await supabase
        .from('employees')
        .select('id, name, email')
        .in('id', empIds);

      const empMap = new Map((logEmployees || []).map((e: any) => [e.id, e]));
      decisionLogsWithEmployees = safeDecisionLogs.map((d: any) => ({
        ...d,
        employees: empMap.get(d.employee_id) || null,
      }));
    }

    const latestProposal = (proposals && proposals[0]) || null;
    const proposalWithDomain =
      (proposals || []).find((pr: any) => pr.proposal_summary?.domain) || latestProposal;
    const summary = proposalWithDomain?.proposal_summary || {};
    const safeReqs = requirements || [];
    const safeAllocs = allocations || [];
    const uniqueEmployees = new Set(safeAllocs.map((a: any) => a.employee_id));

    const requiredTeamSize =
      latestProposal?.requested_team_size ||
      safeReqs.reduce((sum: number, r: any) => sum + Number(r.required_headcount || 1), 0) ||
      1;

    const currentTeamSize = uniqueEmployees.size;
    const staffingCoveragePct =
      requiredTeamSize > 0
        ? Math.min(100, Math.round((currentTeamSize / requiredTeamSize) * 100))
        : 0;

    return {
      id: project.id,
      name: project.name,
      domain: summary.domain || 'Cloud Platform',
      priority: project.project_priority || 3,
      description: summary.description || 'Enterprise project with deterministic staffing governance.',
      status: project.status || 'ACTIVE',
      estimated_total_hours: project.estimated_total_hours || 200,
      start_date: project.start_date,
      end_date: project.end_date,
      deadline: project.end_date,
      required_team_size: requiredTeamSize,
      current_team_size: currentTeamSize,
      staffing_coverage_pct: staffingCoveragePct,
      health_score: 95,
      delivery_risk_pct: 12,
      deadline_days: Math.max(
        0,
        Math.ceil(
          (new Date(project.end_date).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      ),
      staffing_requirements: safeReqs.map((r: any) => ({
        id: r.id,
        role: r.required_role,
        skill: r.skills?.name || 'General Engineering',
        min_proficiency: r.minimum_proficiency,
        headcount: r.required_headcount,
        hours_per_week: r.allocation_hours_per_week,
        filled_headcount: 0,
      })),
      proposals: proposals || [],
      latest_proposal: latestProposal,
      allocations: safeAllocs,
      decision_logs: decisionLogsWithEmployees || [],
      constraints: summary.constraints || null,
      created_at: project.created_at,
    };
  }

  async create(body: CreateProjectDto) {
    const supabase = this.supabaseService.getClient();

    const title = (body.name || '').trim();
    if (!title) {
      throw new BadRequestException('Project title is required');
    }

    const priority = Number(body.project_priority ?? body.priority ?? 3);
    const estimatedHours = Number(body.estimated_total_hours ?? 200);
    const startDate =
      body.start_date ||
      body.constraints?.availability_window_start ||
      new Date().toISOString().split('T')[0];
    const endDate =
      body.end_date ||
      body.deadline ||
      body.constraints?.availability_window_end ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // 1. Insert Project record
    const { data: project, error: projError } = await supabase
      .from('projects')
      .insert([
        {
          name: title,
          project_priority: priority,
          estimated_total_hours: estimatedHours,
          start_date: startDate,
          end_date: endDate,
          status: 'ACTIVE',
        },
      ])
      .select()
      .single();

    if (projError || !project) {
      this.logger.error(`Failed to insert project: ${projError?.message}`);
      throw new BadRequestException(`Failed to create project: ${projError?.message}`);
    }

    try {
      // 2. Fetch existing skills to resolve requirement skill_ids
      const { data: existingSkills } = await supabase
        .from('skills')
        .select('id, name');

      const skillsList = existingSkills || [];

      // Helper to resolve or create skill
      const resolveSkillId = async (rawSkillName?: string): Promise<string> => {
        const query = (rawSkillName || 'General Engineering').trim().toLowerCase();

        // Check exact or partial match in existing skills
        const match = skillsList.find((s: any) => {
          const sName = s.name.toLowerCase();
          return (
            sName === query ||
            query.includes(sName) ||
            sName.includes(query)
          );
        });

        if (match) {
          return match.id;
        }

        // Special common fallbacks
        if (query.includes('python') || query.includes('pytorch') || query.includes('ml')) {
          const pyMatch = skillsList.find((s: any) => s.name.toLowerCase().includes('python'));
          if (pyMatch) return pyMatch.id;
        }
        if (query.includes('postgre') || query.includes('sql') || query.includes('supabase') || query.includes('db')) {
          const pgMatch = skillsList.find((s: any) => s.name.toLowerCase().includes('postgre'));
          if (pgMatch) return pgMatch.id;
        }
        if (query.includes('react') || query.includes('frontend')) {
          const reactMatch = skillsList.find((s: any) => s.name.toLowerCase().includes('react'));
          if (reactMatch) return reactMatch.id;
        }

        // Auto-create skill if not found
        const cleanName = rawSkillName?.trim() || 'General Engineering';
        const { data: newSkill, error: skillInsertError } = await supabase
          .from('skills')
          .insert({ name: cleanName, category: 'Engineering' })
          .select()
          .single();

        if (skillInsertError || !newSkill) {
          // If fallback fails, return first existing skill ID
          return skillsList[0]?.id;
        }

        skillsList.push(newSkill);
        return newSkill.id;
      };

      // 3. Process and insert staffing requirements
      const rawRequirements = body.staffing_requirements || [];
      const requirementsToInsert: any[] = [];

      for (let i = 0; i < rawRequirements.length; i++) {
        const req = rawRequirements[i];
        const role = (req.required_role || req.role || 'Software Engineer').trim();
        const skillName = req.skill_name || req.skill || 'General Engineering';
        const skillId = req.skill_id || (await resolveSkillId(skillName));
        const minProficiency = Number(req.minimum_proficiency ?? req.min_proficiency ?? 3);
        const headcount = Number(req.required_headcount ?? req.headcount ?? 1);
        const hoursPerWeek = Number(req.allocation_hours_per_week ?? req.hours_per_week ?? 40);
        const allocationPct = Math.min(100, Math.round((hoursPerWeek / 40) * 100));

        requirementsToInsert.push({
          project_id: project.id,
          required_role: role,
          skill_id: skillId,
          minimum_proficiency: minProficiency,
          required_headcount: headcount,
          allocation_hours_per_week: hoursPerWeek,
          allocation_percentage: allocationPct,
          is_mandatory: true,
          priority: i + 1,
        });
      }

      let insertedRequirements: any[] = [];
      if (requirementsToInsert.length > 0) {
        const { data: reqData, error: reqError } = await supabase
          .from('project_staffing_requirements')
          .insert(requirementsToInsert)
          .select('*, skills(id, name)');

        if (reqError) {
          this.logger.error(`Failed to insert staffing requirements: ${reqError.message}`);
          throw new Error(`Failed to insert staffing requirements: ${reqError.message}`);
        }
        insertedRequirements = reqData || [];
      }

      // 4. Create initial DRAFT proposal holding metadata and governance constraints
      const plannedHeadcount = rawRequirements.reduce(
        (sum, r) => sum + Number(r.required_headcount ?? r.headcount ?? 1),
        0,
      );
      const requestedTeamSize = Number(body.required_team_size ?? (plannedHeadcount || 1));

      const { data: initialProposal, error: propError } = await supabase
        .from('allocation_proposals')
        .insert({
          project_id: project.id,
          status: 'DRAFT',
          requested_team_size: requestedTeamSize,
          selected_headcount: 0,
          proposal_summary: {
            domain: body.domain || 'Cloud Platform',
            description: body.description || '',
            constraints: body.constraints || {},
            target_deadline: endDate,
            created_via_wizard: true,
          },
          explanation: `Configured project basics and ${insertedRequirements.length} staffing slots. Ready for allocation analysis.`,
        })
        .select()
        .single();

      if (propError) {
        this.logger.warn(`Failed to insert initial proposal draft: ${propError.message}`);
      }

      return {
        ...project,
        domain: body.domain || 'Cloud Platform',
        description: body.description || '',
        required_team_size: requestedTeamSize,
        current_team_size: 0,
        staffing_requirements: insertedRequirements,
        initial_proposal: initialProposal || null,
        constraints: body.constraints || null,
      };
    } catch (err: any) {
      // Clean rollback on failure
      this.logger.error(`Rolling back project creation for ${project.id}: ${err.message}`);
      await supabase.from('project_staffing_requirements').delete().eq('project_id', project.id);
      await supabase.from('allocation_proposals').delete().eq('project_id', project.id);
      await supabase.from('projects').delete().eq('id', project.id);
      throw new InternalServerErrorException(`Project creation transaction failed: ${err.message}`);
    }
  }
}
