import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { AIProvider } from './ai-provider.interface';

@Injectable()
export class GeminiProvider implements AIProvider {
    private ai: GoogleGenAI;

    constructor() {
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    async generateText(prompt: string): Promise<string> {
        const response = await this.ai.models.generateContent({
            model: 'gemini-flash-latest',
            contents: prompt,
        });
        return response.text ?? '';
    }
}