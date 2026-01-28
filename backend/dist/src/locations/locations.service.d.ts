import { PrismaService } from '../prisma/prisma.service';
export declare class LocationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    }[]>;
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    }>;
}
