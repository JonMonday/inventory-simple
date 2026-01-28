import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@Controller('users')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    @Permissions('users.create')
    async create(@Body() createDto: any) {
        return this.usersService.create(createDto);
    }

    @Get()
    @Permissions('users.read')
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Permissions('users.read')
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @Permissions('users.update')
    async update(@Param('id') id: string, @Body() updateDto: any) {
        return this.usersService.update(id, updateDto);
    }

    // ========================================================================
    // USER-ROLE MAPPING
    // ========================================================================

    @Get(':id/roles')
    @Permissions('users.roles')
    async getUserRoles(@Param('id') id: string) {
        return this.usersService.getUserRoles(id);
    }

    @Post(':id/roles')
    @Permissions('users.roles')
    async assignRole(@Param('id') id: string, @Body() body: { roleId: string }) {
        return this.usersService.assignUserRole(id, body.roleId);
    }

    @Post(':id/roles/:rid/remove')
    @Permissions('users.roles')
    async removeRole(@Param('id') id: string, @Param('rid') rid: string) {
        return this.usersService.removeUserRole(id, rid);
    }
}

@Controller('roles')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class RolesController {
    constructor(private usersService: UsersService) { }

    @Get()
    @Permissions('roles.read')
    async findAll() {
        return this.usersService.getRoles();
    }

    @Get(':id')
    @Permissions('roles.read')
    async findOne(@Param('id') id: string) {
        return this.usersService.getRole(id);
    }

    @Post()
    @Permissions('roles.create')
    async create(@Body() dto: { code: string; name: string; description?: string }) {
        return this.usersService.createRole(dto);
    }

    @Patch(':id')
    @Permissions('roles.update')
    async update(@Param('id') id: string, @Body() dto: { name?: string; description?: string }) {
        return this.usersService.updateRole(id, dto);
    }

    // ========================================================================
    // ROLE-PERMISSION MAPPING
    // ========================================================================

    @Get(':id/permissions')
    @Permissions('roles.manage')
    async getRolePermissions(@Param('id') id: string) {
        return this.usersService.getRolePermissions(id);
    }

    @Post(':id/permissions')
    @Permissions('roles.manage')
    async addPermission(@Param('id') id: string, @Body() body: { permissionId: string }) {
        return this.usersService.addRolePermission(id, body.permissionId);
    }

    @Post(':id/permissions/:pid/remove')
    @Permissions('roles.manage')
    async removePermission(@Param('id') id: string, @Param('pid') pid: string) {
        return this.usersService.removeRolePermission(id, pid);
    }
}

@Controller('permissions')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class PermissionsController {
    constructor(private usersService: UsersService) { }

    @Get()
    @Permissions('permissions.read')
    async findAll() {
        return this.usersService.getPermissions();
    }
}
