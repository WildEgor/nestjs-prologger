import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from '@wildegor/nestjs-prologger';
import { ConfigModule } from './infrastructure/configs/config.module';
import { LoggerConfig } from './infrastructure/configs/logger.config';
import { OpenTelemetryModule } from 'nestjs-otel';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: LoggerConfig,
    }),
    OpenTelemetryModule.forRoot({
      metrics: {
        hostMetrics: true, // Includes Host Metrics
        apiMetrics: {
          enable: true, // Includes api metrics
          defaultAttributes: {
            // You can set default labels for api metrics
            custom: 'label',
          },
          ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
          ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
