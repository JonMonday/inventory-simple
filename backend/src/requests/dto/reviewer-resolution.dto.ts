import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssignmentMode, AssignmentStatus, AssignmentType } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class EligibleReviewerDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    email: string;

    @ApiPropertyOptional()
    departmentName?: string;

    @ApiPropertyOptional()
    unitName?: string;

    @ApiPropertyOptional()
    branchName?: string;

    @ApiProperty({ type: [String] })
    roleCodes: string[];
}

export class ReviewerResolutionResponseDto {
    @ApiProperty()
    stageId: string;

    @ApiProperty({ enum: AssignmentMode })
    assignmentMode: AssignmentMode;

    @ApiProperty()
    roleKey: string;

    @ApiProperty({ type: [EligibleReviewerDto] })
    eligibleUsers: EligibleReviewerDto[];

    @ApiProperty()
    constraints: any;
}

export class CreateAssignmentsDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    stageId: string;

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsUUID(undefined, { each: true })
    userIds: string[];
}

export class RequestAssignmentDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ enum: AssignmentType })
    assignmentType: AssignmentType;

    @ApiProperty({ enum: AssignmentStatus })
    status: AssignmentStatus;

    @ApiPropertyOptional()
    assignedToId?: string;

    @ApiPropertyOptional()
    assignedToName?: string;

    @ApiPropertyOptional()
    assignedRoleKey?: string;

    @ApiProperty()
    assignedAt: Date;

    @ApiPropertyOptional()
    completedAt?: Date;
}
