import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { IsInt, IsString, Length, IsEmail } from 'class-validator';

class VerifyEmailDto {
  @IsInt()
  userId: number;

  @IsString()
  @Length(6, 6)
  code: string;
}

class ResendCodeDto {
  @IsInt()
  userId: number;
}

class ForgotPasswordDto {
  @IsString()
  @IsEmail()
  email: string;
}

class ResetPasswordDto {
  @IsInt()
  userId: number;

  @IsString()
  @Length(6, 6)
  code: string;

  @IsString()
  @Length(6, 100)
  newPassword: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('verify-email')
  verifyEmail(@Body() body: VerifyEmailDto) {
    return this.authService.verifyEmail(body.userId, body.code);
  }

  @Post('resend-code')
  resendCode(@Body() body: ResendCodeDto) {
    return this.authService.resendVerificationCode(body.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.userId);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.userId, body.code, body.newPassword);
  }
}