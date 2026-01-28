import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, verifyPassword } from '../common/utils/password.utils';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
                department: true,
                unit: true,
                branch: true,
            },
        });

        // Dev-only debug logging (won't expose in production)
        if (process.env.NODE_ENV !== 'production') {
            if (!user) {
                console.log(`[AUTH DEBUG] User not found: ${email}`);
            } else if (!user.isActive) {
                console.log(`[AUTH DEBUG] User inactive: ${email}`);
            }
        }

        if (!user || !user.isActive) {
            return null;
        }

        const isPasswordValid = await verifyPassword(password, user.passwordHash);

        if (process.env.NODE_ENV !== 'production' && !isPasswordValid) {
            console.log(`[AUTH DEBUG] Password mismatch for: ${email}`);
        }

        if (!isPasswordValid) {
            return null;
        }

        const { passwordHash, ...result } = user;
        return result;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                department: user.department,
                mustChangePassword: user.mustChangePassword,
                roles: user.roles.map((ur: any) => ur.role.name),
            },
        };
    }

    async changePassword(userId: string, newPassword: string) {
        const passwordHash = await hashPassword(newPassword);

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash,
                mustChangePassword: false,
            }
        });

        return { message: 'Password updated successfully' };
    }

    async findPermissions(userId: string): Promise<string[]> {
        // Fetch user with direct permissions and role-based permissions
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                permissions: {
                    include: {
                        permission: true,
                    },
                },
                roles: {
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            return [];
        }

        const permissionSet = new Set<string>();

        // Add direct user permissions
        user.permissions.forEach((up) => {
            permissionSet.add(up.permission.key);
        });

        // Add role-based permissions
        user.roles.forEach((ur) => {
            ur.role.permissions.forEach((rp) => {
                permissionSet.add(rp.permission.key);
            });
        });

        return Array.from(permissionSet);
    }
}
