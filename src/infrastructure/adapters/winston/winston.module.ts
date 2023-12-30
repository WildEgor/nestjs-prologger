import { Global, Module, Provider } from '@nestjs/common';
import Transport from 'winston-transport';
import { LoggerConstants } from '../../../modules/logger/logger.constants';
import { ILoggerModuleOptions } from '../../interfaces/logger.interfaces';
import { ConsoleTransport, FileTransport, TelegramTransport } from './transports';
import { WinstonAdapter } from './winston.adapter';
import { WinstonConstants } from './winston.constants';

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
};

const WinstonAdapterProvider: Provider = {
  provide: LoggerConstants.loggerBase,
  useClass: WinstonAdapter,
};

@Global()
@Module({
  providers: [
    WinstonAdapterProvider,
    WinstonTransportsProvider
  ],
  exports: [
    WinstonAdapterProvider,
    WinstonTransportsProvider
  ]
})
export class WinstonModule {
}
