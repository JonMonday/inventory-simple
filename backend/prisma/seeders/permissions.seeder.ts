import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { log, assert } from './seed.helpers';

export async function seedPermissions(prisma: PrismaClient) {
    log('PERMISSIONS', 'Seeding permissions from shared registry...');

    const jsonPath = path.join(__dirname, '../../../shared/permissions.json');
    if (!fs.existsSync(jsonPath)) {
        throw new Error(`Permissions file not found at ${jsonPath}`);
    }

    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const { permissions } = JSON.parse(raw);

    log('PERMISSIONS', `Found ${permissions.length} permissions in registry.`);

    for (const p of permissions) {
        await prisma.permission.upsert({
            where: { key: p.key },
            update: {
                label: p.label,
                group: p.group,
                description: p.description || `Permission for ${p.label}`
            },
            create: {
                key: p.key,
                label: p.label,
                group: p.group,
                description: p.description || `Permission for ${p.label}`
            }
        });
    }

    const dbCount = await prisma.permission.count();
    log('PERMISSIONS', `Database validation: ${dbCount} permissions found.`);

    // Strict sanity check
    assert(dbCount === permissions.length, `FATAL: Permission Drift Detected! Registry has ${permissions.length} but DB has ${dbCount}. Clean DB or check for duplicates.`);
}
