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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const API_URL = 'http://localhost:3001';
async function main() {
    console.log('🚀 Starting Verification Script...');
    const adminEmail = `admin-${Date.now()}@test.com`;
    const adminPassword = 'AdminPassword123!';
    console.log(`Creating Admin: ${adminEmail}`);
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const branch = await prisma.branch.upsert({ where: { code: 'MAIN' }, update: {}, create: { code: 'MAIN', name: 'Main Branch' } });
    const dept = await prisma.department.upsert({ where: { code: 'IT' }, update: {}, create: { code: 'IT', name: 'IT', branchId: branch.id } });
    const unit = await prisma.unit.upsert({ where: { code: 'IT_UNIT' }, update: {}, create: { code: 'IT_UNIT', name: 'IT Unit', departmentId: dept.id } });
    const jobRole = await prisma.jobRole.upsert({ where: { code: 'IT_ADMIN' }, update: {}, create: { code: 'IT_ADMIN', name: 'IT Admin', unitId: unit.id } });
    await prisma.user.create({
        data: {
            email: adminEmail,
            passwordHash,
            fullName: 'Super Admin',
            isActive: true,
            branchId: branch.id,
            departmentId: dept.id,
            unitId: unit.id,
            jobRoleId: jobRole.id,
            roles: {
                create: {
                    role: {
                        connectOrCreate: {
                            where: { name: 'SUPER_ADMIN' },
                            create: {
                                code: 'SUPER_ADMIN',
                                name: 'SUPER_ADMIN',
                                isSystemRole: true,
                                permissions: {
                                    create: [
                                        { permission: { connectOrCreate: { where: { key: 'users.create' }, create: { key: 'users.create', label: 'Create Users', group: 'RBAC' } } } },
                                        { permission: { connectOrCreate: { where: { key: 'users.read' }, create: { key: 'users.read', label: 'Read Users', group: 'RBAC' } } } },
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    console.log('Logging in as Admin...');
    const loginRes = await axios_1.default.post(`${API_URL}/auth/login`, {
        email: adminEmail,
        password: adminPassword,
    });
    const adminToken = loginRes.data.access_token;
    console.log('✅ Admin Logged In');
    const newUserEmail = `newuser-${Date.now()}@test.com`;
    console.log(`Creating New User (via Admin API): ${newUserEmail}`);
    try {
        await axios_1.default.post(`${API_URL}/users`, {
            email: newUserEmail,
            fullName: 'Test Employee',
            branchId: branch.id,
            departmentId: dept.id,
            unitId: unit.id,
            jobRoleId: jobRole.id
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ User Created');
    }
    catch (e) {
        console.error('❌ User Creation Failed:', e.response?.data || e.message);
        process.exit(1);
    }
    const newUser = await prisma.user.findUnique({ where: { email: newUserEmail } });
    if (!newUser?.mustChangePassword) {
        console.error('❌ DB Verification Failed: mustChangePassword should be true');
        process.exit(1);
    }
    console.log('✅ DB Verification Passed: mustChangePassword is true');
    console.log('Logging in as New User...');
    const userLoginRes = await axios_1.default.post(`${API_URL}/auth/login`, {
        email: newUserEmail,
        password: 'ChangeMe!123',
    });
    if (userLoginRes.data.user.mustChangePassword !== true) {
        console.error('❌ Login Response Failed: mustChangePassword should be true');
        process.exit(1);
    }
    console.log('✅ Login Verification Passed: Response indicates mustChangePassword');
    const userToken = userLoginRes.data.access_token;
    console.log('Changing Password...');
    const newPassword = 'NewSecurePassword123!';
    await axios_1.default.post(`${API_URL}/auth/change-password`, {
        password: newPassword
    }, {
        headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Password Changed');
    const updatedUser = await prisma.user.findUnique({ where: { email: newUserEmail } });
    if (updatedUser?.mustChangePassword) {
        console.error('❌ DB Verification Failed: mustChangePassword should be false after change');
        process.exit(1);
    }
    console.log('✅ DB Verification Passed: mustChangePassword is false');
    console.log('🎉 ALL TESTS PASSED');
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=verify-auth-flow.js.map