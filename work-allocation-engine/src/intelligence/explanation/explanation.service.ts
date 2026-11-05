import { Injectable } from '@nestjs/common';

@Injectable()
export class ExplanationService {
  generateExplanation(data: {
    employee_name: string;
    fairness: number;
    performance: number;
    skillScore: number;
    risk_score: number;
    confidence: number;
  }): string {
    const {
      employee_name,
      fairness,
      performance,
      skillScore,
      risk_score,
      confidence,
    } = data;

    const strengths: string[] = [];
    const concerns: string[] = [];

    if (skillScore >= 0.8)
      strengths.push('Excellent skill match');

    else if (skillScore >= 0.6)
      strengths.push('Good skill match');
    else concerns.push('Limited skill match');

    if (performance >= 0.8)
      strengths.push('Excellent historical performance');

    else if (performance >= 0.6)
      strengths.push('Consistent historical performance');
    else concerns.push('Performance can be improved');

    if (fairness >= 0.8)
      strengths.push('Currently has sufficient capacity');

    else if (fairness >= 0.5)
      strengths.push('Balanced workload');
    else concerns.push('Currently carrying higher workload');

    if (risk_score <= 0.3)
      strengths.push('Low burnout risk');

    else if (risk_score <= 0.6)
      strengths.push('Moderate burnout risk');
    else concerns.push('High burnout risk');

    if (confidence >= 0.8)
      strengths.push('High ML prediction confidence');

    else if (confidence >= 0.6)
      strengths.push('Reliable ML prediction');
    else concerns.push('Prediction confidence is low');

    let recommendation = '';

    if (risk_score > 0.7) {
      recommendation =
        'Recommendation: Monitor workload after allocation.';
    } else if (fairness < 0.4) {
      recommendation =
        'Recommendation: Rebalance workload during project execution.';
    } else {
      recommendation =
        'Recommendation: Suitable candidate for immediate allocation.';
    }

    return `
==================================================

AUTO ALLOCATION DECISION REPORT

==================================================

Selected Employee:
${employee_name}

----------------------------------------------

Score Breakdown

----------------------------------------------

Fairness Score       : ${(fairness * 100).toFixed(1)}%
Performance Score    : ${(performance * 100).toFixed(1)}%
Skill Match Score    : ${(skillScore * 100).toFixed(1)}%
Burnout Risk         : ${(risk_score * 100).toFixed(1)}%
ML Confidence        : ${(confidence * 100).toFixed(1)}%

----------------------------------------------

Strengths

----------------------------------------------

${strengths.map(s => `• ${s}`).join('\n')}

----------------------------------------------

Concerns

----------------------------------------------

${
  concerns.length
    ? concerns.map(c => `• ${c}`).join('\n')
    : '• No significant concerns detected.'
}

----------------------------------------------

${recommendation}

==================================================
`;
  }
}