import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        email: string;
        fullName: string;
        locationId?: string;
        departmentId?: string;
        password?: string;
        roleIds?: string[];
    }): Promise<{
        roles: {
            role: {
                name: string;
            };
        }[];
        id: string;
        createdAt: Date;
        email: string;
        fullName: string;
        departmentId: string | null;
        locationId: string | null;
        mustChangePassword: boolean;
        isActive: boolean;
    }>;
    findAll(): Promise<{
        roles: {
            role: {
                id: string;
                name: string;
            };
        }[];
        id: string;
        createdAt: Date;
        email: string;
        fullName: string;
        departmentId: string | null;
        locationId: string | null;
        isActive: boolean;
        location: {
            name: string;
            type: string;
        } | null;
        department: {
            name: string;
            type: string;
        } | null;
    }[]>;
    findOne(id: string): Promise<{
        roles: {
            role: {
                id: string;
                name: string;
            };
        }[];
        id: string;
        createdAt: Date;
        email: string;
        fullName: string;
        departmentId: string | null;
        locationId: string | null;
        isActive: boolean;
        location: {
            id: string;
            name: string;
            type: string;
        } | null;
        department: {
            id: string;
            name: string;
            type: string;
        } | null;
    } | null>;
    update(id: string, data: {
        fullName?: string;
        locationId?: string;
        departmentId?: string;
        isActive?: boolean;
        roleIds?: string[];
    }): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        passwordHash: string;
        fullName: string;
        departmentId: string | null;
        locationId: string | null;
        mustChangePassword: boolean;
        isActive: boolean;
        updatedAt: Date;
        branchId: string | null;
    }>;
    findAllRoles(): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        isSystemRole: boolean;
    }[]>;
    assignRole(userId: string, roleId: string): Promise<{
        roleId: string;
        userId: string;
        assignedAt: Date;
        assignedById: string | null;
    }>;
}
