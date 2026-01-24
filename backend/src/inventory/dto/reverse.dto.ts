import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ReverseDto {
    @IsString()
    @IsNotEmpty()
    reasonCodeId: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
