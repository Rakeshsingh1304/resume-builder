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
} from '@nestjs/common';
import { CoverLettersService } from './cover-letters.service';
import { GenerateCoverLetterDto } from './dto/generate-cover-letter.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('api/cover-letters')
@UseGuards(ClerkAuthGuard)
export class CoverLettersController {
    constructor(private readonly coverLettersService: CoverLettersService) { }

    @Post('generate')
    generate(@Req() req: any, @Body() dto: GenerateCoverLetterDto) {
        return this.coverLettersService.generate(req.auth.userId, dto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.coverLettersService.findAll(req.auth.userId);
    }

    @Get(':id')
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.coverLettersService.findOne(req.auth.userId, id);
    }

    @Patch(':id')
    update(@Req() req: any, @Param('id') id: string, @Body('content') content: string) {
        return this.coverLettersService.update(req.auth.userId, id, content);
    }

    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.coverLettersService.remove(req.auth.userId, id);
    }
}