import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { SellerModule } from './seller/seller.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      envFilePath: '.env' 
    }),
    
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        if (redisUrl) {
          try {
            const url = new URL(redisUrl);
            const redisOptions: any = {
              host: url.hostname,
              port: parseInt(url.port || '6379'),
              username: url.username || undefined,
              password: url.password || undefined,
              enableOfflineQueue: true,
              maxRetriesPerRequest: null, // Necessário para compatibilidade com Bull
            };
            if (url.protocol === 'rediss:') {
              redisOptions.tls = {};
            }
            return {
              redis: redisOptions,
            };
          } catch (error) {
            return {
              redis: redisUrl,
            };
          }
        }

        return {
          redis: {
            host: configService.get<string>('REDIS_HOST') || 'localhost',
            port: parseInt(configService.get<string>('REDIS_PORT') || '6379'),
            password: configService.get<string>('REDIS_PASSWORD') || undefined,
            enableOfflineQueue: true,
            maxRetriesPerRequest: null, // Necessário para compatibilidade com Bull
          },
        };
      },
      inject: [ConfigService],
    }),
    
    PrismaModule,
    AuthModule,
    UploadModule,
    MailModule,

    UsersModule,
    SellerModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    AddressModule,
  ],
})
export class AppModule {}