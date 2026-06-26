import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';
import { BaseExceptionFilter } from './core/filters/base-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableShutdownHooks();
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new BaseExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Gardenia Plant Species Service')
    .setDescription('Gardenia plant species microservice')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const corsOrigins = app
    .get(ConfigService)
    .getOrThrow<string[]>('app.corsOrigins');
  app.enableCors({ origin: corsOrigins, credentials: true });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(
    `Gardenia Plant Species Service listening on http://localhost:${port}/api`,
  );
}
bootstrap().catch((error: unknown) => {
  console.error('Failed to start Gardenia Plant Species Service', error);
  process.exit(1);
});
