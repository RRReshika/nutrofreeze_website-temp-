import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './common/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configuredOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const allowedOrigins = configuredOrigins.length
    ? configuredOrigins
    : ['http://localhost:5173', 'http://localhost:3000'];
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const loggerMiddleware = new LoggerMiddleware();
  app.use((req, res, next) => loggerMiddleware.use(req, res, next));
  
  await app.listen(3001);
  console.log('API running on http://localhost:3001');
}
bootstrap();
