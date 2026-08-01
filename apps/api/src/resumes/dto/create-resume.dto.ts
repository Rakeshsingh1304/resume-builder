import { IsString, IsNotEmpty } from 'class-validator';

export class CreateResumeDto {
    @IsString()
    @IsNotEmpty()
    title: string;
}