import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocationsService } from './locations.service';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@Controller('locations')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) { }

    @Get()
    async findAll() {
        return this.locationsService.findAll();
    }
}
