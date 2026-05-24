import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');
  const webOrigin = configService.getOrThrow<string>('WEB_ORIGIN');

  app.enableCors({
    origin: webOrigin,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Verdict API')
    .setDescription('OpenAPI documentation for the Verdict backend.')
    .setVersion('1.0.0')
    .addTag('health', 'Service health checks')
    .addTag('tmdb', 'TMDB provider endpoints')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    jsonDocumentUrl: 'api/docs/openapi.json',
  });
  app.getHttpAdapter().get('/api/docs-json', (_request, response) => {
    response.type('application/json');
    return response.send(JSON.stringify(swaggerDocument));
  });

  await app.listen(port);
}

void bootstrap();
