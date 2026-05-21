import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';

import { ProductsModule } from './products/products.module';

@Module({
  imports: [AuthModule, ProductsModule, PrismaModule],
})
export class AppModule {}