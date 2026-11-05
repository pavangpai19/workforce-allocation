import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class KnowledgeService {
  constructor(
    private readonly supabaseService: SupabaseService,
  ) {}

  /**
   * ==========================================================
   * Build / Update Employee Knowledge
   * ==========================================================
   */
  async buildKnowledge(employeeId: string) {
    const supabase = this.supabaseService.getClient();

    // --------------------------------------------------
    // Employee
    // --------------------------------------------------

    const { data: employee, error: employeeError } =
      await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();

    if (employeeError || !employee) {
      throw new NotFoundException('Employee not found');
    }

    // --------------------------------------------------
    // Skills
    // --------------------------------------------------

    const { data: skills } = await supabase
      .from('employee_skills')
      .select(
        `
        proficiency_level,
        skills(name)
      `,
      )
      .eq('employee_id', employeeId);

    // --------------------------------------------------
    // Performance
    // --------------------------------------------------

    const { data: performance } = await supabase
      .from('employee_performance')
      .select('*')
      .eq('employee_id', employeeId);

    // --------------------------------------------------
    // Task History
    // --------------------------------------------------

    const { data: taskHistory } = await supabase
      .from('task_history')
      .select('*')
      .eq('employee_id', employeeId);

    // --------------------------------------------------
    // Calculations
    // --------------------------------------------------

    const completedProjects = performance?.length ?? 0;

    const averageQuality =
      performance?.length
        ? performance.reduce(
            (sum, p) =>
              sum + Number(p.quality_score ?? 0),
            0,
          ) / performance.length
        : 0;

    const averageDelay =
      taskHistory?.length
        ? taskHistory.reduce(
            (sum, t) =>
              sum + Number(t.delay_days ?? 0),
            0,
          ) / taskHistory.length
        : 0;

    const workloadScore = Math.min(
      (taskHistory?.length ?? 0) * 10,
      100,
    );

    const performanceScore =
      averageQuality * 0.7 +
      Number(employee.reliability_score ?? 0) * 30;

    const skillVector =
      skills?.map((skill: any) => ({
        skill: skill.skills?.name,
        proficiency: skill.proficiency_level,
      })) ?? [];

    const knowledge = {
      employee_id: employeeId,

      projects_completed: completedProjects,

      average_quality: Number(
        averageQuality.toFixed(2),
      ),

      average_delay: Number(
        averageDelay.toFixed(2),
      ),

      attendance_score: 0,

      workload_score: Number(
        workloadScore.toFixed(2),
      ),

      performance_score: Number(
        performanceScore.toFixed(2),
      ),

      reliability_score: Number(
        employee.reliability_score ?? 0,
      ),

      skill_vector: skillVector,

      feedback_summary: null,

      knowledge_version: 1,
    };

    const { error } = await supabase
      .from('employee_knowledge')
      .upsert(knowledge, {
        onConflict: 'employee_id',
      });

    if (error) {
      throw error;
    }

    return {
      success: true,
      knowledge,
    };
  }

  /**
   * ==========================================================
   * Fetch Employee Knowledge
   * ==========================================================
   */

  async getKnowledge(employeeId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('employee_knowledge')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (error || !data) {
      await this.buildKnowledge(employeeId);

      const { data: rebuilt } = await supabase
        .from('employee_knowledge')
        .select('*')
        .eq('employee_id', employeeId)
        .single();

      return rebuilt;
    }

    return data;
  }

  /**
   * ==========================================================
   * Normalized Knowledge Score
   * ==========================================================
   */

  async getKnowledgeScore(
    employeeId: string,
  ): Promise<number> {
    const knowledge =
      await this.getKnowledge(employeeId);

    const performance =
      Number(knowledge.performance_score ?? 0);

    const quality =
      Number(knowledge.average_quality ?? 0);

    const reliability =
      Number(knowledge.reliability_score ?? 0) * 100;

    const delay =
      100 -
      Math.min(
        Number(knowledge.average_delay ?? 0),
        100,
      );

    const workload =
      Number(knowledge.workload_score ?? 0);

    const score =
      (
        performance +
        quality +
        reliability +
        delay +
        workload
      ) / 500;

    return Math.max(
      0,
      Math.min(1, Number(score.toFixed(4))),
    );
  }
}