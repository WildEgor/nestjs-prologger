import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerConstants } from '@wildegor/nestjs-prologger/modules/modules/logger/logger.constants';
import { LoggerAdapter } from '@wildegor/nestjs-prologger/modules/modules/logger/logger.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: , // TODO
  });

  const logger = app.get<LoggerAdapter>(LoggerConstants.logger);

  logger.log('TEST');

  await app.listen(3000);
}
bootstrap();
