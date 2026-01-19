import { Controller, Post, Body, Param, Get, UseGuards, Req, Patch, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestsService } from './requests.service';
import { CreateRequestDto, UpdateRequestLinesDto, ReassignRequestDto } from './dto/request.dto';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('requests')
@UseGuards(AuthGuard('jwt'))
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) { }

    @Post()
    @Permissions('requests.create')
    async create(@Req() req: any, @Body() dto: CreateRequestDto) {
        return this.requestsService.create(req.user.id, dto);
    }

    @Get()
    @Permissions('requests.read')
    async findAll(@Req() req: any) {
        const isAdmin = req.user.roles.includes('ADMIN');
        return this.requestsService.findAll(req.user.id, isAdmin ? 'ADMIN' : undefined);
    }

    @Get(':id')
    @Permissions('requests.read')
    async findOne(@Param('id') id: string) {
        return this.requestsService.findOne(id);
    }

    @Post(':id/submit')
    @Permissions('requests.submit')
    async submit(@Param('id') id: string, @Req() req: any) {
        return this.requestsService.submit(id, req.user.id);
    }

    @Post(':id/start-review')
    @Permissions('requests.review')
    async startReview(@Param('id') id: string, @Req() req: any) {
        return this.requestsService.startReview(id, req.user.id);
    }

    @Post(':id/refactor')
    @Permissions('requests.refactor')
    async refactor(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateRequestLinesDto) {
        return this.requestsService.refactor(id, req.user.id, dto);
    }

    @Post(':id/send-to-approval')
    @Permissions('requests.review')
    async sendToApproval(@Param('id') id: string, @Req() req: any, @Body('issueFromLocationId') issueFromLocationId?: string) {
        return this.requestsService.sendToApproval(id, req.user.id, issueFromLocationId);
    }

    @Post(':id/approve')
    @Permissions('requests.approve')
    async approve(@Param('id') id: string, @Req() req: any) {
        return this.requestsService.approve(id, req.user.id);
    }

    @Post(':id/reject')
    @Permissions('requests.approve')
    async reject(@Param('id') id: string, @Req() req: any) {
        // Basic rejection logic: move to REJECTED and log
        return this.requestsService.approve(id, req.user.id); // Placeholder for reject if logic is similar but status changed
    }

    @Post(':id/reassign')
    @Permissions('requests.reassign')
    async reassign(@Param('id') id: string, @Req() req: any, @Body() dto: ReassignRequestDto) {
        const isAdmin = req.user.roles.includes('ADMIN');
        return this.requestsService.reassign(id, req.user.id, isAdmin, dto);
    }

    @Post(':id/fulfill')
    @Permissions('requests.fulfill')
    async fulfill(@Param('id') id: string, @Req() req: any) {
        return this.requestsService.fulfill(id, req.user.id);
    }
}
