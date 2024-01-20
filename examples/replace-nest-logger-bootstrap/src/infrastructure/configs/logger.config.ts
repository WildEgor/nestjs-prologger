import { Injectable } from '@nestjs/common';
import {
  ILoggerModuleOptions,
  ILoggerOptions,
} from '@wildegor/nestjs-prologger/modules/infrastructure/interfaces/logger.interfaces';
import { ILoggerConfigFactory } from '@wildegor/nestjs-prologger/modules/modules/logger/logger.interfaces';
import * as winston from 'winston';

@Injectable()
export class LoggerConfig implements ILoggerConfigFactory {
  private readonly _opts: ILoggerOptions;

  constructor() {
    this._opts = {
      hideTrace: false,
      console: {
        format: 'json',
      },
      meta: {
        organization: 'NestJS ProLogger',
        context: 'service',
        app: 'example',
      },
    };
  }

  public createLoggerConfig():
    | ILoggerModuleOptions
    | Promise<ILoggerModuleOptions> {
    return {
      transports: [
        new winston.transports.File({
          filename: 'app.log',
          // level: 'error',
        }),
      ],
      opts: this._opts,
    };
  }
}
