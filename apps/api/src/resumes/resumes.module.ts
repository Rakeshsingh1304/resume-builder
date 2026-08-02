import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { PublicResumesController } from './public-resumes.controller';

@Module({
  controllers: [ResumesController, PublicResumesController],
  providers: [ResumesService],
})
export class ResumesModule { }