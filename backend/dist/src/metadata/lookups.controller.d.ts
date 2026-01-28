import { PrismaService } from '../prisma/prisma.service';
export declare class LookupsController {
    private prisma;
    constructor(prisma: PrismaService);
    listTables(): Promise<string[]>;
    getTableData(name: string): Promise<any>;
    createEntry(name: string, body: any): Promise<any>;
    updateEntry(name: string, id: string, body: any): Promise<any>;
    activateEntry(name: string, id: string): Promise<any>;
    deactivateEntry(name: string, id: string): Promise<any>;
}
