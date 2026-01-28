import { Module } from '@nestjs/common';
import { UsersController, RolesController, PermissionsController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [UsersController, RolesController, PermissionsController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
