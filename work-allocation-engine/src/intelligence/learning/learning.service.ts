import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { WeightsService } from '../weights/weights.service';

@Injectable()
export class LearningService {
  private readonly logger = new Logger(LearningService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly weightsService: WeightsService,
  ) {}

  async runLearningCycle() {
    return this.adjustWeightsFromFeedback();
  }

  async adjustWeightsFromFeedback() {
    const supabase = this.supabaseService.getClient();

    const { data: feedbackList } = await supabase
      .from('decision_feedback')
      .select('*');

    if (!feedbackList || !feedbackList.length) {
      return { message: 'No feedback available for learning.' };
    }

    const allocationIds = feedbackList.map((f: any) => f.allocation_id);

    const { data: logs } = await supabase
      .from('decision_logs')
      .select('*')
      .in('allocation_id', allocationIds);

    if (!logs || !logs.length) {
      return { message: 'No matching decision logs found.' };
    }

    const currentWeights = await this.weightsService.getWeights();

    let fairnessDelta = 0;
    let performanceDelta = 0;
    let skillDelta = 0;

    for (const fb of feedbackList) {
      const log = logs.find((l: any) => l.allocation_id === fb.allocation_id);
      if (!log) continue;

      const rating = Number(fb.rating || 3);
      const adjustment = (rating - 3) * 0.02;

      if (log.fairness > 0.7) fairnessDelta += adjustment;
      if (log.performance > 0.7) performanceDelta += adjustment;
      if (log.skill_score > 0.7) skillDelta += adjustment;
    }

    const fairnessRaw = Math.max(0.05, currentWeights.fairness_weight + fairnessDelta);
    const performanceRaw = Math.max(0.05, currentWeights.performance_weight + performanceDelta);
    const skillRaw = Math.max(0.05, currentWeights.skill_weight + skillDelta);
    const knowledgeRaw = Number(currentWeights.knowledge_weight ?? 0.15);
    const riskRaw = Number(currentWeights.risk_weight ?? 0.10);

    // Normalise across ALL five factors to ensure weights sum to 1.0 (H-5)
    const raw: Record<string, number> = {
      fairness_weight: fairnessRaw,
      performance_weight: performanceRaw,
      skill_weight: skillRaw,
      knowledge_weight: knowledgeRaw,
      risk_weight: riskRaw,
    };

    const total = Object.values(raw).reduce((sum, w) => sum + w, 0);
    if (total <= 0) {
      throw new Error('Weight normalisation failed: non-positive total');
    }

    const normalised = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, Number((v / total).toFixed(4))]),
    );

    // Fix rounding discrepancies on the largest weight
    const sumAfterRound = Object.values(normalised).reduce((s, w) => s + w, 0);
    const diff = Number((1.0 - sumAfterRound).toFixed(4));
    if (diff !== 0) {
      normalised.fairness_weight = Number((normalised.fairness_weight + diff).toFixed(4));
    }

    await this.weightsService.updateWeights(normalised);

    return {
      message: 'Decision weights updated successfully from feedback.',
      previous_weights: currentWeights,
      new_weights: normalised,
    };
  }
}
