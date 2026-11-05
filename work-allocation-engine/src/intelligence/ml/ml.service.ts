import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../../supabase/supabase.service';
import { ProfilingService } from '../profiling/profiling.service';
import axios from 'axios';

export interface AllocationContext {
  skill_match_score: number;
  workload_ratio: number;
  task_complexity: number;
  estimated_hours: number;
  project_priority: number;
}

@Injectable()
export class MlService {
  private readonly logger = new Logger(MlService.name);
  private readonly mlUrl: string;
  private readonly timeoutMs: number;

  constructor(
    private readonly profilingService: ProfilingService,
    private readonly supabaseService: SupabaseService,
    private readonly config: ConfigService,
  ) {
    this.mlUrl = this.config.get<string>('ML_SERVICE_URL', 'http://localhost:8000');
    this.timeoutMs = Number(this.config.get<string>('ML_TIMEOUT_MS', '5000'));
  }

  async predict(employeeId: string, context: AllocationContext) {
    const supabase = this.supabaseService.getClient();

    try {
      // Inside the try: a missing employee_profiles row degrades this one candidate,
      // without crashing the entire allocation request.
      const profile = await this.profilingService.generateProfile(employeeId);

      const response = await axios.post(
        `${this.mlUrl}/predict`,
        {
          // Full 9-feature contract - matches train.py feature schema
          skill_match_score: context.skill_match_score,
          workload_ratio: context.workload_ratio,
          task_complexity: context.task_complexity,
          estimated_hours: context.estimated_hours,
          efficiency_score: profile.efficiency_score,
          consistency_score: profile.consistency_score,
          reliability_score: profile.reliability_score,
          availability_score: profile.availability_score,
          project_priority: context.project_priority,
        },
        { timeout: this.timeoutMs },
      );

      const prediction = {
        employee_id: employeeId,
        predicted_performance: response.data.predicted_performance,
        predicted_completion_rate: response.data.completion_probability,
        burnout_probability: response.data.risk_score,
        delivery_confidence: response.data.confidence,
        model_version: response.data.model_version,
        recommendation_score:
          response.data.predicted_performance * response.data.confidence,
      };

      const { error } = await supabase
        .from('ml_predictions')
        .upsert(prediction, { onConflict: 'employee_id' });

      if (error) {
        this.logger.warn(`ml_predictions upsert failed for ${employeeId}: ${error.message}`);
      }

      return {
        ...prediction,
        risk_score: prediction.burnout_probability,
        confidence: prediction.delivery_confidence,
        is_fallback: false as const,
      };
    } catch (err: any) {
      this.logger.error(
        `ML prediction failed for employee ${employeeId}: ${err.message}`,
        err.stack,
      );

      // Flagged fallback: callers must inspect is_fallback before decision ranking
      return {
        employee_id: employeeId,
        predicted_performance: 0.6,
        predicted_completion_rate: 0.6,
        delivery_confidence: 0.6,
        recommendation_score: 0.36,
        burnout_probability: 0.5,
        risk_score: 0.5,
        confidence: 0.5,
        model_version: 'fallback',
        is_fallback: true as const,
      };
    }
  }
}
