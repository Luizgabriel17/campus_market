import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(data: RegisterDto): Promise<{
        message: string;
        token: string;
        user: {
            email: string;
            nome: string;
            id: number;
            data_criacao: Date | null;
            status: string | null;
        };
    }>;
    login(data: LoginDto): Promise<{
        token: string;
        user: {
            email: string;
            nome: string;
            id: number;
            data_criacao: Date | null;
            status: string | null;
        };
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any): any;
    getProfile(req: any): any;
}
