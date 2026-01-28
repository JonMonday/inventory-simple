import { PrismaClient } from '@prisma/client';
export type SeedContext = {
    prisma: PrismaClient;
};
export declare const asCode: (val: string) => string;
export declare const upsertByCode: (delegate: any, code: string, data: any) => Promise<any>;
export declare const upsertByEmail: (delegate: any, email: string, data: any) => Promise<any>;
export declare function assert(condition: any, message: string): asserts condition;
export declare const log: (section: string, msg: string) => void;
export declare const permsMap: (p: string) => {
    resource: string;
    action: string;
};
