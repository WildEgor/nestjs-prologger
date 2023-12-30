import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from '@wildegor/nestjs-prologger';
import { ConfigModule } from './infrastructure/configs/config.module';
import { LoggerConfig } from './infrastructure/configs/logger.config';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync({
      useExisting: LoggerConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
