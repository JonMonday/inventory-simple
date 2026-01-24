import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: { email: string; password: string }) {
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
    async changePassword(@Req() req: any, @Body() body: { password: string }) {
        return this.authService.changePassword(req.user.id, body.password);
    }
}
