import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { GoogleStrategy } from './google.strategy';

import { JwtStrategy } from './jwt.strategy';

import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    PassportModule.register({
      session: false,
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET,

      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    PrismaService,
  ],

  exports: [AuthService],
})
export class AuthModule {}