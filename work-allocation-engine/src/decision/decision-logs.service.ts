import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateDecisionLogDto, DecisionType } from './dto/create-decision-log.dto';

@Injectable()
export class DecisionLogsService {
  private readonly logger = new Logger(DecisionLogsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Create a comprehensive decision log entry.
   * Inserts into decision_logs with full context and dual-writes to allocation_decisions.
   */
  async createDecisionLog(dto: CreateDecisionLogDto) {
    const supabase = this.supabaseService.getClient();

    const fairness = dto.fairness ?? dto.decision_context?.fairness ?? 1.0;
    const performance = dto.performance ?? dto.decision_context?.performance ?? 1.0;
    const skillScore = dto.skill_score ?? dto.decision_context?.skill_score ?? 1.0;
    const knowledgeScore = dto.knowledge_score ?? dto.decision_context?.knowledge_score ?? 1.0;
    const riskScore = dto.risk_score ?? dto.decision_context?.risk_score ?? 0.0;
    const confidence = dto.confidence ?? dto.decision_context?.confidence ?? 1.0;
    const finalScore = dto.final_score ?? dto.decision_context?.final_score ?? 1.0;

    const explanation = dto.explanation || `Decision logged for ${dto.decision_type || 'ALLOCATION'}`;

    const snapshot = {
      decision_type: dto.decision_type,
      entity_id: dto.entity_id,
      entity_type: dto.entity_type || 'ALLOCATION',
      decision_outcome: dto.decision_outcome,
      decided_by: dto.decided_by,
      fairness: Number(fairness.toFixed(4)),
      performance: Number(performance.toFixed(4)),
      skill: Number(skillScore.toFixed(4)),
      knowledge: Number(knowledgeScore.toFixed(4)),
      risk: Number(riskScore.toFixed(4)),
      confidence: Number(confidence.toFixed(4)),
      final_score: Number(finalScore.toFixed(4)),
      decision_context: dto.decision_context || {},
      generated_at: new Date().toISOString(),
    };

    const isAllocation = !dto.entity_type || dto.entity_type.toUpperCase() === 'ALLOCATION';
    const isProposal = dto.entity_type?.toUpperCase() === 'PROPOSAL';

    const logRow: Record<string, any> = {
      allocation_id: isAllocation ? dto.entity_id : undefined,
      proposal_id: isProposal ? dto.entity_id : undefined,
      employee_id: dto.employee_id,
      project_id: dto.project_id,
      fairness: Number(fairness.toFixed(4)),
      performance: Number(performance.toFixed(4)),
      skill_score: Number(skillScore.toFixed(4)),
      knowledge_score: Number(knowledgeScore.toFixed(4)),
      risk_score: Number(riskScore.toFixed(4)),
      confidence: Number(confidence.toFixed(4)),
      final_score: Number(finalScore.toFixed(4)),
      explanation,
      decision_snapshot: snapshot,
    };

    // Remove undefined values
    Object.keys(logRow).forEach((key) => {
      if (logRow[key] === undefined) delete logRow[key];
    });

    const { data: createdLog, error } = await supabase
      .from('decision_logs')
      .insert([logRow])
      .select()
      .single();

    if (error) {
      this.logger.error(`decision_logs insert failed: ${error.message}`);
      throw new BadRequestException(`Failed to persist decision log: ${error.message}`);
    }

    // Dual-write to allocation_decisions when allocation_id or employee_id is present
    if (logRow.allocation_id || (dto.employee_id && dto.project_id)) {
      try {
        await supabase.from('allocation_decisions').insert([
          {
            allocation_id: logRow.allocation_id,
            employee_id: dto.employee_id,
            project_id: dto.project_id,
            fairness_score: logRow.fairness,
            performance_score: logRow.performance,
            skill_score: logRow.skill_score,
            knowledge_score: logRow.knowledge_score,
            risk_score: logRow.risk_score,
            confidence: logRow.confidence,
            final_score: logRow.final_score,
            explanation,
            decision_snapshot: snapshot,
          },
        ]);
      } catch (decisionErr: any) {
        this.logger.warn(`allocation_decisions dual-write failed: ${decisionErr?.message}`);
      }
    }

    return createdLog;
  }

  /**
   * Compatibility method for existing scoring pipeline logging (H-3, H-4).
   */
  async logDecision(data: {
    allocation_id: string;
    employee_id: string;
    project_id: string;
    fairness: number;
    performance: number;
    skillScore: number;
    knowledge: number;
    risk_score: number;
    confidence: number;
    final_score: number;
    explanation: string;
  }) {
    return this.createDecisionLog({
      decision_type: DecisionType.ALLOCATION,
      entity_id: data.allocation_id,
      entity_type: 'ALLOCATION',
      employee_id: data.employee_id,
      project_id: data.project_id,
      fairness: data.fairness,
      performance: data.performance,
      skill_score: data.skillScore,
      knowledge_score: data.knowledge,
      risk_score: data.risk_score,
      confidence: data.confidence,
      final_score: data.final_score,
      explanation: data.explanation,
    });
  }

  /**
   * Query decision logs filtered by entity and ordered by created_at DESC.
   */
  async getDecisionHistory(
    entityId: string,
    entityType: string,
    requestingUser?: any,
  ) {
    const supabase = this.supabaseService.getClient();

    const normalizedType = (entityType || 'ALLOCATION').toUpperCase();

    let query = supabase
      .from('decision_logs')
      .select(
        `
        *,
        employees (id, name, email),
        projects (id, name)
      `,
      );

    if (normalizedType === 'ALLOCATION') {
      query = query.eq('allocation_id', entityId);
    } else if (normalizedType === 'PROPOSAL') {
      query = query.eq('proposal_id', entityId);
    } else if (normalizedType === 'EMPLOYEE') {
      query = query.eq('employee_id', entityId);
    } else if (normalizedType === 'PROJECT') {
      query = query.eq('project_id', entityId);
    }

    query = query.order('created_at', { ascending: false });

    const { data: logs, error } = await query;

    if (error) {
      this.logger.error(`Failed to fetch decision history: ${error.message}`);
      throw new BadRequestException(`Failed to fetch decision history: ${error.message}`);
    }

    const safeLogs = logs || [];

    // Role-based visibility enforcement: EMPLOYEES can only see decisions regarding themselves
    if (requestingUser?.role === 'EMPLOYEE') {
      const userEmployeeId = requestingUser.employeeId || requestingUser.employee_id;
      const filtered = safeLogs.filter((log) => log.employee_id === userEmployeeId);
      return filtered;
    }

    return safeLogs;
  }

  /**
   * Retrieve project audit trail with full allocation and proposal history.
   */
  async getAuditTrail(projectId: string) {
    const supabase = this.supabaseService.getClient();

    // 1. Verify project exists
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .select('id, name, created_at')
      .eq('id', projectId)
      .single();

    if (projErr || !project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // 2. Fetch all decision logs for project
    const { data: logs, error: logsErr } = await supabase
      .from('decision_logs')
      .select(
        `
        *,
        employees (id, name, email),
        projects (id, name)
      `,
      )
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (logsErr) {
      this.logger.error(`Failed to fetch audit trail: ${logsErr.message}`);
      throw new BadRequestException(`Failed to fetch audit trail: ${logsErr.message}`);
    }

    const auditEvents = (logs || []).map((log: any) => ({
      id: log.id,
      decision_id: log.id,
      decision_type: log.decision_snapshot?.decision_type || 'ALLOCATION',
      decision_outcome: log.decision_snapshot?.decision_outcome || 'RECORDED',
      allocation_id: log.allocation_id,
      proposal_id: log.proposal_id,
      project_id: log.project_id,
      project_name: log.projects?.name || project.name,
      employee_id: log.employee_id,
      employee_name: log.employees?.name,
      employee_role: log.employees?.role,
      decided_by: log.decision_snapshot?.decided_by || log.decision_snapshot?.reviewed_by || 'SYSTEM',
      scores: {
        fairness: log.fairness,
        performance: log.performance,
        skill_score: log.skill_score,
        knowledge_score: log.knowledge_score,
        risk_score: log.risk_score,
        confidence: log.confidence,
        final_score: log.final_score,
      },
      explanation: log.explanation,
      context_snapshot: log.decision_snapshot,
      created_at: log.created_at,
    }));

    return {
      project_id: projectId,
      project_name: project.name,
      total_events: auditEvents.length,
      audit_trail: auditEvents,
    };
  }

  /**
   * Export complete decision log as structured audit JSON.
   */
  async exportDecisionLog(decisionLogId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: log, error } = await supabase
      .from('decision_logs')
      .select(
        `
        *,
        employees (id, name, email),
        projects (id, name)
      `,
      )
      .eq('id', decisionLogId)
      .single();

    if (error || !log) {
      throw new NotFoundException(`Decision log with ID ${decisionLogId} not found`);
    }

    const snapshot = log.decision_snapshot || {};

    const exportableRecord = {
      export_metadata: {
        exported_at: new Date().toISOString(),
        version: '1.0',
        format: 'AUDIT_RECORD_JSON',
      },
      decision_id: log.id,
      decision_type: snapshot.decision_type || 'ALLOCATION',
      decision_outcome: snapshot.decision_outcome || 'RECORDED',
      entity_id: log.allocation_id || log.proposal_id || snapshot.entity_id,
      entity_type: snapshot.entity_type || (log.allocation_id ? 'ALLOCATION' : 'PROPOSAL'),
      project: {
        id: log.project_id,
        name: log.projects?.name,
      },
      employee: {
        id: log.employee_id,
        name: log.employees?.name,
        email: log.employees?.email,
        role: log.employees?.role,
        department: log.employees?.department,
      },
      decided_by: snapshot.decided_by || snapshot.reviewed_by || 'SYSTEM',
      scores: {
        fairness_score: log.fairness,
        performance_score: log.performance,
        skill_match_score: log.skill_score,
        knowledge_score: log.knowledge_score,
        risk_score: log.risk_score,
        confidence_score: log.confidence,
        final_score: log.final_score,
      },
      constraints: snapshot.decision_context?.constraints || {},
      explanation: log.explanation,
      decision_context: snapshot.decision_context || snapshot,
      created_at: log.created_at,
    };

    return exportableRecord;
  }
}
