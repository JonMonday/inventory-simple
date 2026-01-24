import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createDto: {
        email: string;
        fullName: string;
        departmentId?: string;
        locationId?: string;
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
    findAllRoles(): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        isSystemRole: boolean;
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
    update(id: string, updateDto: {
        fullName?: string;
        departmentId?: string;
        locationId?: string;
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
}
