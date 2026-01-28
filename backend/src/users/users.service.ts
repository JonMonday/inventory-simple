import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                fullName: data.fullName,
                departmentId: data.departmentId,
                unitId: data.unitId,
                jobRoleId: data.jobRoleId,
                branchId: data.branchId,
                passwordHash: data.password || 'password123',
                roles: {
                    create: data.roleIds?.map((id: string) => ({ roleId: id })) || []
                }
            }
        });
    }

    async findAll() {
        return this.prisma.user.findMany({
            include: { department: true, unit: true, jobRole: true, branch: true }
        });
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                department: true,
                unit: true,
                jobRole: true,
                branch: true,
                roles: { include: { role: true } }
            }
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async update(id: string, data: any) {
        return this.prisma.user.update({
            where: { id },
            data: {
                fullName: data.fullName,
                departmentId: data.departmentId,
                unitId: data.unitId,
                jobRoleId: data.jobRoleId,
                isActive: data.isActive
            }
        });
    }

    // ========================================================================
    // ROLES CRUD
    // ========================================================================

    async getRoles() {
        return this.prisma.role.findMany({ orderBy: { name: 'asc' } });
    }

    async getRole(id: string) {
        const r = await this.prisma.role.findUnique({ where: { id }, include: { permissions: { include: { permission: true } } } });
        if (!r) throw new NotFoundException('Role not found');
        return r;
    }

    async createRole(data: { code: string; name: string; description?: string }) {
        return this.prisma.role.create({ data });
    }

    async updateRole(id: string, data: { name?: string; description?: string }) {
        return this.prisma.role.update({ where: { id }, data });
    }

    // ========================================================================
    // PERMISSIONS
    // ========================================================================

    async getPermissions() {
        return this.prisma.permission.findMany({ orderBy: { key: 'asc' } });
    }

    // ========================================================================
    // MAPPINGS
    // ========================================================================

    async getUserRoles(userId: string) {
        return this.prisma.userRole.findMany({ where: { userId }, include: { role: true } });
    }

    async assignUserRole(userId: string, roleId: string) {
        return this.prisma.userRole.create({ data: { userId, roleId } });
    }

    async removeUserRole(userId: string, roleId: string) {
        return this.prisma.userRole.deleteMany({ where: { userId, roleId } });
    }

    async getRolePermissions(roleId: string) {
        return this.prisma.rolePermission.findMany({ where: { roleId }, include: { permission: true } });
    }

    async addRolePermission(roleId: string, permissionId: string) {
        return this.prisma.rolePermission.create({ data: { roleId, permissionId } });
    }

    async removeRolePermission(roleId: string, permissionId: string) {
        return this.prisma.rolePermission.deleteMany({ where: { roleId, permissionId } });
    }
}
