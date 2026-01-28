import { PrismaService } from '../prisma/prisma.service';
export declare class TemplatesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        workflowSteps: ({
            stageType: {
                label: string;
                id: string;
                description: string | null;
                code: string;
                sortOrder: number;
            };
        } & {
            id: string;
            branchId: string | null;
            departmentId: string | null;
            unitId: string | null;
            jobRoleId: string | null;
            templateId: string;
            stageTypeId: string;
            stepOrder: number;
            isRequired: boolean;
            assignmentMode: import(".prisma/client").$Enums.AssignmentMode;
            roleKey: string;
            includeRequesterDepartment: boolean;
            minApprovers: number;
            maxApprovers: number;
            requireAll: boolean;
            allowRequesterSelect: boolean;
        })[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        isDefault: boolean;
        createdById: string;
    })[]>;
    findOne(id: string): Promise<{
        workflowSteps: ({
            department: {
                id: string;
                description: string | null;
                createdAt: Date;
                isActive: boolean;
                name: string;
                code: string;
                updatedAt: Date;
                branchId: string;
            } | null;
            unit: {
                id: string;
                description: string | null;
                createdAt: Date;
                isActive: boolean;
                name: string;
                code: string;
                updatedAt: Date;
                departmentId: string;
            } | null;
            jobRole: {
                id: string;
                description: string | null;
                createdAt: Date;
                isActive: boolean;
                name: string;
                code: string;
                updatedAt: Date;
                unitId: string;
            } | null;
            stageType: {
                label: string;
                id: string;
                description: string | null;
                code: string;
                sortOrder: number;
            };
        } & {
            id: string;
            branchId: string | null;
            departmentId: string | null;
            unitId: string | null;
            jobRoleId: string | null;
            templateId: string;
            stageTypeId: string;
            stepOrder: number;
            isRequired: boolean;
            assignmentMode: import(".prisma/client").$Enums.AssignmentMode;
            roleKey: string;
            includeRequesterDepartment: boolean;
            minApprovers: number;
            maxApprovers: number;
            requireAll: boolean;
            allowRequesterSelect: boolean;
        })[];
        templateLines: ({
            item: {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                code: string;
                updatedAt: Date;
                categoryId: string;
                unitOfMeasure: string;
                statusId: string;
                reorderLevel: number | null;
                reorderQuantity: number | null;
            };
        } & {
            id: string;
            templateId: string;
            itemId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        isDefault: boolean;
        createdById: string;
    }>;
}
