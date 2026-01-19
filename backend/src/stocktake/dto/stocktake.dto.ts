import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStocktakeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    locationId: string;
}

export class StocktakeLineDto {
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @IsNumber()
    @IsNotEmpty()
    countedQuantity: number;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class SubmitStocktakeCountDto {
    @ValidateNested({ each: true })
    @Type(() => StocktakeLineDto)
    lines: StocktakeLineDto[];
}
