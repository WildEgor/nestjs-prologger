import { Global, Module } from '@nestjs/common';
import { LoggerConfig } from './logger.config';

@Global()
@Module({
  providers: [LoggerConfig],
  exports: [LoggerConfig],
})
export class ConfigModule {}
