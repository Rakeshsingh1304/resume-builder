import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class UpdateResumeDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsOptional()
    content?: any;

    @IsInt()
    @IsOptional()
    atsScore?: number;

    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;
}