import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { GeminiProvider } from './providers/gemini.provider';
import { PrismaService } from '../prisma/prisma.service';

const FREE_MONTHLY_LIMIT = 10;

type AiFeature = 'SUMMARY_GEN' | 'EXPERIENCE_GEN' | 'ATS_CHECK' | 'COVER_LETTER_GEN' | 'RESUME_IMPORT';

@Injectable()
export class AiService {
    constructor(
        private geminiProvider: GeminiProvider,
        private prisma: PrismaService,
    ) { }

    // Sirf CHECK karta hai ki user limit se neeche hai ya nahi — koi credit
    // record NAHI karta. Har AI call se PEHLE call karna hai.
    private async checkLimit(clerkId: string) {
        const user = await this.prisma.user.findUnique({ where: { clerkId } });
        if (!user) throw new ForbiddenException('User not found');

        // Pro users ke liye koi limit nahi
        if (user.subscriptionTier === 'PRO') return user;

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const usageCount = await this.prisma.aICreditUsage.count({
            where: {
                userId: user.id,
                createdAt: { gte: startOfMonth },
            },
        });

        if (usageCount >= FREE_MONTHLY_LIMIT) {
            throw new ForbiddenException(
                `You've reached your free plan limit of ${FREE_MONTHLY_LIMIT} AI generations this month. Upgrade to Pro for unlimited access.`,
            );
        }

        return user;
    }

    // Sirf RECORD karta hai ki ek credit use hui — AI call SUCCESSFUL hone ke
    // BAAD hi call karna hai, taaki failed/retried attempts credit na khaayein.
    private async recordUsage(userId: string, feature: AiFeature) {
        await this.prisma.aICreditUsage.create({
            data: { userId, featureUsed: feature },
        });
    }

    async generateSummary(clerkId: string, jobTitle: string, yearsOfExperience: number, keySkills: string[]) {
        const user = await this.checkLimit(clerkId);

        const prompt = `Write a professional 2-3 sentence resume summary for a ${jobTitle} with ${yearsOfExperience} years of experience. Key skills: ${keySkills.join(', ')}. Keep it concise, achievement-oriented, and in third person implied (no "I" statements). Return only the summary text, no extra commentary.`;

        const summary = await this.geminiProvider.generateText(prompt);

        // Yahan tak pahunch gaye matlab call successful thi — ab credit record karo
        await this.recordUsage(user.id, 'SUMMARY_GEN');

        return summary;
    }

    /**
     * Takes raw text extracted from an uploaded resume (PDF/DOCX) and asks
     * Gemini to structure it into the exact JSON shape our Resume.content
     * field expects. Used by the "Upload My Resume" feature.
     */
    async generateResumeFromText(clerkId: string, rawText: string) {
        const user = await this.checkLimit(clerkId);

        const prompt = `You are a resume-parsing assistant. Read the raw resume text below and convert it into a JSON object that STRICTLY follows this exact shape (use empty strings/arrays for anything you cannot find — never invent information that isn't in the text):

{
  "personalInfo": { "fullName": "", "title": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "", "website": "" },
  "summary": "",
  "experience": [ { "company": "", "role": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "currentlyWorking": false, "description": "" } ],
  "education": [ { "institution": "", "degree": "", "fieldOfStudy": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM" } ],
  "projects": [ { "title": "", "techStack": "", "link": "", "description": "" } ],
  "certifications": [ { "name": "", "issuer": "", "date": "YYYY-MM" } ],
  "languages": [ { "name": "", "proficiency": "Conversational" } ],
  "skills": [],
  "achievements": []
}

Rules:
- Return ONLY the raw JSON object. No markdown code fences, no explanation, no extra text before or after.
- Dates should be formatted as "YYYY-MM" where possible; if only a year is available, use "YYYY-01".
- "proficiency" for languages must be one of: Native, Fluent, Conversational, Basic.
- If the resume text is empty or unreadable, return the shape above with all fields left empty.

Resume text:
"""
${rawText.slice(0, 12000)}
"""`;

        const rawResponse = await this.geminiProvider.generateText(prompt);
        const parsed = this.parseJsonResponse(rawResponse);
        const content = this.addEntryIds(parsed);

        // Yahan tak pahunch gaye matlab call successful thi AND JSON valid tha — ab credit record karo
        await this.recordUsage(user.id, 'RESUME_IMPORT');

        return content;
    }

    private parseJsonResponse(rawResponse: string) {
        // Gemini sometimes wraps JSON in ```json ... ``` fences — strip them if present
        const cleaned = rawResponse
            .trim()
            .replace(/^```json/i, '')
            .replace(/^```/, '')
            .replace(/```$/, '')
            .trim();

        try {
            return JSON.parse(cleaned);
        } catch {
            throw new BadRequestException(
                'Could not understand the resume content. Please try a different file or fill the form manually.',
            );
        }
    }

    // Our frontend expects each list entry (experience, education, etc.) to
    // have a unique "id" field — Gemini won't reliably generate these, so we
    // add them ourselves after parsing.
    private addEntryIds(content: any) {
        const withIds = (arr: any[]) =>
            Array.isArray(arr) ? arr.map((item) => ({ id: randomUUID(), ...item })) : [];

        return {
            personalInfo: content.personalInfo || {},
            summary: content.summary || '',
            skills: Array.isArray(content.skills) ? content.skills : [],
            achievements: Array.isArray(content.achievements) ? content.achievements : [],
            experience: withIds(content.experience),
            education: withIds(content.education),
            projects: withIds(content.projects),
            certifications: withIds(content.certifications),
            languages: withIds(content.languages),
        };
    }
}