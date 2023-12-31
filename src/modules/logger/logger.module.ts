import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import 'winston-daily-rotate-file';
import { LoggerConstants } from './logger.constants';
import { LoggerService } from './logger.service';
import { ContextModule } from '../context';
import { ILoggerAsyncOptions, ILoggerConfigFactory } from './logger.interfaces';
import { ILoggerModuleOptions, ILoggerPort } from '../../infrastructure/interfaces/logger.interfaces';
import { LoggerAdapter } from './logger.adapter';
import { WinstonConstants } from '../../infrastructure/adapters/winston/winston.constants';
import { ConsoleTransport, FileTransport, TelegramTransport } from '../../infrastructure/adapters/winston/transports';
import { WinstonAdapter } from '../../infrastructure/adapters/winston';
import Transport from 'winston-transport';

@Global()
@Module({
  imports: [ContextModule],
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

    const WinstonAdapterProvider: Provider = {
      provide: LoggerConstants.loggerBase,
      useClass: WinstonAdapter,
    };

    const WinstonTransportsProvider: Provider = {
      provide: WinstonConstants.winstonTransports,
      useFactory: (opts: ILoggerModuleOptions) => {
        const transports: Transport[] = [];
        transports.push(ConsoleTransport.create());

        if (opts.opts.file) {
          transports.push(FileTransport.create(opts.opts.file));
        }

        if (opts.opts.telegram) {
          transports.push(TelegramTransport.create(opts.opts.telegram));
        }

        return transports;
      },
      inject: [LoggerConstants.options],
    }

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
        WinstonAdapterProvider,
        WinstonTransportsProvider,
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
