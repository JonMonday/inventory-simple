import { AuthService } from './auth.service';
import { LoginDto, ChangePasswordDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        permissions: string[];
        access_token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            department: any;
            mustChangePassword: any;
            roles: any;
        };
    }>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
