import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Add /api before every controller route, for example /api/employees.
  app.setGlobalPrefix('api');
  app.enableCors({ origin: process.env.FRONTEND_URL});
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // Read the server port from .env, or use 3000 if PORT is not set.
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}/api`);
}
bootstrap();
