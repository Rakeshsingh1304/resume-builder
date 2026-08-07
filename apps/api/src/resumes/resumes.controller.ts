import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumesService } from './resumes.service';
import { AiService } from '../ai/ai.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { extractTextFromFile } from './resume-parser.util';

@Controller('api/resumes')
@UseGuards(ClerkAuthGuard)
export class ResumesController {
    constructor(
        private readonly resumesService: ResumesService,
        private readonly aiService: AiService,
    ) { }

    @Post()
    create(@Req() req: any, @Body() dto: CreateResumeDto) {
        return this.resumesService.create(req.auth.userId, dto);
    }

    // "Upload My Resume" — user ek PDF/DOCX bhejta hai, hum usse text nikaal
    // ke Gemini se structure karwa ke naya resume bana dete hain.
    @Post('import')
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
    async importResume(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file was uploaded.');
        }

        const rawText = await extractTextFromFile(file);

        if (!rawText || rawText.trim().length < 50) {
            throw new BadRequestException(
                'Could not read enough text from this file. Please try a different file or fill the form manually.',
            );
        }

        const content = await this.aiService.generateResumeFromText(req.auth.userId, rawText);
        const title = content?.personalInfo?.fullName
            ? `${content.personalInfo.fullName}'s Resume`
            : 'Untitled Resume';

        return this.resumesService.createFromImport(req.auth.userId, title, content);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.resumesService.findAll(req.auth.userId);
    }

    @Get(':id')
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.resumesService.findOne(req.auth.userId, id);
    }

    @Patch(':id')
    update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateResumeDto) {
        return this.resumesService.update(req.auth.userId, id, dto);
    }

    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.resumesService.remove(req.auth.userId, id);
    }

    @Post(':id/toggle-public')
    togglePublic(@Req() req: any, @Param('id') id: string) {
        return this.resumesService.togglePublic(req.auth.userId, id);
    }

    @Post(':id/ats-score')
    calculateAtsScore(@Req() req: any, @Param('id') id: string) {
        return this.resumesService.calculateAtsScore(req.auth.userId, id);
    }
}