import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(data: any) {
    const senhaHash = await bcrypt.hash(data.senha, 10);

    return {
      message: 'Usuário cadastrado',
      user: {
        ...data,
        senha: senhaHash,
      },
    };
  }

  async login(data: any) {
    const token = this.jwtService.sign({
      email: data.email,
    });

    return {
      token,
    };
  }
}