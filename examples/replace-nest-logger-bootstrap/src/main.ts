import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerAdapter } from '@wildegor/nestjs-prologger/modules/modules/logger/logger.adapter';
import { LoggerConstants } from '@wildegor/nestjs-prologger/modules/modules/logger/logger.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get<LoggerAdapter>(LoggerConstants.logger);

  app.useLogger(logger);

  logger.error('Error message');

  throw Error('Error message');

  await app.listen(3001);
}
bootstrap();
