import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
  }

  async generateEmployeeIntelligence(
    prompt: string,
  ) {
    try {
      const response =
        await this.client.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: prompt,
        });

      const text =
        response.text ?? '{}';

      return JSON.parse(text);
    } catch (error) {
      console.error(
        'Gemini generation failed:',
        error,
      );

      return null;
    }
  }
}