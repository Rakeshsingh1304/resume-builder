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
        @Body() body: { jobTitle: string; yearsOfExperience: number; keySkills: string[] },
    ) {
        const summary = await this.aiService.generateSummary(
            req.auth.userId,
            body.jobTitle,
            body.yearsOfExperience,
            body.keySkills,
        );
        return { summary };
    }
}