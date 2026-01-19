import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            department: any;
            mustChangePassword: any;
            roles: any;
        };
    } | {
        message: string;
    }>;
    changePassword(req: any, body: {
        password: string;
    }): Promise<{
        message: string;
    }>;
}
