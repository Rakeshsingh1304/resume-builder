import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

@Injectable()
export class ResumesService {
    constructor(private prisma: PrismaService) { }

    // Helper: Clerk ID se humara internal User record dhundo
    private async getInternalUser(clerkId: string) {
        const user = await this.prisma.user.findUnique({ where: { clerkId } });
        if (!user) throw new NotFoundException('User not found in database');
        return user;
    }

    async create(clerkId: string, dto: CreateResumeDto) {
        const user = await this.getInternalUser(clerkId);
        return this.prisma.resume.create({
            data: {
                userId: user.id,
                title: dto.title,
                content: {},
            },
        });
    }

    // Used by the "Upload My Resume" (AI import) flow — same as create(),
    // but takes the already-parsed content instead of starting empty.
    async createFromImport(clerkId: string, title: string, content: any) {
        const user = await this.getInternalUser(clerkId);
        return this.prisma.resume.create({
            data: {
                userId: user.id,
                title,
                content,
            },
        });
    }

    async findAll(clerkId: string) {
        const user = await this.getInternalUser(clerkId);
        return this.prisma.resume.findMany({
            where: { userId: user.id, deletedAt: null },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async findOne(clerkId: string, id: string) {
        const user = await this.getInternalUser(clerkId);
        const resume = await this.prisma.resume.findFirst({
            where: { id, userId: user.id, deletedAt: null },
        });
        if (!resume) throw new NotFoundException('Resume not found');
        return resume;
    }

    async update(clerkId: string, id: string, dto: UpdateResumeDto) {
        await this.findOne(clerkId, id); // ownership check bhi ho jaata hai isse
        return this.prisma.resume.update({
            where: { id },
            data: dto,
        });
    }

    async remove(clerkId: string, id: string) {
        await this.findOne(clerkId, id);
        return this.prisma.resume.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async calculateAtsScore(clerkId: string, id: string) {
        const resume = await this.findOne(clerkId, id);
        const content: any = resume.content || {};

        const breakdown: { category: string; score: number; maxScore: number; feedback: string }[] = [];

        // 1. Contact Info (20 points)
        const personalInfo = content.personalInfo || {};
        let contactScore = 0;
        const contactFeedback: string[] = [];
        if (personalInfo.email) contactScore += 7;
        else contactFeedback.push('Add your email address');
        if (personalInfo.phone) contactScore += 7;
        else contactFeedback.push('Add your phone number');
        if (personalInfo.location) contactScore += 6;
        else contactFeedback.push('Add your location');
        breakdown.push({
            category: 'Contact Information',
            score: contactScore,
            maxScore: 20,
            feedback: contactFeedback.length > 0 ? contactFeedback.join('. ') : 'Complete',
        });

        // 2. Summary (15 points)
        const summary = content.summary || '';
        let summaryScore = 0;
        let summaryFeedback = 'Complete';
        if (summary.length === 0) {
            summaryFeedback = 'Add a professional summary to introduce yourself';
        } else if (summary.length < 50) {
            summaryScore = 7;
            summaryFeedback = 'Your summary is too short. Aim for 2-3 sentences';
        } else {
            summaryScore = 15;
        }
        breakdown.push({ category: 'Professional Summary', score: summaryScore, maxScore: 15, feedback: summaryFeedback });

        // 3. Experience (25 points)
        const experience = content.experience || [];
        let expScore = 0;
        let expFeedback = 'Complete';
        if (experience.length === 0) {
            expFeedback = 'Add at least one work experience entry';
        } else {
            expScore += 10;
            const hasGoodDescriptions = experience.every((e: any) => (e.description || '').length > 30);
            if (hasGoodDescriptions) {
                expScore += 15;
            } else {
                expScore += 5;
                expFeedback = 'Add more detailed descriptions (30+ characters) for each role';
            }
        }
        breakdown.push({ category: 'Work Experience', score: expScore, maxScore: 25, feedback: expFeedback });

        // 4. Education (15 points)
        const education = content.education || [];
        const eduScore = education.length > 0 ? 15 : 0;
        breakdown.push({
            category: 'Education',
            score: eduScore,
            maxScore: 15,
            feedback: education.length > 0 ? 'Complete' : 'Add your education details',
        });

        // 5. Skills (15 points)
        const skills = content.skills || [];
        let skillsScore = 0;
        let skillsFeedback = 'Complete';
        if (skills.length === 0) {
            skillsFeedback = 'Add relevant skills to help you pass keyword matching';
        } else if (skills.length < 5) {
            skillsScore = 8;
            skillsFeedback = `Add more skills. You have ${skills.length}, aim for at least 5-10`;
        } else {
            skillsScore = 15;
        }
        breakdown.push({ category: 'Skills', score: skillsScore, maxScore: 15, feedback: skillsFeedback });

        // 6. Formatting/Length check (10 points) - simple check kyunki humara template already ATS-friendly hai
        const formattingScore = 10;
        breakdown.push({
            category: 'Formatting',
            score: formattingScore,
            maxScore: 10,
            feedback: 'Your resume uses a clean, ATS-friendly single-column format',
        });

        const totalScore = breakdown.reduce((sum, item) => sum + item.score, 0);

        // Score ko database me save karo
        await this.prisma.resume.update({
            where: { id },
            data: { atsScore: totalScore },
        });

        return { score: totalScore, breakdown };
    }

    async togglePublic(clerkId: string, id: string) {
        const resume = await this.findOne(clerkId, id);

        if (resume.isPublic) {
            // Public se private karna — slug hata dete hain
            return this.prisma.resume.update({
                where: { id },
                data: { isPublic: false },
            });
        } else {
            // Private se public karna — ek unique slug generate karo (agar already nahi hai)
            const slug = resume.publicSlug || `${this.slugify(resume.title)}-${Math.random().toString(36).substring(2, 8)}`;
            return this.prisma.resume.update({
                where: { id },
                data: { isPublic: true, publicSlug: slug },
            });
        }
    }

    private slugify(text: string): string {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'resume';
    }

    async findByPublicSlug(slug: string) {
        const resume = await this.prisma.resume.findFirst({
            where: { publicSlug: slug, isPublic: true, deletedAt: null },
        });
        if (!resume) throw new NotFoundException('Resume not found or is not public');

        // Analytics ke liye view count badhao (Step 4 me plan kiya tha)
        await this.prisma.resume.update({
            where: { id: resume.id },
            data: {}, // Abhi ke liye simple rakhte hain, analytics table baad me
        });

        return resume;
    }
}