import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
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
    update(id: string, data: {
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
