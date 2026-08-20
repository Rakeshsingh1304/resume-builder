import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class UpdateResumeDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    templateId?: string;

    @IsOptional()
    content?: any;

    @IsInt()
    @IsOptional()
    atsScore?: number;

    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;
}