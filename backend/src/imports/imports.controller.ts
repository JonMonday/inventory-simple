import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request, Get, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportsService } from './imports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('imports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ImportsController {
    constructor(private readonly importsService: ImportsService) { }

    @Post('inventory')
    @Permissions('imports.create')
    @UseInterceptors(FileInterceptor('file'))
    async importInventory(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
        return this.importsService.createImportJob(file, req.user.id);
    }

    @Get('status/:jobId')
    @Permissions('imports.read')
    async getStatus(@Param('jobId') jobId: string) {
        return this.importsService.getImportStatus(jobId);
    }
}
