import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class ReturnDto {
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @IsString()
    @IsNotEmpty()
    fromLocationId: string;

    @IsString()
    @IsNotEmpty()
    toLocationId: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsString()
    @IsNotEmpty()
    reasonCodeId: string;

    @IsString()
    @IsOptional()
    comments?: string;
}
