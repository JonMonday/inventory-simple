import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestWorkflowService } from './request-workflow.service';
import { RequestsController } from './requests.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
    imports: [PrismaModule, InventoryModule],
    providers: [RequestsService, RequestWorkflowService],
    controllers: [RequestsController],
    exports: [RequestsService, RequestWorkflowService],
})
export class RequestsModule { }
