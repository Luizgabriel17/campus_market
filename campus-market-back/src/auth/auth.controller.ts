import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Res,
  BadRequestException,
} from '@nestjs/common';

import { Response } from 'express';

import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';

import { JwtAuthGuard } from './jwt-auth.guard';

import { LoginDto } from './dto/login.dto';

import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    try {
      if (!req.user) {
        throw new BadRequestException('Falha na autenticação do Google');
      }
      
      // O token já vem no req.user retornado pela estratégia
      const token = req.user.token;
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
      
      // Redirecionar para o frontend com o token na URL
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
      res.redirect(`${frontendUrl}/auth/error?message=Falha na autenticação`);
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }
}