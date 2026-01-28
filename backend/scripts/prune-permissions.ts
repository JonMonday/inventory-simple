
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function run() {
    try {
        const jsonPath = path.resolve(__dirname, '../../shared/permissions.json');
        const raw = fs.readFileSync(jsonPath, 'utf8');
        const { permissions } = JSON.parse(raw);
        const registry = permissions.map((x: any) => x.key);

        console.log(`Registry has ${registry.length} permissions.`);

        // Delete associated role-permission links first
        const rpDelete = await prisma.rolePermission.deleteMany({
            where: {
                permission: {
                    key: { notIn: registry }
                }
            }
        });
        console.log(`Deleted ${rpDelete.count} role-permission links.`);

        // Delete the permissions themselves
        const pDelete = await prisma.permission.deleteMany({
            where: {
                key: { notIn: registry }
            }
        });
        console.log(`Pruned ${pDelete.count} permissions from database.`);

    } catch (err) {
        console.error('Error during pruning:', err);
    } finally {
        await prisma.$disconnect();
    }
}

run();
