import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('api/ai')
@UseGuards(ClerkAuthGuard)
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('generate-summary')
    async generateSummary(
        @Req() req: any,
        @Body()
        body: {
            personalInfo?: any;
            experience?: any[];
            education?: any[];
            skills?: string[];
            projects?: any[];
            achievements?: string[];
        },
    ) {
        const summary = await this.aiService.generateSummary(req.auth.userId, body);
        return { summary };
    }

    @Post('generate-experience-description')
    async generateExperienceDescription(
        @Req() req: any,
        @Body()
        body: {
            company: string;
            role: string;
            startDate?: string;
            endDate?: string;
            currentlyWorking?: boolean;
        },
    ) {
        const description = await this.aiService.generateExperienceDescription(
            req.auth.userId,
            body.company,
            body.role,
            body.startDate,
            body.endDate,
            body.currentlyWorking,
        );
        return { description };
    }

    @Post('generate-project-description')
    async generateProjectDescription(
        @Req() req: any,
        @Body() body: { title: string; techStack?: string },
    ) {
        const description = await this.aiService.generateProjectDescription(
            req.auth.userId,
            body.title,
            body.techStack,
        );
        return { description };
    }
}