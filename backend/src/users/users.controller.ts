import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    @Permissions('users.create')
    async create(@Body() createDto: { email: string; fullName: string; department?: string; password?: string }) {
        return this.usersService.create(createDto);
    }

    @Get()
    @Permissions('users.read')
    async findAll() {
        return this.usersService.findAll();
    }

    @Put(':id')
    @Permissions('users.update')
    async update(
        @Param('id') id: string,
        @Body() updateDto: { fullName?: string; department?: string; isActive?: boolean },
    ) {
        return this.usersService.update(id, updateDto);
    }
}
