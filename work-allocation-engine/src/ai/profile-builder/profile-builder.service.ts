import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileBuilderService {
  build(
    employeeId: string,
    knowledge: any,
    nlp: any,
    intelligence: {
      strengths: string[];
      weaknesses: string[];
      recommendedRoles: string[];
      trainingRecommendations: string[];
      careerPath: string;
      riskFlags: string[];
    },
  ) {
    return {
      employee_id: employeeId,

      technical_strength: Number(
        knowledge.average_quality ?? 0,
      ),

      leadership_score:
        Number(nlp.profile.leadership ?? 0.5) * 100,

      communication_score:
        Number(nlp.profile.communication ?? 0.5) * 100,

      ownership_score:
        Number(nlp.profile.ownership ?? 0.5) * 100,

      adaptability_score:
        Number(knowledge.performance_score ?? 0),

      learning_speed:
        Number(knowledge.performance_score ?? 0),

      collaboration_score:
        Number(nlp.profile.communication ?? 0.5) * 100,

      documentation_score:
        Number(nlp.profile.documentation ?? 0.5) * 100,

      consistency_score:
        Number(knowledge.performance_score ?? 0),

      reliability_score:
        Number(knowledge.reliability_score ?? 0),

      workload_tolerance:
        Number(knowledge.workload_score ?? 0),

      availability_score:
        Math.max(
          0,
          100 - Number(knowledge.workload_score ?? 0),
        ),

      preferred_domains:
        knowledge.skill_vector?.map(
          (s: any) => s.skill,
        ) ?? [],

      strengths: intelligence.strengths,

      weaknesses: intelligence.weaknesses,

      recommended_roles:
        intelligence.recommendedRoles,

      training_recommendations:
        intelligence.trainingRecommendations,

      career_path:
        intelligence.careerPath,

      risk_flags:
        intelligence.riskFlags,

      profile_summary: nlp.summary,

      generated_by: 'AI Engine',

      llm_version: 'Rule Engine v1',

      profile_version: 1,

      generated_at: new Date(),
    };
  }
}