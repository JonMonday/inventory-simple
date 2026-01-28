import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Req,
    UnauthorizedException,
    BadRequestException
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiBearerAuth
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto, ChangePasswordDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiBody({ type: LoginDto })
    @ApiOkResponse({
        description: 'Login successful',
        schema: {
            type: 'object',
            properties: {
                accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                        email: { type: 'string', example: 'super_admin@gra.local' },
                        fullName: { type: 'string', example: 'Super Admin' },
                    },
                },
                permissions: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['requests.read', 'requests.create', 'inventory.manage'],
                },
            },
        },
    })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(
            loginDto.email,
            loginDto.password,
        );

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const loginResponse = await this.authService.login(user);
        const permissions = await this.authService.findPermissions(user.id);

        return {
            ...loginResponse,
            permissions,
        };
    }

    @Post('change-password')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Change password for authenticated user' })
    @ApiBody({ type: ChangePasswordDto })
    @ApiOkResponse({
        description: 'Password changed successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Password changed successfully' },
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Validation error or passwords do not match',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: { type: 'string', example: 'Current password is incorrect' },
            },
        },
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized - invalid or missing token' })
    async changePassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
        // Validate that new passwords match
        if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword) {
            throw new BadRequestException('New passwords do not match');
        }

        // Verify current password
        const user = await this.authService.validateUser(
            req.user.email,
            changePasswordDto.currentPassword,
        );

        if (!user) {
            throw new BadRequestException('Current password is incorrect');
        }

        // Change password
        await this.authService.changePassword(req.user.id, changePasswordDto.newPassword);

        return {
            message: 'Password changed successfully',
        };
    }
}
