import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { AIProvider } from './ai-provider.interface';

const MAX_ATTEMPTS = 20;
const BASE_DELAY_MS = 2000; // 2s, then 4s, then 6s between retries

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class GeminiProvider implements AIProvider {
    private ai: GoogleGenAI;

    constructor() {
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    async generateText(prompt: string): Promise<string> {
        let lastError: any;

        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                const response = await this.ai.models.generateContent({
                    model: 'gemini-flash-latest',
                    contents: prompt,
                });
                return response.text ?? '';
            } catch (err: any) {
                lastError = err;

                // Google's model is temporarily overloaded — this is safe to retry
                const isOverloaded =
                    err?.status === 503 || err?.error?.code === 503 || err?.error?.status === 'UNAVAILABLE';

                const isLastAttempt = attempt === MAX_ATTEMPTS;

                if (isOverloaded && !isLastAttempt) {
                    console.log(
                        `Gemini is busy (attempt ${attempt}/${MAX_ATTEMPTS}). Retrying in ${(BASE_DELAY_MS * attempt) / 1000}s...`,
                    );
                    await sleep(BASE_DELAY_MS * attempt);
                    continue;
                }

                break;
            }
        }

        console.error('Gemini request failed after retries:', lastError);
        throw new ServiceUnavailableException(
            'The AI service is currently busy. Please wait a minute and try again.',
        );
    }
}