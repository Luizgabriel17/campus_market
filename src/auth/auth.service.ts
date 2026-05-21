import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const userExists = await this.prisma.cliente.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userExists) {
      throw new BadRequestException('Email já cadastrado');
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const user = await this.prisma.cliente.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: senhaHash,
      },
    });

    return {
      message: 'Usuário criado com sucesso',
      user,
    };
  }

  async login(data: any) {
    const user = await this.prisma.cliente.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const senhaCorreta = await bcrypt.compare(
      data.senha,
      user.senha,
    );

    if (!senhaCorreta) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      token,
      user,
    };
  }
}