import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiProvider } from '../ai/providers/gemini.provider';
import { GenerateCoverLetterDto } from './dto/generate-cover-letter.dto';

@Injectable()
export class CoverLettersService {
    constructor(
        private prisma: PrismaService,
        private geminiProvider: GeminiProvider,
    ) { }

    private async getInternalUser(clerkId: string) {
        const user = await this.prisma.user.findUnique({ where: { clerkId } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async generate(clerkId: string, dto: GenerateCoverLetterDto) {
        const user = await this.getInternalUser(clerkId);

        // Agar resumeId diya hai, uska data context ke liye use karo
        let resumeContext = '';
        if (dto.resumeId) {
            const resume = await this.prisma.resume.findFirst({
                where: { id: dto.resumeId, userId: user.id },
            });
            if (resume) {
                const content: any = resume.content || {};
                resumeContext = `
Candidate Name: ${content.personalInfo?.fullName || ''}
Summary: ${content.summary || ''}
Key Skills: ${(content.skills || []).join(', ')}
Experience: ${(content.experience || []).map((e: any) => `${e.role} at ${e.company}`).join('; ')}
        `.trim();
            }
        }

        const prompt = `Write a professional cover letter for the position of "${dto.jobTitle}" at "${dto.companyName}".
${resumeContext ? `Here is the candidate's background:\n${resumeContext}\n` : ''}
Keep it concise (3-4 paragraphs), professional, and enthusiastic. Do not include placeholder brackets like [Your Name] - use the actual candidate name if provided, otherwise write it generically without brackets. Return only the cover letter text, no extra commentary.`;

        const content = await this.geminiProvider.generateText(prompt);

        return this.prisma.coverLetter.create({
            data: {
                userId: user.id,
                resumeId: dto.resumeId,
                jobTitle: dto.jobTitle,
                companyName: dto.companyName,
                content,
            },
        });
    }

    async findAll(clerkId: string) {
        const user = await this.getInternalUser(clerkId);
        return this.prisma.coverLetter.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(clerkId: string, id: string) {
        const user = await this.getInternalUser(clerkId);
        const letter = await this.prisma.coverLetter.findFirst({
            where: { id, userId: user.id },
        });
        if (!letter) throw new NotFoundException('Cover letter not found');
        return letter;
    }

    async update(clerkId: string, id: string, content: string) {
        await this.findOne(clerkId, id);
        return this.prisma.coverLetter.update({
            where: { id },
            data: { content },
        });
    }

    async remove(clerkId: string, id: string) {
        await this.findOne(clerkId, id);
        return this.prisma.coverLetter.delete({ where: { id } });
    }
}