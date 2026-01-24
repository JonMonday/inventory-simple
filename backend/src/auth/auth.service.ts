import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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
            },
        });

        if (!user || !user.isActive) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
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
        const passwordHash = await bcrypt.hash(newPassword, 10);

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
            permissionSet.add(`${up.permission.resource}.${up.permission.action}`);
        });

        // Add role-based permissions
        user.roles.forEach((ur) => {
            ur.role.permissions.forEach((rp) => {
                permissionSet.add(`${rp.permission.resource}.${rp.permission.action}`);
            });
        });

        return Array.from(permissionSet);
    }
}
