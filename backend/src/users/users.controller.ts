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
    async create(@Body() createDto: { email: string; fullName: string; departmentId?: string; locationId?: string; password?: string; roleIds?: string[] }) {
        return this.usersService.create(createDto);
    }

    @Get()
    @Permissions('users.read')
    async findAll() {
        return this.usersService.findAll();
    }

    @Get('roles')
    @Permissions('roles.manage')
    async findAllRoles() {
        return this.usersService.findAllRoles();
    }

    @Get(':id')
    @Permissions('users.read')
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @Permissions('users.update')
    async update(
        @Param('id') id: string,
        @Body() updateDto: { fullName?: string; departmentId?: string; locationId?: string; isActive?: boolean; roleIds?: string[] },
    ) {
        return this.usersService.update(id, updateDto);
    }
}
