import { Injectable } from '@nestjs/common';
import { GeminiService } from '../../providers/gemini/gemini.service';
import { PromptBuilderService } from '../../prompt-builder/prompt-builder.service';

@Injectable()
export class EmployeeIntelligenceService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly promptBuilderService: PromptBuilderService,
  ) {}

  async analyze(
    knowledge: any,
    nlp: any,
  ) {
    try {
      const prompt =
        this.promptBuilderService.build(
          knowledge,
          nlp,
        );

      const aiResult =
        await this.geminiService.generateEmployeeIntelligence(
          prompt,
        );

      if (
        aiResult &&
        aiResult.strengths &&
        aiResult.weaknesses
      ) {
        return aiResult;
      }
    } catch (error) {
      console.error(
        'Gemini intelligence failed. Falling back to rules.',
      );
    }

    return this.ruleFallback(
      knowledge,
      nlp,
    );
  }

  private ruleFallback(
    knowledge: any,
    nlp: any,
  ) {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendedRoles: string[] = [];
    const trainingRecommendations: string[] = [];
    const riskFlags: string[] = [];

    if (
      (knowledge.average_quality ?? 0) >= 85
    ) {
      strengths.push(
        'High technical expertise',
      );
    } else {
      weaknesses.push(
        'Technical quality needs improvement',
      );

      trainingRecommendations.push(
        'Advanced technical training',
      );
    }

    if (
      (knowledge.reliability_score ?? 0) >=
      0.8
    ) {
      strengths.push(
        'Highly reliable',
      );
    }

    if (
      (nlp.profile.leadership ?? 0) >=
      0.75
    ) {
      strengths.push(
        'Leadership potential',
      );

      recommendedRoles.push(
        'Team Lead',
      );
    }

    if (
      (nlp.profile.communication ?? 0) >=
      0.7
    ) {
      strengths.push(
        'Excellent communication',
      );
    }

    if (
      (knowledge.workload_score ?? 0) >=
      80
    ) {
      riskFlags.push(
        'Possible burnout',
      );
    }

    const domains =
      knowledge.skill_vector?.map(
        (s: any) => s.skill,
      ) ?? [];

    if (
      domains.includes(
        'NestJS',
      )
    ) {
      recommendedRoles.push(
        'Backend Developer',
      );
    }

    if (
      domains.includes(
        'React',
      )
    ) {
      recommendedRoles.push(
        'Frontend Developer',
      );
    }

    if (
      domains.includes(
        'Machine Learning',
      )
    ) {
      recommendedRoles.push(
        'ML Engineer',
      );
    }

    let careerPath =
      'Software Engineer';

    if (
      recommendedRoles.includes(
        'Team Lead',
      )
    ) {
      careerPath =
        'Engineering Manager';
    } else if (
      recommendedRoles.includes(
        'ML Engineer',
      )
    ) {
      careerPath =
        'AI / ML Specialist';
    }

    return {
      strengths,
      weaknesses,
      recommendedRoles,
      trainingRecommendations,
      careerPath,
      riskFlags,
    };
  }
}