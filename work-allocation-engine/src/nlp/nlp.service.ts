import { Injectable } from '@nestjs/common';

@Injectable()
export class NlpService {
  analyzeFeedback(feedback: {
    strengths?: string;
    weaknesses?: string;
    comments?: string;
  }) {
    const strengths = (feedback.strengths ?? '').toLowerCase();
    const weaknesses = (feedback.weaknesses ?? '').toLowerCase();
    const comments = (feedback.comments ?? '').toLowerCase();

    const keywords = [
      ...strengths.split(','),
      ...weaknesses.split(','),
    ]
      .map((k) => k.trim())
      .filter(Boolean);

    const profile = {
      communication: comments.includes('communication') ? 0.9 : 0.5,
      leadership: strengths.includes('leadership') ? 0.9 : 0.5,
      ownership: comments.includes('ownership') ? 0.95 : 0.5,
      documentation: weaknesses.includes('documentation')
        ? 0.3
        : 0.8,
    };

    return {
      profile,
      keywords,
      summary: comments,
    };
  }
}