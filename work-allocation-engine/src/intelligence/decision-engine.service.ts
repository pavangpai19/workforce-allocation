import { Injectable } from '@nestjs/common';
import { WeightsService } from './weights/weights.service';

@Injectable()
export class DecisionEngineService {
  constructor(
    private readonly weightsService: WeightsService,
  ) {}

  computeFairness(
    currentWorkload: number,
    maxCapacity: number,
  ): number {
    if (maxCapacity <= 0) return 0;

    const utilization = currentWorkload / maxCapacity;

    return this.normalize(1 - utilization);
  }

  computePerformance(
    predictedPerformance: number,
    confidence: number,
  ): number {
    return this.normalize(
      predictedPerformance * confidence,
    );
  }

  computeSkillMatch(
    matched: number,
    required: number,
  ): number {
    if (required <= 0) return 0;

    return this.normalize(matched / required);
  }

  computeKnowledge(
    knowledgeScore: number,
  ): number {
    return this.normalize(knowledgeScore);
  }

  computeRiskPenalty(
    burnoutProbability: number,
  ): number {
    return this.normalize(burnoutProbability);
  }

  async computeFinalScore(data: {
    fairness: number;
    performance: number;
    skill: number;
    knowledge: number;
    risk: number;
  }): Promise<number> {
    const weights =
      await this.weightsService.getWeights();

    const fairnessWeight =
      weights.fairness_weight ?? 0.25;

    const performanceWeight =
      weights.performance_weight ?? 0.30;

    const skillWeight =
      weights.skill_weight ?? 0.30;

    const knowledgeWeight =
      weights.knowledge_weight ?? 0.15;

    const riskWeight =
      weights.risk_weight ?? 0.10;

    let score = 0;

    score +=
      data.fairness * fairnessWeight;

    score +=
      data.performance *
      performanceWeight;

    score +=
      data.skill * skillWeight;

    score +=
      data.knowledge *
      knowledgeWeight;

    score -=
      data.risk * riskWeight;

    return Number(
      this.normalize(score).toFixed(4),
    );
  }

  private normalize(
    value: number,
  ): number {
    if (value < 0) return 0;

    if (value > 1) return 1;

    return value;
  }
}