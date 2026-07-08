import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dns from 'dns';

dns.setDefaultResultOrder('ipv4first'); // Força o Node.js a priorizar IPv4 para evitar erro ENETUNREACH no Render

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. PRIMEIRO: Define o prefixo global da API para que o NestJS mapeie as rotas
  app.setGlobalPrefix('api');

  // 2. SEGUNDO: Ativa o CORS com as rotas já devidamente prefixadas
  const frontendUrl = process.env.FRONTEND_URL;
  const allowedOrigins = ['http://localhost:4200'];
  if (frontendUrl) {
    allowedOrigins.push(frontendUrl);
    if (frontendUrl.endsWith('/')) {
      allowedOrigins.push(frontendUrl.slice(0, -1));
    } else {
      allowedOrigins.push(`${frontendUrl}/`);
    }
  }

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization', // Permite o cabeçalho do Token!
  });

  // 3. TERCEIRO: Ativa as validações globais de DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 4. QUARTO: Inicia o servidor na porta dinâmica (Render exige isso)
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
// Trigger reload for Redis container connection