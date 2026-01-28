import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
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
    }>;
    findAll(): Promise<({
        branch: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
        };
        department: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            branchId: string;
        };
        unit: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            departmentId: string;
        };
        jobRole: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            unitId: string;
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        roles: ({
            role: {
                id: string;
                description: string | null;
                createdAt: Date;
                isActive: boolean;
                name: string;
                code: string;
                isSystemRole: boolean;
            };
        } & {
            roleId: string;
            userId: string;
            assignedAt: Date;
        })[];
        branch: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
        };
        department: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            branchId: string;
        };
        unit: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            departmentId: string;
        };
        jobRole: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            unitId: string;
        };
    } & {
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
    }>;
    update(id: string, data: any): Promise<{
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
    }>;
    getRoles(): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        isSystemRole: boolean;
    }[]>;
    getRole(id: string): Promise<{
        permissions: ({
            permission: {
                key: string;
                label: string;
                group: string;
                id: string;
                description: string | null;
                createdAt: Date;
                isActive: boolean;
            };
        } & {
            roleId: string;
            permissionId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        isSystemRole: boolean;
    }>;
    createRole(data: {
        code: string;
        name: string;
        description?: string;
    }): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        isSystemRole: boolean;
    }>;
    updateRole(id: string, data: {
        name?: string;
        description?: string;
    }): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        isSystemRole: boolean;
    }>;
    getPermissions(): Promise<{
        key: string;
        label: string;
        group: string;
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
    }[]>;
    getUserRoles(userId: string): Promise<({
        role: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            isSystemRole: boolean;
        };
    } & {
        roleId: string;
        userId: string;
        assignedAt: Date;
    })[]>;
    assignUserRole(userId: string, roleId: string): Promise<{
        roleId: string;
        userId: string;
        assignedAt: Date;
    }>;
    removeUserRole(userId: string, roleId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getRolePermissions(roleId: string): Promise<({
        permission: {
            key: string;
            label: string;
            group: string;
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
        };
    } & {
        roleId: string;
        permissionId: string;
    })[]>;
    addRolePermission(roleId: string, permissionId: string): Promise<{
        roleId: string;
        permissionId: string;
    }>;
    removeRolePermission(roleId: string, permissionId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
