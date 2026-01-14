import { ImportsService } from './imports.service';
export declare class ImportsController {
    private readonly importsService;
    constructor(importsService: ImportsService);
    importInventory(file: Express.Multer.File, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        filename: string;
        fileHash: string | null;
        status: string;
        errorLog: import("@prisma/client/runtime/library").JsonValue | null;
        rowCount: number;
        processedAt: Date | null;
    }>;
    getStatus(jobId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        filename: string;
        fileHash: string | null;
        status: string;
        errorLog: import("@prisma/client/runtime/library").JsonValue | null;
        rowCount: number;
        processedAt: Date | null;
    } | null>;
}
