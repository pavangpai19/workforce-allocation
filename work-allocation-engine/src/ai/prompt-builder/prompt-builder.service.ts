import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptBuilderService {
  build(
    knowledge: any,
    nlp: any,
  ): string {
    return `
You are an enterprise workforce intelligence engine.

Analyze the employee data below and return ONLY valid JSON.

Employee Knowledge:
${JSON.stringify(
  knowledge,
  null,
  2,
)}

NLP Analysis:
${JSON.stringify(
  nlp,
  null,
  2,
)}

Return exactly this JSON schema:

{
  "strengths": [],
  "weaknesses": [],
  "recommendedRoles": [],
  "trainingRecommendations": [],
  "careerPath": "",
  "riskFlags": []
}

Do not include markdown.
Do not include explanations.
Return JSON only.
`;
  }
}