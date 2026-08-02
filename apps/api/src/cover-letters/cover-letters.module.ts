import { Module } from '@nestjs/common';
import { CoverLettersService } from './cover-letters.service';
import { CoverLettersController } from './cover-letters.controller';
import { GeminiProvider } from '../ai/providers/gemini.provider';

@Module({
  controllers: [CoverLettersController],
  providers: [CoverLettersService, GeminiProvider],
})
export class CoverLettersModule { }