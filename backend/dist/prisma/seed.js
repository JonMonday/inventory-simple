"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    const permissions = [
        'items.read', 'items.create', 'items.update', 'items.delete',
        'ledger.read', 'ledger.create',
        'stock.read',
        'imports.read', 'imports.create',
        'forecasting.read',
        'admin.access',
    ];
    const dbPermissions = await Promise.all(permissions.map((p) => prisma.permission.upsert({
        where: { action: p },
        update: {},
        create: { action: p },
    })));
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
//# sourceMappingURL=seed.js.map