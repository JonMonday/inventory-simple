import { Controller, Post, Body, Param, Get, UseGuards, Req, Put, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RequestsService } from './requests.service';
import { RequestWorkflowService } from './request-workflow.service';
import { CreateRequestDto } from './dto/request.dto';
import { CreateAssignmentsDto } from './dto/reviewer-resolution.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { EditableStateGuard } from '../common/guards/editable-state.guard';
import { EligibilityGuard } from '../common/guards/eligibility.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { PatchRequestLineDto, RequestLineDto, UpdateRequestDto } from './dto/request.dto';

@ApiTags('requests')
@ApiBearerAuth('JWT-auth')
@Controller('requests')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class RequestsController {
    constructor(
        private readonly requestsService: RequestsService,
        private readonly workflowService: RequestWorkflowService
    ) { }

    @Post()
    @Permissions('requests.create')
    async create(@Req() req: any, @Body() dto: CreateRequestDto) {
        return this.requestsService.create(req.user.id, dto);
    }

    @Get()
    @Permissions('requests.read')
    async findAll(@Req() req: any) {
        const isAdmin = req.user.roles.includes('SuperAdmin') || req.user.roles.includes('InventoryAdmin');
        return this.requestsService.findAll(req.user.id, isAdmin ? 'ADMIN' : undefined);
    }

    @Get(':id')
    @Permissions('requests.read')
    async findOne(@Param('id') id: string) {
        return this.requestsService.findOne(id);
    }

    @Put(':id')
    @UseGuards(EditableStateGuard, OwnershipGuard)
    @Permissions('requests.update')
    async update(@Param('id') id: string, @Body() dto: UpdateRequestDto) {
        return this.requestsService.update(id, dto);
    }

    @Post(':id/clone')
    @Permissions('requests.clone')
    async clone(@Param('id') id: string, @Req() req: any) {
        return this.requestsService.clone(id, req.user.id);
    }

    // ========================================================================
    // WORKFLOW ACTIONS
    // ========================================================================

    @Post(':id/submit')
    @UseGuards(EligibilityGuard)
    @Permissions('requests.submit')
    async submit(@Param('id') id: string, @Req() req: any) {
        return this.workflowService.submit(id, req.user.id);
    }

    @Post(':id/approve')
    @UseGuards(EligibilityGuard)
    @Permissions('requests.approve')
    async approve(@Param('id') id: string, @Req() req: any, @Body() body: { comment?: string }) {
        return this.workflowService.approve(id, req.user.id, body.comment);
    }

    @Post(':id/reject')
    @UseGuards(EligibilityGuard)
    @Permissions('requests.reject')
    async reject(@Param('id') id: string, @Req() req: any, @Body() body: { comment: string }) {
        return this.workflowService.reject(id, req.user.id, body.comment);
    }

    @Post(':id/cancel')
    @UseGuards(OwnershipGuard)
    @Permissions('requests.cancel')
    async cancel(@Param('id') id: string, @Req() req: any, @Body() body: { comment?: string }) {
        return this.workflowService.cancel(id, req.user.id, body.comment);
    }

    @Post(':id/reassign')
    @UseGuards(OwnershipGuard)
    @Permissions('requests.reassign')
    async reassign(@Param('id') id: string, @Req() req: any, @Body() body: { targetUserId: string }) {
        return this.workflowService.reassign(id, req.user.id, body.targetUserId);
    }

    @Post(':id/confirm')
    @UseGuards(OwnershipGuard)
    @Permissions('requests.confirm')
    async confirm(@Param('id') id: string, @Req() req: any, @Body() body: { comment?: string }) {
        return this.workflowService.confirm(id, req.user.id, body.comment);
    }

    // Fulfillment Actions
    @Post(':id/fulfillment/reserve')
    @UseGuards(EligibilityGuard)
    @Permissions('requests.reserve')
    async reserve(@Param('id') id: string, @Req() req: any) {
        return this.workflowService.reserve(id, req.user.id);
    }

    @Post(':id/fulfillment/issue')
    @UseGuards(EligibilityGuard)
    @Permissions('requests.issue')
    async issue(@Param('id') id: string, @Req() req: any) {
        return this.workflowService.issue(id, req.user.id);
    }

    // ========================================================================
    // LINES MANAGEMENT
    // ========================================================================

    @Get(':id/reviewers')
    @ApiOperation({ summary: 'Resolve eligible reviewers for the current stage' })
    getEligibleReviewers(@Param('id') id: string) {
        return this.requestsService.resolveEligibleReviewers(id);
    }

    @Get(':id/assignments')
    @ApiOperation({ summary: 'List current assignments for a request' })
    getAssignments(
        @Param('id') id: string,
        @Query('all') all?: boolean
    ) {
        return this.requestsService.getAssignments(id, all);
    }

    @Post(':id/assignments')
    @ApiOperation({ summary: 'Assign specific reviewers to the current stage' })
    async createAssignments(
        @Param('id') id: string,
        @Req() req: any,
        @Body() dto: CreateAssignmentsDto
    ) {
        return this.requestsService.createAssignments(id, req.user.id, dto.stageId, dto.userIds);
    }

    @Get(':id/lines')
    @Permissions('requests.read')
    async getLines(@Param('id') id: string) {
        return this.requestsService.getLines(id);
    }

    @Post(':id/lines')
    @UseGuards(EditableStateGuard, OwnershipGuard)
    @Permissions('requests.lines.manage')
    async addLine(@Param('id') id: string, @Body() dto: RequestLineDto) {
        return this.requestsService.addLine(id, dto);
    }

    @Patch(':id/lines/:lid')
    @UseGuards(EditableStateGuard, OwnershipGuard)
    @Permissions('requests.lines.manage')
    async updateLine(@Param('lid') lid: string, @Body() dto: PatchRequestLineDto) {
        return this.requestsService.updateLine(lid, dto.quantity);
    }

    @Post(':id/lines/:lid/remove')
    @UseGuards(EditableStateGuard, OwnershipGuard)
    @Permissions('requests.lines.manage')
    async removeLine(@Param('lid') lid: string) {
        return this.requestsService.removeLine(lid);
    }

    // ========================================================================
    // DIAGNOSTICS & COMMENTS
    // ========================================================================

    @Get(':id/events')
    @Permissions('requests.read')
    async getEvents(@Param('id') id: string) {
        return this.requestsService.getEvents(id);
    }

    @Get(':id/participants')
    @Permissions('requests.read')
    async getParticipants(@Param('id') id: string) {
        return this.requestsService.getParticipants(id);
    }

    @Get(':id/reservations')
    @Permissions('requests.read')
    async getReservations(@Param('id') id: string) {
        return this.requestsService.getReservations(id);
    }

    @Get(':id/comments')
    @Permissions('comments.read')
    async getComments(@Param('id') id: string) {
        return this.requestsService.getComments(id);
    }

    @Post(':id/comments')
    @Permissions('comments.create')
    async addComment(@Param('id') id: string, @Req() req: any, @Body() body: { body: string }) {
        return this.requestsService.addComment(id, req.user.id, body.body);
    }
}
