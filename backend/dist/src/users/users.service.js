"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
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
                    create: data.roleIds?.map((id) => ({ roleId: id })) || []
                }
            }
        });
    }
    async findAll() {
        return this.prisma.user.findMany({
            include: { department: true, unit: true, jobRole: true, branch: true }
        });
    }
    async findOne(id) {
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
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async update(id, data) {
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
    async getRoles() {
        return this.prisma.role.findMany({ orderBy: { name: 'asc' } });
    }
    async getRole(id) {
        const r = await this.prisma.role.findUnique({ where: { id }, include: { permissions: { include: { permission: true } } } });
        if (!r)
            throw new common_1.NotFoundException('Role not found');
        return r;
    }
    async createRole(data) {
        return this.prisma.role.create({ data });
    }
    async updateRole(id, data) {
        return this.prisma.role.update({ where: { id }, data });
    }
    async getPermissions() {
        return this.prisma.permission.findMany({ orderBy: { key: 'asc' } });
    }
    async getUserRoles(userId) {
        return this.prisma.userRole.findMany({ where: { userId }, include: { role: true } });
    }
    async assignUserRole(userId, roleId) {
        return this.prisma.userRole.create({ data: { userId, roleId } });
    }
    async removeUserRole(userId, roleId) {
        return this.prisma.userRole.deleteMany({ where: { userId, roleId } });
    }
    async getRolePermissions(roleId) {
        return this.prisma.rolePermission.findMany({ where: { roleId }, include: { permission: true } });
    }
    async addRolePermission(roleId, permissionId) {
        return this.prisma.rolePermission.create({ data: { roleId, permissionId } });
    }
    async removeRolePermission(roleId, permissionId) {
        return this.prisma.rolePermission.deleteMany({ where: { roleId, permissionId } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map