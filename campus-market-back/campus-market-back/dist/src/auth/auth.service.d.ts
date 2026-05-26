import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
    validateGoogleLogin(googleId: string, email: string, displayName: string): Promise<{
        token: string;
        user: {
            email: string;
            nome: string;
            id: number;
            data_criacao: Date | null;
            status: string | null;
        };
    }>;
}
