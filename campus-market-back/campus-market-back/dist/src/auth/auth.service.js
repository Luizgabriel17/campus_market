"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(data) {
        const userExists = await this.prisma.cliente.findUnique({
            where: {
                email: data.email,
            },
        });
        if (userExists) {
            throw new common_1.BadRequestException('Email já cadastrado');
        }
        const senhaHash = await bcrypt.hash(data.senha, 10);
        const user = await this.prisma.cliente.create({
            data: {
                nome: data.nome,
                email: data.email,
                senha: senhaHash,
            },
        });
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            nome: user.nome,
        });
        const { senha, ...userWithoutPassword } = user;
        return {
            message: 'Usuário criado com sucesso',
            token,
            user: userWithoutPassword,
        };
    }
    async login(data) {
        const user = await this.prisma.cliente.findUnique({
            where: {
                email: data.email,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email ou senha inválidos');
        }
        const senhaCorreta = await bcrypt.compare(data.senha, user.senha);
        if (!senhaCorreta) {
            throw new common_1.UnauthorizedException('Email ou senha inválidos');
        }
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            nome: user.nome,
        });
        const { senha, ...userWithoutPassword } = user;
        return {
            token,
            user: userWithoutPassword,
        };
    }
    async validateGoogleLogin(googleId, email, displayName) {
        if (!email) {
            throw new common_1.UnauthorizedException('Conta Google sem email');
        }
        let user = await this.prisma.cliente.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            const randomPassword = `${googleId}-${Date.now()}`;
            const senhaHash = await bcrypt.hash(randomPassword, 10);
            user =
                await this.prisma.cliente.create({
                    data: {
                        nome: displayName ||
                            email.split('@')[0],
                        email,
                        senha: senhaHash,
                    },
                });
        }
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            nome: user.nome,
        });
        const { senha, ...userWithoutPassword } = user;
        return {
            token,
            user: userWithoutPassword,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map