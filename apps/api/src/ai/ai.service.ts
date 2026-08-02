import { Injectable, ForbiddenException } from '@nestjs/common';
import { GeminiProvider } from './providers/gemini.provider';
import { PrismaService } from '../prisma/prisma.service';

const FREE_MONTHLY_LIMIT = 5;

@Injectable()
export class AiService {
    constructor(
        private geminiProvider: GeminiProvider,
        private prisma: PrismaService,
    ) { }

    private async checkAndRecordCredit(clerkId: string, feature: 'SUMMARY_GEN' | 'EXPERIENCE_GEN' | 'ATS_CHECK' | 'COVER_LETTER_GEN') {
        const user = await this.prisma.user.findUnique({ where: { clerkId } });
        if (!user) throw new ForbiddenException('User not found');

        // Pro users ke liye koi limit nahi
        if (user.subscriptionTier === 'PRO') {
            await this.prisma.aICreditUsage.create({
                data: { userId: user.id, featureUsed: feature },
            });
            return;
        }

        // Free users: is mahine ka usage count karo
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

        await this.prisma.aICreditUsage.create({
            data: { userId: user.id, featureUsed: feature },
        });
    }

    async generateSummary(clerkId: string, jobTitle: string, yearsOfExperience: number, keySkills: string[]) {
        await this.checkAndRecordCredit(clerkId, 'SUMMARY_GEN');

        const prompt = `Write a professional 2-3 sentence resume summary for a ${jobTitle} with ${yearsOfExperience} years of experience. Key skills: ${keySkills.join(', ')}. Keep it concise, achievement-oriented, and in third person implied (no "I" statements). Return only the summary text, no extra commentary.`;

        return this.geminiProvider.generateText(prompt);
    }
}