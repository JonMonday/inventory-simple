import { PrismaClient } from '@prisma/client';
export declare class SeedAdapter {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    getRoleByCode(code: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        isSystemRole: boolean;
    } | null>;
    getStatusByCode(code: string): Promise<{
        label: string;
        id: string;
        description: string | null;
        code: string;
        sortOrder: number;
        isEditable: boolean;
        isTerminal: boolean;
    } | null>;
    getStageByCode(code: string): Promise<{
        label: string;
        id: string;
        description: string | null;
        code: string;
        sortOrder: number;
    } | null>;
    getEventByCode(code: string): Promise<{
        label: string;
        id: string;
        description: string | null;
        code: string;
    } | null>;
    getMoveTypeByCode(code: string): Promise<{
        label: string;
        id: string;
        description: string | null;
        code: string;
    } | null>;
    getItemByCode(code: string): Promise<{
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
    } | null>;
    getStoreByCode(code: string): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    } | null>;
    getUnitByCode(code: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        departmentId: string;
    } | null>;
    getDepartmentByCode(code: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    } | null>;
    getUserByEmail(email: string): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        branchId: string;
        departmentId: string;
        unitId: string;
        email: string;
        passwordHash: string;
        fullName: string;
        jobRoleId: string;
        primaryStoreLocationId: string | null;
        mustChangePassword: boolean;
    } | null>;
    getAdminUser(): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        branchId: string;
        departmentId: string;
        unitId: string;
        email: string;
        passwordHash: string;
        fullName: string;
        jobRoleId: string;
        primaryStoreLocationId: string | null;
        mustChangePassword: boolean;
    } | null>;
}
