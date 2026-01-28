import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkflowStageDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Stage type ID',
    })
    @IsString()
    @IsNotEmpty()
    stageTypeId: string;

    @ApiProperty({
        example: 1,
        description: 'Display order of this stage',
    })
    @IsNotEmpty()
    order: number;

    @ApiPropertyOptional({
        example: true,
        description: 'Whether this stage is enabled',
    })
    @IsBoolean()
    @IsOptional()
    enabled?: boolean;
}

export class CreateTemplateDto {
    @ApiProperty({
        example: 'Standard Office Supplies Request',
        description: 'Template name',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        example: 'Default template for office supply requests',
        description: 'Template description',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        type: () => WorkflowStageDto,
        isArray: true,
        description: 'Workflow stages for this template',
        example: [
            { stageTypeId: '123e4567-e89b-12d3-a456-426614174001', order: 1, enabled: true },
            { stageTypeId: '123e4567-e89b-12d3-a456-426614174002', order: 2, enabled: true },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkflowStageDto)
    stages: WorkflowStageDto[];
}

export class UpdateTemplateDto {
    @ApiPropertyOptional({
        example: 'Updated Office Supplies Request Template',
        description: 'Updated template name',
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        example: 'Updated description',
        description: 'Updated template description',
    })
    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateWorkflowStagesDto {
    @ApiProperty({
        type: () => WorkflowStageDto,
        isArray: true,
        description: 'Updated workflow stages',
        example: [
            { stageTypeId: '123e4567-e89b-12d3-a456-426614174001', order: 1, enabled: true },
            { stageTypeId: '123e4567-e89b-12d3-a456-426614174002', order: 2, enabled: false },
            { stageTypeId: '123e4567-e89b-12d3-a456-426614174003', order: 3, enabled: true },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkflowStageDto)
    stages: WorkflowStageDto[];
}
