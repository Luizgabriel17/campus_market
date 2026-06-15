import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  private generateToken(user: { id: number; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  async register(registerDto: RegisterDto) {
    // Adicionado o 'role' na desestruturação
    const { email, password, name, role } = registerDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    const token = this.generateToken(user);

    return {
      access_token: token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.password) {
      throw new UnauthorizedException('User uses Google login');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      access_token: token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };
  }

  async loginWithGoogle(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new BadRequestException('Invalid Google token payload');
      }

      let user = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });

      let isNewUser = false; // Flag para o Frontend saber se é o primeiro acesso

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: payload.email,
            name: payload.name || 'Google User',
            googleId: payload.sub,
            avatar: payload.picture,
            role: 'CLIENTE', // Define como CLIENTE por padrão temporariamente
          },
        });
        isNewUser = true; // <--- Marcado como usuário novo
      } else if (!user.googleId) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId: payload.sub, avatar: payload.picture },
        });
      }

      const accessToken = this.generateToken(user);

      return {
        access_token: accessToken,
        isNewUser, // Retornando a flag para o frontend tratar
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      };
    } catch (error) {
      throw new UnauthorizedException('Google authentication failed');
    }
  }
}