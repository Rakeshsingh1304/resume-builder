import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GenerateCoverLetterDto {
    @IsString()
    @IsNotEmpty()
    jobTitle: string;

    @IsString()
    @IsNotEmpty()
    companyName: string;

    @IsString()
    @IsOptional()
    resumeId?: string;
}