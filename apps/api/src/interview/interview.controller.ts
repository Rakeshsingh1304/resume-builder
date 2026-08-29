import { Controller, Post, Body, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { InterviewService, ChatTurn } from './interview.service';
import { ResumesService } from '../resumes/resumes.service';
import { PrismaService } from '../prisma/prisma.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('api/interview')
@UseGuards(ClerkAuthGuard)
export class InterviewController {
    constructor(
        private readonly interviewService: InterviewService,
        private readonly resumesService: ResumesService,
        private readonly prisma: PrismaService,
    ) { }

    // Interview Practice is a PRO-only feature. Checked fresh on every call
    // (not cached) so a downgrade mid-session can't be exploited.
    private async requirePro(clerkId: string) {
        const user = await this.prisma.user.findUnique({ where: { clerkId } });
        if (!user || user.subscriptionTier !== 'PRO') {
            throw new ForbiddenException(
                'Interview Practice is a Pro feature. Please upgrade to access it.',
            );
        }
    }

    // Called once to start (history: []), and again after every candidate
    // answer (history includes the full conversation so far). The frontend
    // is stateless — it always sends the whole transcript, like a normal
    // chat API.
    @Post('message')
    async sendMessage(
        @Req() req: any,
        @Body()
        body: {
            resumeId: string;
            jobDescription?: string;
            interviewType: 'technical' | 'behavioral' | 'mixed';
            history: ChatTurn[];
        },
    ) {
        await this.requirePro(req.auth.userId);
        const resume = await this.resumesService.findOne(req.auth.userId, body.resumeId);
        return this.interviewService.continueConversation(
            resume.content,
            body.jobDescription,
            body.interviewType,
            body.history || [],
        );
    }

    @Post('final-report')
    async finalReport(@Req() req: any, @Body() body: { history: ChatTurn[] }) {
        await this.requirePro(req.auth.userId);
        return this.interviewService.generateFinalReport(body.history || []);
    }
}