import { PrismaService } from '../prisma/prisma.service';
export declare class LocationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        branchId: string;
        code: string;
        type: string;
        parentLocationId: string | null;
    }[]>;
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        branchId: string;
        code: string;
        type: string;
        parentLocationId: string | null;
    }>;
}
