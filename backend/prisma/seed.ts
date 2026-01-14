import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Create Permissions
    const permissions = [
        'items.read', 'items.create', 'items.update', 'items.delete',
        'ledger.read', 'ledger.create',
        'stock.read',
        'imports.read', 'imports.create',
        'forecasting.read',
        'admin.access',
    ];

    const dbPermissions = await Promise.all(
        permissions.map((p) =>
            prisma.permission.upsert({
                where: { action: p },
                update: {},
                create: { action: p },
            })
        )
    );

    // 2. Create Roles
    const adminRole = await prisma.role.upsert({
        where: { name: 'SuperAdmin' },
        update: {},
        create: {
            name: 'SuperAdmin',
            description: 'Full system access',
        },
    });

    const storekeeperRole = await prisma.role.upsert({
        where: { name: 'Storekeeper' },
        update: {},
        create: {
            name: 'Storekeeper',
            description: 'Basic inventory movements',
        },
    });

    // 3. Assign Permissions to Roles
    for (const perm of dbPermissions) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: adminRole.id,
                    permissionId: perm.id,
                },
            },
            update: {},
            create: {
                roleId: adminRole.id,
                permissionId: perm.id,
            },
        });
    }

    // Selective permissions for Storekeeper
    const storekeeperPermissions = ['items.read', 'ledger.read', 'ledger.create', 'stock.read'];
    for (const p of storekeeperPermissions) {
        const perm = dbPermissions.find(dp => dp.action === p);
        if (perm) {
            await prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: storekeeperRole.id,
                        permissionId: perm.id,
                    },
                },
                update: {},
                create: {
                    roleId: storekeeperRole.id,
                    permissionId: perm.id,
                },
            });
        }
    }

    // 4. Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Global Administrator',
        },
    });

    await prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: adminUser.id,
                roleId: adminRole.id,
            },
        },
        update: {},
        create: {
            userId: adminUser.id,
            roleId: adminRole.id,
        },
    });

    // 5. Create basic reference data
    await prisma.unitOfMeasure.upsert({ where: { name: 'Units' }, update: {}, create: { name: 'Units' } });
    await prisma.unitOfMeasure.upsert({ where: { name: 'Kg' }, update: {}, create: { name: 'Kg' } });
    await prisma.unitOfMeasure.upsert({ where: { name: 'Liters' }, update: {}, create: { name: 'Liters' } });

    await prisma.location.upsert({ where: { name: 'Main Store' }, update: {}, create: { name: 'Main Store', type: 'STORE' } });

    await prisma.reasonCode.upsert({
        where: { code: 'PURCHASE' },
        update: {},
        create: { code: 'PURCHASE', description: 'Goods received from supplier' }
    });
    await prisma.reasonCode.upsert({
        where: { code: 'SALE' },
        update: {},
        create: { code: 'SALE', description: 'Goods issued for sale' }
    });

    console.log('Seeding completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
