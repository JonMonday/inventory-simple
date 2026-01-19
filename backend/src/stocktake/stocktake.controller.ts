import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StocktakeService } from './stocktake.service';
import { CreateStocktakeDto, SubmitStocktakeCountDto } from './dto/stocktake.dto';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('stocktakes')
@UseGuards(AuthGuard('jwt'))
export class StocktakeController {
    constructor(private readonly stocktakeService: StocktakeService) { }

    @Post()
    @Permissions('stocktake.create')
    async create(@Req() req: any, @Body() dto: CreateStocktakeDto) {
        return this.stocktakeService.create(req.user.id, dto);
    }

    @Post(':id/start-count')
    @Permissions('stocktake.create')
    async startCounting(@Param('id') id: string, @Req() req: any) {
        return this.stocktakeService.startCounting(id, req.user.id);
    }

    @Post(':id/submit-count')
    @Permissions('stocktake.submit')
    async submitCount(@Param('id') id: string, @Req() req: any, @Body() dto: SubmitStocktakeCountDto) {
        return this.stocktakeService.submitCount(id, req.user.id, dto);
    }

    @Post(':id/approve')
    @Permissions('stocktake.approve')
    async approve(@Param('id') id: string, @Req() req: any) {
        return this.stocktakeService.approve(id, req.user.id);
    }

    @Post(':id/apply')
    @Permissions('stocktake.apply')
    async apply(@Param('id') id: string, @Req() req: any) {
        return this.stocktakeService.apply(id, req.user.id);
    }

    @Get(':id')
    @Permissions('stocktake.read')
    async findOne(@Param('id') id: string) {
        return this.stocktakeService.findOne(id);
    }
}
