import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  private generateToken(user: {
    id: number;
    email: string;
    role: string;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private generateOtp(): string {
    return Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
  }

  async register(registerDto: RegisterDto) {
    const {
      email,
      password,
      name,
      role,
      phone,
    } = registerDto;

    const existingUser =
      await this.prisma.user.findUnique({
        where: { email },
      });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        await this.sendVerificationCodeAsync(
          existingUser.id,
          email,
        );

        return {
          message:
            'Este e-mail já possui cadastro pendente. Enviamos um novo código de verificação.',
          userId: existingUser.id,
        };
      }

      throw new BadRequestException(
        'Email já cadastrado.',
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          phone,
          emailVerified: false,
        },
      });

    // MUDANÇA PRINCIPAL: Enviar email de forma assíncrona
    // Não aguarda a resposta - apenas adiciona à fila
    await this.sendVerificationCodeAsync(
      user.id,
      email,
    );

    // Retorna imediatamente ao usuário
    return {
      message:
        'Cadastro realizado! Verifique seu e-mail para confirmar a conta.',
      userId: user.id,
    };
  }

  async verifyEmail(
    userId: number,
    code: string,
  ) {
    const verification =
      await this.prisma.emailVerification.findFirst(
        {
          where: { userId },
          orderBy: {
            createdAt: 'desc',
          },
        },
      );

    if (!verification) {
      throw new BadRequestException(
        'Nenhum código de verificação encontrado.',
      );
    }

    if (new Date() > verification.expiresAt) {
      throw new BadRequestException(
        'Código expirado. Solicite um novo.',
      );
    }

    if (verification.code !== code) {
      throw new BadRequestException(
        'Código inválido.',
      );
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
      },
    });

    await this.prisma.emailVerification.deleteMany(
      {
        where: { userId },
      },
    );

    const user =
      await this.prisma.user.findUnique({
        where: { id: userId },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Usuário não encontrado.',
      );
    }

    const token =
      this.generateToken(user);

    return {
      message:
        'E-mail confirmado com sucesso!',
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
    };
  }

  async resendVerificationCode(
    userId: number,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: { id: userId },
      });

    if (!user) {
      throw new BadRequestException(
        'Usuário não encontrado.',
      );
    }

    if (user.emailVerified) {
      throw new BadRequestException(
        'E-mail já verificado.',
      );
    }

    // MUDANÇA: Reenvio também é assíncrono
    await this.sendVerificationCodeAsync(
      userId,
      user.email,
    );

    return {
      message:
        'Novo código enviado para o seu e-mail.',
    };
  }

  async login(loginDto: LoginDto) {
    const {
      email,
      password,
    } = loginDto;

    const user =
      await this.prisma.user.findUnique({
        where: { email },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Credenciais inválidas.',
      );
    }

    if (user.status === 'INATIVO') {
      throw new UnauthorizedException(
        'Sua conta está desativada.',
      );
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Credenciais inválidas.',
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Credenciais inválidas.',
      );
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Confirme seu e-mail antes de fazer login.',
      );
    }

    const token =
      this.generateToken(user);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
    };
  }

  async getProfile(userId: number) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          addresses: {
            orderBy: {
              isDefault: 'desc',
            },
          },
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Usuário não encontrado.',
      );
    }

    const { password, ...result } =
      user;

    return result;
  }

  private async sendVerificationCodeAsync(
    userId: number,
    email: string,
  ) {
    const code = this.generateOtp();
    const expiresAt = new Date(
      Date.now() + 15 * 60 * 1000,
    );

    await this.prisma.emailVerification.deleteMany({
      where: { userId },
    });

    await this.prisma.emailVerification.create({
      data: {
        userId,
        code,
        expiresAt,
      },
    });

    console.log(
      `\n==================================================\n[CÓDIGO DE VERIFICAÇÃO] E-mail: ${email} | Código: ${code}\n==================================================\n`,
    );

    try {
      await this.mailService.sendVerificationCode(email, code);
    } catch (mailError) {
      console.error(
        `[Email Error] Não foi possível enviar o e-mail para ${email}:`,
        mailError.message,
      );
    }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado com este e-mail.');
    }

    const code = this.generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.emailVerification.deleteMany({
      where: { userId: user.id },
    });

    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    // Print do código de recuperação nos logs para depuração
    console.log(
      `\n==================================================\n[RECUPERAÇÃO DE SENHA] E-mail: ${email} | Código: ${code}\n==================================================\n`
    );

    try {
      await this.mailService.sendPasswordRecoveryCode(email, code);
    } catch (mailError) {
      console.error(
        `[Email Error] Não foi possível enviar o e-mail de recuperação para ${email}. Erro:`,
        mailError.message
      );
    }

    return {
      message: 'Código de recuperação enviado para o seu e-mail.',
      userId: user.id,
    };
  }

  async resetPassword(userId: number, code: string, newPassword: string) {
    const verification = await this.prisma.emailVerification.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) {
      throw new BadRequestException('Código de recuperação inválido ou inexistente.');
    }

    if (new Date() > verification.expiresAt) {
      throw new BadRequestException('Código expirado. Solicite uma nova recuperação.');
    }

    if (verification.code !== code) {
      throw new BadRequestException('Código de recuperação incorreto.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    await this.prisma.emailVerification.deleteMany({
      where: { userId },
    });

    return {
      message: 'Senha redefinida com sucesso!',
    };
  }
}