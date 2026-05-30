import {ConfigType} from '@nestjs/config';
import {Logger, ValidationPipe} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {appEnv} from "./core/env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
      logger: new Logger(),
  });
  const bootstrapLog = new Logger('bootstrap');
  const appConfig = app.get<ConfigType<typeof appEnv>>(appEnv.KEY);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest Project API')
    .setDescription('Nest Project API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(appConfig.port, () => {
      bootstrapLog.log(`App listening on port ${appConfig.port}`);
  });
}

bootstrap();
