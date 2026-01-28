import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveRequestDto {
    @ApiPropertyOptional({
        example: 'Approved - all items in stock',
        description: 'Optional approval comment',
    })
    @IsString()
    @IsOptional()
    comment?: string;
}

export class RejectRequestDto {
    @ApiProperty({
        example: 'Items not available - rejected',
        description: 'Required rejection reason',
    })
    @IsString()
    @IsNotEmpty()
    comment: string;
}

export class CancelRequestDto {
    @ApiPropertyOptional({
        example: 'No longer needed',
        description: 'Optional cancellation reason',
    })
    @IsString()
    @IsOptional()
    comment?: string;
}

export class ReassignRequestDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'User ID to reassign to',
    })
    @IsString()
    @IsNotEmpty()
    targetUserId: string;
}

export class ConfirmRequestDto {
    @ApiPropertyOptional({
        example: 'Items received in good condition',
        description: 'Optional confirmation comment',
    })
    @IsString()
    @IsOptional()
    comment?: string;
}
