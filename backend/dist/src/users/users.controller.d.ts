import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createDto: {
        email: string;
        fullName: string;
        department?: string;
        password?: string;
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
        department: string | null;
        mustChangePassword: boolean;
        isActive: boolean;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        fullName: string;
        department: string | null;
        isActive: boolean;
        createdAt: Date;
        roles: {
            role: {
                name: string;
            };
        }[];
    }[]>;
    update(id: string, updateDto: {
        fullName?: string;
        department?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        fullName: string;
        department: string | null;
        mustChangePassword: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
