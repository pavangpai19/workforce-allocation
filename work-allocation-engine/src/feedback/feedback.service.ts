import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async recordFeedback(data: {
    employee_id: string;
    project_id: string;
    allocation_id: string;
    actual_performance: number;
    expected_performance: number;
  }) {
    const supabase = this.supabaseService.getClient();

    const deviation =
      data.actual_performance - data.expected_performance;

    const outcome_score = this.normalizeOutcome(deviation);

    const success = outcome_score >= 0.6;

    const { error } = await supabase
      .from('decision_feedback')
      .insert([
        {
          employee_id: data.employee_id,
          project_id: data.project_id,
          allocation_id: data.allocation_id,
          actual_performance: data.actual_performance,
          expected_performance: data.expected_performance,
          deviation,
          outcome_score,
          success,
        },
      ]);

    if (error) throw new Error(error.message);

    return {
      outcome_score,
      success,
      deviation,
    };
  }

  /**
   * NEW
   */

  async recordManagerFeedback(body: any) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('manager_feedback')
      .insert([
        {
          employee_id: body.employee_id,
          project_id: body.project_id,
          manager_name: body.manager_name,
          rating: body.rating,
          strengths: body.strengths,
          weaknesses: body.weaknesses,
          comments: body.comments,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async getManagerFeedback(employeeId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('manager_feedback')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data;
  }

  private normalizeOutcome(deviation: number): number {
    const normalized = (deviation + 1) / 2;

    if (normalized < 0) return 0;
    if (normalized > 1) return 1;

    return normalized;
  }
}