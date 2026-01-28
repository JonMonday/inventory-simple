import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { PERMISSIONS, Permission } from './auth/permissions';

class PermissionDto {
    @ApiProperty({ enum: Object.values(PERMISSIONS) })
    permission: string;
}

@ApiTags('Common')
@Controller('common')
export class CommonController {
    @Get('permissions')
    @ApiOkResponse({
        description: 'Returns all system permissions',
        type: [String],
        schema: {
            example: Object.values(PERMISSIONS)
        }
    })
    getPermissions() {
        return Object.values(PERMISSIONS);
    }
}
