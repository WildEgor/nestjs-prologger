import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { LoggerConstants } from './logger.constants';
import { LoggerService } from './logger.service';
import { ContextModule } from '../context';
import {
  ILoggerAsyncOptions,
  ILoggerConfigFactory,
} from './logger.interfaces';
import {
  ILoggerModuleOptions,
} from '../../infrastructure/interfaces/logger.interfaces';
import { LoggerAdapter } from './logger.adapter';
import { WinstonConstants } from '../../infrastructure/adapters/winston/winston.constants';
import { ConsoleTransport } from '../../infrastructure/adapters/winston/transports';
import { WinstonAdapter } from '../../infrastructure/adapters/winston';

@Global()
@Module({
  imports: [ContextModule],
})
export class LoggerModule {

  public static forRoot(options: ILoggerModuleOptions): DynamicModule {
    const LoggerOptionsProvider: Provider = {
      provide: LoggerConstants.options,
      useValue: options,
    };

    const WinstonAdapterProvider: Provider = {
      provide: LoggerConstants.loggerBase,
      useClass: WinstonAdapter,
    };

    const WinstonTransportsProvider: Provider = {
      provide: WinstonConstants.winstonTransports,
      useFactory: (opts: ILoggerModuleOptions) => {
        const transports: unknown[] = [];
        transports.push(ConsoleTransport.create(opts?.opts?.console));

        if (opts?.transports) {
          transports.push(...opts.transports);
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
      useClass: LoggerAdapter,
    };

    return {
      module: LoggerModule,
      providers: [
        WinstonTransportsProvider,
        WinstonAdapterProvider,
        LoggerOptionsProvider,
        LoggerServiceProvider,
        LoggerAdapterProvider,
      ],
      exports: [
        LoggerAdapterProvider,
        LoggerServiceProvider,
        LoggerOptionsProvider,
      ],
    };
  }

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
        const transports: unknown[] = [];
        transports.push(ConsoleTransport.create(opts?.opts?.console));

        if (opts?.transports) {
          transports.push(...opts.transports);
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
      useClass: LoggerAdapter,
    };

    return {
      module: LoggerModule,
      imports: asyncOptions.imports,
      providers: [
        WinstonTransportsProvider,
        WinstonAdapterProvider,
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
