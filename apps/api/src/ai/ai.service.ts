import { Injectable } from '@nestjs/common';
import { GeminiProvider } from './providers/gemini.provider';

@Injectable()
export class AiService {
    constructor(private geminiProvider: GeminiProvider) { }

    async generateSummary(jobTitle: string, yearsOfExperience: number, keySkills: string[]) {
        const prompt = `Write a professional 2-3 sentence resume summary for a ${jobTitle} with ${yearsOfExperience} years of experience. Key skills: ${keySkills.join(', ')}. Keep it concise, achievement-oriented, and in third person implied (no "I" statements). Return only the summary text, no extra commentary.`;

        return this.geminiProvider.generateText(prompt);
    }
}