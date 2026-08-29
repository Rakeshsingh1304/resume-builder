import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { AiModule } from '../ai/ai.module';
import { ResumesModule } from '../resumes/resumes.module';

@Module({
    imports: [AiModule, ResumesModule],
    controllers: [InterviewController],
    providers: [InterviewService],
})
export class InterviewModule { }