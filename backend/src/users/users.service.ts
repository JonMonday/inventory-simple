import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: { email: string; fullName: string; locationId?: string; departmentId?: string; password?: string; roleIds?: string[] }) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        // Validate location types if provided
        if (data.locationId) {
            const loc = await this.prisma.location.findUnique({ where: { id: data.locationId } });
            if (!loc || loc.type === 'DEPARTMENT') {
                throw new BadRequestException('Personal location cannot be of type DEPARTMENT');
            }
        }
        if (data.departmentId) {
            const dept = await this.prisma.location.findUnique({ where: { id: data.departmentId } });
            if (!dept || dept.type !== 'DEPARTMENT') {
                throw new BadRequestException('Department ID must point to a location of type DEPARTMENT');
            }
        }

        const finalPassword = data.password || 'ChangeMe!123';
        const passwordHash = await bcrypt.hash(finalPassword, 10);

        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                fullName: data.fullName,
                locationId: data.locationId,
                departmentId: data.departmentId,
                passwordHash,
                mustChangePassword: true, // Always force change when created by admin
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                locationId: true,
                departmentId: true,
                mustChangePassword: true,
                isActive: true,
                createdAt: true,
                roles: {
                    select: {
                        role: { select: { name: true } }
                    }
                }
            },
        });

        if (data.roleIds?.length) {
            await this.prisma.userRole.createMany({
                data: data.roleIds.map(roleId => ({
                    userId: user.id,
                    roleId,
                })),
            });
        }

        return user;
    }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                fullName: true,
                locationId: true,
                departmentId: true,
                isActive: true,
                createdAt: true,
                location: { select: { name: true, type: true } },
                department: { select: { name: true, type: true } },
                roles: {
                    select: {
                        role: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                locationId: true,
                departmentId: true,
                isActive: true,
                createdAt: true,
                location: { select: { id: true, name: true, type: true } },
                department: { select: { id: true, name: true, type: true } },
                roles: {
                    select: {
                        role: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async update(id: string, data: { fullName?: string; locationId?: string; departmentId?: string; isActive?: boolean; roleIds?: string[] }) {
        const { roleIds, ...updateData } = data;
        // Validate location types if provided
        if (data.locationId) {
            const loc = await this.prisma.location.findUnique({ where: { id: data.locationId } });
            if (!loc || loc.type === 'DEPARTMENT') {
                throw new BadRequestException('Personal location cannot be of type DEPARTMENT');
            }
        }
        if (data.departmentId) {
            const dept = await this.prisma.location.findUnique({ where: { id: data.departmentId } });
            if (!dept || dept.type !== 'DEPARTMENT') {
                throw new BadRequestException('Department ID must point to a location of type DEPARTMENT');
            }
        }

        const user = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });

        if (roleIds !== undefined) {
            await this.prisma.userRole.deleteMany({ where: { userId: id } });
            if (roleIds.length) {
                await this.prisma.userRole.createMany({
                    data: roleIds.map(roleId => ({
                        userId: id,
                        roleId,
                    })),
                });
            }
        }

        return user;
    }
    async findAllRoles() {
        return this.prisma.role.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async assignRole(userId: string, roleId: string) {
        return this.prisma.userRole.create({
            data: {
                userId,
                roleId,
            },
        });
    }
}
