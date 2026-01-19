
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3001';

async function main() {
    console.log('🚀 Starting Verification Script...');

    const adminEmail = `admin-${Date.now()}@test.com`;
    const adminPassword = 'AdminPassword123!';
    console.log(`Creating Admin: ${adminEmail}`);

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create Admin
    await prisma.user.create({
        data: {
            email: adminEmail,
            passwordHash,
            fullName: 'Super Admin',
            isActive: true,
            roles: {
                create: {
                    role: {
                        connectOrCreate: {
                            where: { name: 'SUPER_ADMIN' },
                            create: {
                                name: 'SUPER_ADMIN',
                                isSystemRole: true,
                                permissions: {
                                    create: [
                                        { permission: { connectOrCreate: { where: { resource_action: { resource: 'users', action: 'create' } }, create: { resource: 'users', action: 'create' } } } },
                                        { permission: { connectOrCreate: { where: { resource_action: { resource: 'users', action: 'read' } }, create: { resource: 'users', action: 'read' } } } },
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // 2. Login as Admin
    console.log('Logging in as Admin...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: adminEmail,
        password: adminPassword,
    });
    const adminToken = loginRes.data.access_token;
    console.log('✅ Admin Logged In');

    // 3. Create New User (No Password provided)
    const newUserEmail = `newuser-${Date.now()}@test.com`;
    console.log(`Creating New User (via Admin API): ${newUserEmail}`);
    try {
        await axios.post(`${API_URL}/users`, {
            email: newUserEmail,
            fullName: 'Test Employee',
            department: 'Warehouse'
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ User Created');
    } catch (e: any) {
        console.error('❌ User Creation Failed:', e.response?.data || e.message);
        process.exit(1);
    }

    // 4. Verify DB State
    const newUser = await prisma.user.findUnique({ where: { email: newUserEmail } });
    if (!newUser?.mustChangePassword) {
        console.error('❌ DB Verification Failed: mustChangePassword should be true');
        process.exit(1);
    }
    console.log('✅ DB Verification Passed: mustChangePassword is true');

    // 5. Login as New User (Default Password)
    console.log('Logging in as New User...');
    const userLoginRes = await axios.post(`${API_URL}/auth/login`, {
        email: newUserEmail,
        password: 'ChangeMe!123',
    });

    if (userLoginRes.data.user.mustChangePassword !== true) {
        console.error('❌ Login Response Failed: mustChangePassword should be true');
        process.exit(1);
    }
    console.log('✅ Login Verification Passed: Response indicates mustChangePassword');
    const userToken = userLoginRes.data.access_token;

    // 6. Change Password
    console.log('Changing Password...');
    const newPassword = 'NewSecurePassword123!';
    await axios.post(`${API_URL}/auth/change-password`, {
        password: newPassword
    }, {
        headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Password Changed');

    // 7. Verify DB State (mustChangePassword = false)
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
