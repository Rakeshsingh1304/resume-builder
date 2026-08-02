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
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('api/resumes')
@UseGuards(ClerkAuthGuard)
export class ResumesController {
    constructor(private readonly resumesService: ResumesService) { }

    @Post()
    create(@Req() req: any, @Body() dto: CreateResumeDto) {
        return this.resumesService.create(req.auth.userId, dto);
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

    @Post(':id/ats-score')
    calculateAtsScore(@Req() req: any, @Param('id') id: string) {
        return this.resumesService.calculateAtsScore(req.auth.userId, id);
    }
}