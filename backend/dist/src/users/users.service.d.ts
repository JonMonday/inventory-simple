import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<({
        roles: ({
            role: {
                permissions: ({
                    permission: {
                        id: string;
                        action: string;
                        description: string | null;
                    };
                } & {
                    roleId: string;
                    permissionId: string;
                })[];
            } & {
                id: string;
                description: string | null;
                name: string;
            };
        } & {
            roleId: string;
            userId: string;
        })[];
    } & {
        id: string;
        name: string | null;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findPermissions(userId: string): Promise<string[]>;
    create(data: any): Promise<{
        id: string;
        name: string | null;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
