import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogLevels } from '@wildegor/nestjs-prologger/modules/infrastructure/interfaces/logger.interfaces';
// import { LoggerAdapter } from '@wildegor/nestjs-prologger/modules/modules/logger/logger.adapter';
// import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from '@wildegor/nestjs-prologger/modules/modules/logger/logger.service';
import { LoggerConstants } from '@wildegor/nestjs-prologger/modules/modules/logger/logger.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = await app.resolve<LoggerService>(LoggerConstants.logger);
  logger.setLogLevels([
    LogLevels.Debug,
    LogLevels.Log,
    LogLevels.Warn,
    LogLevels.Verbose,
    LogLevels.Error,
  ]);

  app.useLogger(logger);

  await app.listen(3001);
}
bootstrap();
