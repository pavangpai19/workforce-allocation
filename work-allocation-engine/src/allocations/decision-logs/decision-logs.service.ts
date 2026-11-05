import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class DecisionLogsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async logDecision(data: {
    allocation_id: string; // Join key for the learning loop (H-4)
    employee_id: string;
    project_id: string;

    fairness: number;
    performance: number;
    skillScore: number;
    knowledge: number; // Persisted knowledge score (H-2, H-4)

    risk_score: number;
    confidence: number;
    final_score: number;

    explanation: string;
  }) {
    const supabase = this.supabaseService.getClient();

    const log = {
      employee_id: data.employee_id,
      project_id: data.project_id,

      fairness: Number(data.fairness.toFixed(4)),
      performance: Number(data.performance.toFixed(4)),
      skillscore: Number(data.skillScore.toFixed(4)),
      risk_score: Number(data.risk_score.toFixed(4)),
      confidence: Number(data.confidence.toFixed(4)),
      final_score: Number(data.final_score.toFixed(4)),

      explanation: data.explanation,
    };

    // Primary audit log insert to decision_logs
    const { error } = await supabase.from('decision_logs').insert([log]);
    if (error) {
      throw new Error(`decision_logs insert failed: ${error.message}`);
    }

    // Dual-write to allocation_decisions
    const { error: decisionError } = await supabase
      .from('allocation_decisions')
      .insert([
        {
          employee_id: data.employee_id,
          project_id: data.project_id,
          fairness_score: log.fairness,
          performance_score: log.performance,
          final_score: log.final_score,
        },
      ]);

    if (decisionError) {
      console.warn(`allocation_decisions dual-write warning: ${decisionError.message}`);
    }

    return {
      ...log,
      allocation_id: data.allocation_id,
    };
  }
}
