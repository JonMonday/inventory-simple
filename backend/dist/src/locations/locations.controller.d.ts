import { LocationsService } from './locations.service';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    }[]>;
}
