import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  // Prefixo global
  app.setGlobalPrefix('api');

  // Uploads estáticos
  app.useStaticAssets(
    join(__dirname, '..', 'uploads'),
    {
      prefix: '/uploads',
    },
  );

  // Cors para angular
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://127.0.0.1:4200',
    ],
    credentials: true,
  });

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = Number(
    process.env.PORT || 3001,
  );

  await app.listen(port, '0.0.0.0');

  console.log(
    `Campus Market API rodando em http://localhost:${port}/api`,
  );
}

bootstrap();