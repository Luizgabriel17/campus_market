import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({
      session: false,
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'campus-market-secret',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService],

  exports: [AuthService],
})
export class AuthModule {}