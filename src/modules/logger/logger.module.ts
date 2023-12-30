import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import 'winston-daily-rotate-file';
import { LoggerConstants } from './logger.constants';
import { LoggerService } from './logger.service';
import { ContextModule } from '../context';
import { WinstonModule } from '../../infrastructure/adapters/winston/winston.module';
import { ILoggerAsyncOptions, ILoggerConfigFactory } from './logger.interfaces';
import { ILoggerPort } from '../../infrastructure/interfaces/logger.interfaces';
import { LoggerAdapter } from './logger.adapter';

@Global()
@Module({
  imports: [ContextModule, WinstonModule],
})
export class LoggerModule {

  public static forRootAsync(asyncOptions: ILoggerAsyncOptions): DynamicModule {
    const LoggerOptionsProvider: Provider = {
      provide: LoggerConstants.options,
      useFactory(optionsFactory: ILoggerConfigFactory) {
        return optionsFactory.createLoggerConfig();
      },
      inject: [asyncOptions.useExisting],
    };

    const LoggerServiceProvider: Provider = {
      provide: LoggerConstants.logger,
      useClass: LoggerService,
    };

    const LoggerAdapterProvider: Provider = {
      provide: LoggerAdapter,
      useFactory: (logger: ILoggerPort) => new LoggerAdapter(logger),
      inject: [LoggerConstants.logger],
    };

    return {
      module: LoggerModule,
      imports: asyncOptions.imports,
      providers: [
        LoggerOptionsProvider,
        LoggerServiceProvider,
        LoggerAdapterProvider,
      ],
      exports: [
        LoggerAdapterProvider,
        LoggerServiceProvider,
      ],
    };
  }

}
