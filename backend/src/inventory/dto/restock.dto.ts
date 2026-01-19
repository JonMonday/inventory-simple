import { IsArray, IsNotEmpty, IsString, IsNumber, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class RestockLineDto {
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    unitCost: number;
}

export class RestockDto {
    @IsString()
    @IsNotEmpty()
    locationId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RestockLineDto)
    lines: RestockLineDto[];

    @IsString()
    @IsOptional()
    referenceNo?: string;

    @IsString()
    @IsOptional()
    comments?: string;
}
