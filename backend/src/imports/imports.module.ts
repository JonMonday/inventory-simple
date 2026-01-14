import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ImportsService } from './imports.service';
import { ImportsController } from './imports.controller';
import { ImportsProcessor } from './imports.processor';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        UsersModule,
        BullModule.registerQueue({
            name: 'import-queue',
        }),
    ],
    controllers: [ImportsController],
    providers: [ImportsService, ImportsProcessor],
    exports: [ImportsService],
})
export class ImportsModule { }
