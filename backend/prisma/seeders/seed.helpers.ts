import { PrismaClient } from '@prisma/client';

export type SeedContext = {
    prisma: PrismaClient;
};

/**
 * Normalizes a string to a stable code (uppercase, snake_case)
 */
export const asCode = (val: string): string =>
    val.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');

/**
 * Helper to upsert a record by its unique 'code' field
 */
export const upsertByCode = async (
    delegate: any,
    code: string,
    data: any
) => {
    return await delegate.upsert({
        where: { code },
        update: data,
        create: { ...data, code },
    });
};

/**
 * Helper to upsert a record by its unique 'email' field
 */
export const upsertByEmail = async (
    delegate: any,
    email: string,
    data: any
) => {
    return await delegate.upsert({
        where: { email },
        update: data,
        create: { ...data, email },
    });
};

/**
 * Custom assertion with clear error reporting
 */
export function assert(condition: any, message: string): asserts condition {
    if (!condition) {
        throw new Error(`[SEED VALIDATION FAILED]: ${message}`);
    }
}

/**
 * Log with section prefix
 */
export const log = (section: string, msg: string) => {
    console.log(`[${section}] ${msg}`);
};

/**
 * Maps resource/action to composite permission key
 */
export const permsMap = (p: string) => {
    const [resource, action] = p.split('.');
    return { resource, action };
};
