import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogLevels } from '@wildegor/nestjs-prologger/modules/infrastructure/interfaces/logger.interfaces';
import { LoggerAdapter } from '@wildegor/nestjs-prologger/modules/modules/logger/logger.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get<LoggerAdapter>(LoggerAdapter);
  logger.setLogLevels([
    LogLevels.Debug,
    LogLevels.Log,
    LogLevels.Warn,
    LogLevels.Verbose,
    LogLevels.Error,
  ]);

  app.useLogger(logger);

  logger.error('Error message');

  await app.listen(3001);
}
bootstrap();
