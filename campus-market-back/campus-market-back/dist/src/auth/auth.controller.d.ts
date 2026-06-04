import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    googleLogin(token: string): Promise<{
        email: string;
        name: string;
        picture: string;
    }>;
}
