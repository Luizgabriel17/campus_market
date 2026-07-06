import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. PRIMEIRO: Define o prefixo global da API para que o NestJS mapeie as rotas
  app.setGlobalPrefix('api');

  // 2. SEGUNDO: Ativa o CORS com as rotas já devidamente prefixadas
  app.enableCors({
    origin: process.env.FRONTEND_URL 
      ? [process.env.FRONTEND_URL, 'http://localhost:4200'] 
      : ['http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization', // Permite o cabeçalho do Token!
  });

  // 3. TERCEIRO: Ativa as validações globais de DTO
  app.useGlobalPipes(new ValidationPipe());

  // 4. QUARTO: Inicia o servidor na porta dinâmica (Render exige isso)
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
// Trigger reload for Redis container connection