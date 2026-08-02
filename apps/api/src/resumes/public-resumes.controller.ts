import { Controller, Get, Param } from '@nestjs/common';
import { ResumesService } from './resumes.service';

@Controller('api/public/resumes')
export class PublicResumesController {
    constructor(private readonly resumesService: ResumesService) { }

    @Get(':slug')
    findByPublicSlug(@Param('slug') slug: string) {
        return this.resumesService.findByPublicSlug(slug);
    }
}