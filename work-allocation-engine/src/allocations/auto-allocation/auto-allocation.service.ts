import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';

import { SupabaseService } from '../../supabase/supabase.service';
import { DecisionEngineService } from '../../intelligence/decision-engine.service';
import { KnowledgeService } from '../../intelligence/knowledge/knowledge.service';
import { MlService } from '../../intelligence/ml/ml.service';
import { ExplanationService } from '../../intelligence/explanation/explanation.service';
import { DecisionLogsService } from '../decision-logs/decision-logs.service';
import { NotificationsService } from '../../notifications/notifications.service';

export interface RankedEmployee {
  employee_id: string;
  employee_name: string;
  remaining: number;
  fairness: number;
  performance: number;
  skillScore: number;
  knowledge: number;
  risk_score: number;
  confidence: number;
  final_score: number;
}

@Injectable()
export class AutoAllocationService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly decisionEngine: DecisionEngineService,
    private readonly knowledgeService: KnowledgeService,
    private readonly mlService: MlService,
    private readonly explanationService: ExplanationService,
    private readonly decisionLogsService: DecisionLogsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async autoAllocate(
    project_id: string,
    skill_name: string,
    required_hours: number,
    week_start_date: string,
  ) {
    const supabase = this.supabaseService.getClient();

    // 1. Fetch Project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      throw new NotFoundException('Project not found');
    }

    // 2. Fetch Skill
    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .select('*')
      .ilike('name', skill_name)
      .single();

    if (skillError || !skill) {
      throw new NotFoundException('Skill not found');
    }

    // 3. Fetch Employees with that skill
    const { data: employeeSkills } = await supabase
      .from('employee_skills')
      .select('employee_id, proficiency_level')
      .eq('skill_id', skill.id);

    const safeEmployeeSkills = employeeSkills || [];
    const employeeIds = safeEmployeeSkills.map((e: any) => e.employee_id);

    if (!employeeIds.length) {
      throw new NotFoundException('No employees found with the required skill');
    }

    // 4. Fetch Employees with deterministic ordering (M-1)
    const { data: employees } = await supabase
      .from('employees')
      .select('*')
      .in('id', employeeIds)
      .order('id', { ascending: true });

    const safeEmployees = employees || [];

    // 5. Fetch Existing Allocations
    const { data: allocations } = await supabase
      .from('allocations')
      .select('employee_id, allocated_hours')
      .in('employee_id', employeeIds)
      .eq('week_start_date', week_start_date);

    const safeAllocations = allocations || [];

    const allocationMap: Record<string, number> = {};
    for (const alloc of safeAllocations) {
      allocationMap[alloc.employee_id] =
        (allocationMap[alloc.employee_id] || 0) +
        Number(alloc.allocated_hours || 0);
    }

    // ────────────────────────────────────────────────────────────
    // PHASE 1 — HARD CONSTRAINTS (Gating Phase)
    // Run BEFORE any ML calls or soft scoring (C-3).
    // ────────────────────────────────────────────────────────────
    const skilledEmployeeIds = new Set(
      safeEmployeeSkills.map((e: any) => e.employee_id),
    );

    const eligible: Array<{ emp: any; allocated: number; capacity: number; remaining: number }> = [];
    const infeasible: Array<{ employee_id: string; employee_name: string; reason: string }> = [];

    for (const emp of safeEmployees) {
      const allocated = allocationMap[emp.id] || 0;
      const capacity = Number(emp.weekly_capacity_hours || 0);
      const remaining = Math.max(0, capacity - allocated);

      // Hard constraint 1: required skill
      if (!skilledEmployeeIds.has(emp.id)) {
        infeasible.push({
          employee_id: emp.id,
          employee_name: emp.name,
          reason: `Missing required skill: ${skill_name}`,
        });
        continue;
      }

      // Hard constraint 2: remaining capacity
      if (remaining < required_hours) {
        infeasible.push({
          employee_id: emp.id,
          employee_name: emp.name,
          reason: `Insufficient capacity: ${remaining}h remaining, ${required_hours}h required`,
        });
        continue;
      }

      eligible.push({ emp, allocated, capacity, remaining });
    }

    if (!eligible.length) {
      throw new BadRequestException({
        message: 'No employee satisfies the hard constraints for this allocation',
        required_hours,
        skill_name,
        rejected: infeasible,
      });
    }

    // Build proficiency map for scoring (H-1)
    const proficiencyByEmployee = new Map<string, number>();
    for (const row of safeEmployeeSkills) {
      const level = Number(row.proficiency_level ?? 3);
      proficiencyByEmployee.set(row.employee_id, level);
    }

    const skillScoreFor = (employeeId: string): number => {
      const level = proficiencyByEmployee.get(employeeId) ?? 3;
      const MAX_PROFICIENCY = 5;
      return this.decisionEngine.computeSkillMatch(
        Math.min(level, MAX_PROFICIENCY),
        MAX_PROFICIENCY,
      );
    };

    // ────────────────────────────────────────────────────────────
    // PHASE 2 — SOFT SCORING (Feasible candidates only)
    // ────────────────────────────────────────────────────────────
    const ranked: RankedEmployee[] = [];

    for (const { emp, allocated, capacity, remaining } of eligible) {
      const fairness = this.decisionEngine.computeFairness(allocated, capacity);
      const skillScore = skillScoreFor(emp.id);

      const prediction = await this.mlService.predict(emp.id, {
        skill_match_score: skillScore,
        workload_ratio: capacity > 0 ? allocated / capacity : 1,
        task_complexity: Number(project.complexity ?? project.project_complexity ?? 3) / 5,
        estimated_hours: required_hours,
        project_priority: Number(project.priority ?? project.project_priority ?? 3) / 5,
      });

      // Refuse to allocate on fabricated fallback data (C-4)
      if (prediction.is_fallback) {
        throw new ServiceUnavailableException(
          `ML service unavailable; refusing to allocate on fallback scores (employee ${emp.id})`,
        );
      }

      const performance = Number(prediction.predicted_performance ?? 0);
      const risk_score = Number(prediction.risk_score ?? 0);
      const confidence = Number(prediction.confidence ?? 0);

      // Real Knowledge Score calculation (H-2)
      const knowledge = await this.knowledgeService.getKnowledgeScore(emp.id);
      const risk = this.decisionEngine.computeRiskPenalty(risk_score);
      const weightedPerformance = this.decisionEngine.computePerformance(performance, confidence);

      const final_score = await this.decisionEngine.computeFinalScore({
        fairness,
        performance: weightedPerformance,
        skill: skillScore,
        knowledge,
        risk,
      });

      ranked.push({
        employee_id: emp.id,
        employee_name: emp.name,
        remaining,
        fairness,
        performance,
        skillScore,
        knowledge,
        risk_score,
        confidence,
        final_score,
      });
    }

    // ────────────────────────────────────────────────────────────
    // PHASE 3 — DETERMINISTIC SELECTION (M-1)
    // Tie-break on employee_id so equal scores never resolve by DB row order
    // ────────────────────────────────────────────────────────────
    const sorted = [...ranked].sort((a, b) => {
      if (b.final_score !== a.final_score) {
        return b.final_score - a.final_score;
      }
      return a.employee_id.localeCompare(b.employee_id);
    });

    const selected = sorted[0];

    // 6. Persist Allocation
    const { data: newAllocation, error: allocError } = await supabase
      .from('allocations')
      .insert([
        {
          project_id,
          employee_id: selected.employee_id,
          allocated_hours: required_hours,
          week_start_date,
        },
      ])
      .select();

    if (allocError) {
      throw new Error(allocError.message);
    }

    const allocationId = newAllocation?.[0]?.id;
    if (!allocationId) {
      throw new Error('Allocation insert returned no id; cannot write audit record');
    }

    // 7. Generate Explanation
    const explanation = this.explanationService.generateExplanation({
      employee_name: selected.employee_name,
      fairness: selected.fairness,
      performance: selected.performance,
      skillScore: selected.skillScore,
      risk_score: selected.risk_score,
      confidence: selected.confidence,
    });

    // 8. Log Decision with durable allocation_id (H-4) and dual-write (H-3)
    await this.decisionLogsService.logDecision({
      allocation_id: allocationId,
      employee_id: selected.employee_id,
      project_id,
      fairness: selected.fairness,
      performance: selected.performance,
      skillScore: selected.skillScore,
      knowledge: selected.knowledge,
      risk_score: selected.risk_score,
      confidence: selected.confidence,
      final_score: selected.final_score,
      explanation,
    });

    // 9. Notifications
    await this.notificationsService.notifyManager({
      projectId: project_id,
      employeeName: selected.employee_name,
      finalScore: selected.final_score,
      explanation,
    });

    await this.notificationsService.notifySelectedEmployee({
      employeeName: selected.employee_name,
      projectId: project_id,
    });

    await this.notificationsService.notifyRejectedEmployees({
      selectedEmployeeId: selected.employee_id,
      candidates: sorted,
    });

    return {
      message: 'Auto allocation successful',
      selected_employee: selected,
      allocation_id: allocationId,
      candidates: sorted,
    };
  }
}
