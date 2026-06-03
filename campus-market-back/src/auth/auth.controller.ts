import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google')
  async googleLogin(
    @Body('token') token: string,
  ) {
    const payload =
      await this.authService.verifyGoogleToken(
        token,
      );

    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  }
}