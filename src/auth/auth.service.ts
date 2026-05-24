import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import { LoginDto } from './dto/login.dto';

import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,

    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const userExists =
      await this.prisma.cliente.findUnique({
        where: {
          email: data.email,
        },
      });

    if (userExists) {
      throw new BadRequestException(
        'Email já cadastrado',
      );
    }

    const senhaHash = await bcrypt.hash(
      data.senha,
      10,
    );

    const user =
      await this.prisma.cliente.create({
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

    const { senha, ...userWithoutPassword } =
      user;

    return {
      message: 'Usuário criado com sucesso',

      token,

      user: userWithoutPassword,
    };
  }

  async login(data: LoginDto) {
    const user =
      await this.prisma.cliente.findUnique({
        where: {
          email: data.email,
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Email ou senha inválidos',
      );
    }

    const senhaCorreta = await bcrypt.compare(
      data.senha,
      user.senha,
    );

    if (!senhaCorreta) {
      throw new UnauthorizedException(
        'Email ou senha inválidos',
      );
    }

    const token = this.jwtService.sign({
      sub: user.id,

      email: user.email,

      nome: user.nome,
    });

    const { senha, ...userWithoutPassword } =
      user;

    return {
      token,

      user: userWithoutPassword,
    };
  }

  async validateGoogleLogin(
    googleId: string,

    email: string,

    displayName: string,
  ) {
    if (!email) {
      throw new UnauthorizedException(
        'Conta Google sem email',
      );
    }

    let user =
      await this.prisma.cliente.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      const randomPassword = `${googleId}-${Date.now()}`;

      const senhaHash = await bcrypt.hash(
        randomPassword,
        10,
      );

      user =
        await this.prisma.cliente.create({
          data: {
            nome:
              displayName ||
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

    const { senha, ...userWithoutPassword } =
      user;

    return {
      token,

      user: userWithoutPassword,
    };
  }
}