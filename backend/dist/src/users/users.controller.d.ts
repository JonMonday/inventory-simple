import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createDto: any): Promise<{
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
    update(id: string, updateDto: any): Promise<{
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
    getUserRoles(id: string): Promise<({
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
    assignRole(id: string, body: {
        roleId: string;
    }): Promise<{
        roleId: string;
        userId: string;
        assignedAt: Date;
    }>;
    removeRole(id: string, rid: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
export declare class RolesController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        isSystemRole: boolean;
    }[]>;
    findOne(id: string): Promise<{
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
    create(dto: {
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
    update(id: string, dto: {
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
    getRolePermissions(id: string): Promise<({
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
    addPermission(id: string, body: {
        permissionId: string;
    }): Promise<{
        roleId: string;
        permissionId: string;
    }>;
    removePermission(id: string, pid: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
export declare class PermissionsController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        key: string;
        label: string;
        group: string;
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
    }[]>;
}
