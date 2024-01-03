import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { LogEntry, LoggerOptions } from 'winston';
import { InjectLoggerOpts } from '../../../modules/logger/logger.decorators';
import {
  ILogPayload,
  ILoggerModuleOptions,
  ILoggerPort,
  LogLevel,
  LogLevels,
} from '../../interfaces/logger.interfaces';
import { InjectWinstonTransports } from './winston.decorators';

/**
 * @description Winston wrapper act as base logger. If we decide to change the logger, we only need to impl new class
 */
@Injectable()
export class WinstonAdapter implements ILoggerPort {

  private _logLevels: Set<LogLevel>;
  private _defaultLevels: Record<LogLevel, number> = {
    debug: 0,
    verbose: 0,
    info: 0,
    warn: 0,
    error: 0,
    fatal: 0,
    emergency: 0,
  };
  private _logger: winston.Logger;

  public constructor(
  @InjectWinstonTransports()
    transports: winston.transport[],
    @InjectLoggerOpts()
    configs: ILoggerModuleOptions,
  ) {
    // Create winston logger
    this._logLevels = new Set<LogLevel>();
    this._logger = winston.createLogger(this._getLoggerFormatOptions(transports, configs));
  }

  // Setting log levels for winston
  public setLogLevels(levels?: LogLevel[]): void {
    // Disable all logs
    if (Array.isArray(levels) && 0 === levels.length) {
      return;
    }

    this._defaultLevels = {} as Record<LogLevel, number>;
    let cont = 0;

    // Set all levels
    if ('undefined' === typeof levels) {
      for (const level of Object.values(LogLevels)) {
        if (level === LogLevels.Silent) {
          continue;
        }

        if (level === LogLevels.Log) {
          this._logLevels.add(LogLevels.Info);
        }

        this._logLevels.add(level);
        this._defaultLevels[level] = cont;
        cont += 1;
      }

      return;
    }

    for (const level of levels) {
      if (level === LogLevels.Log) {
        this._logLevels.add(LogLevels.Info);
      }

      this._logLevels.add(level);
      this._defaultLevels[level] = cont;
      cont += 1;
    }
  }

  public startProfile(id: string): void {
    this._logger.profile(id, {
      level: 'debug',
    });
  }

  public verbose(message: string | Error, data?: ILogPayload | undefined, profile?: string | undefined): void {
    return this.print(LogLevels.Verbose, message, data, profile);
  }

  public debug(message: string, data?: ILogPayload, profile?: string): void {
    return this.print(LogLevels.Debug, message, data, profile);
  }

  public info(message: string, data?: ILogPayload, profile?: string): void {
    return this.print(LogLevels.Info, message, data, profile);
  }

  public warn(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this.print(LogLevels.Warn, message, data, profile);
  }

  public error(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this.print(LogLevels.Error, message, data, profile);
  }

  public emergency(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this.print(LogLevels.Emergency, message, data, profile);
  }

  public fatal(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this.print(LogLevels.Emergency, message, data, profile);
  }

  public log(
    message: string | Error,
    data?: ILogPayload,
    profile?: string,
  ): void {
    return this.print(LogLevels.Info, message, data, profile);
  }

  public print(
    level: LogLevels,
    message: string | Error,
    data?: ILogPayload,
    profile?: string,
  ): void {
    if (level === LogLevels.Silent || !this._logLevels.has(level)) {
      return;
    }

    const logData: LogEntry = {
      level,
      message: message instanceof Error ? message.message : message,
      error: message instanceof Error ? message : undefined,
      ...data,
    };

    if (profile) {
      this._logger.profile(profile, logData);
    }
    else {
      this._logger.log(logData);
    }
  }

  /**
   * @description Get logger format options
   * @param transports
   * @param opts
   * @private
   */
  private _getLoggerFormatOptions(transports: winston.transport[], opts: ILoggerModuleOptions): LoggerOptions {
    return {
      levels: this._defaultLevels,
      format: winston.format.combine(
        // Add timestamp and format the date
        winston.format.timestamp({
          format: 'DD/MM/YYYY, HH:mm:ss',
        }),
        // Errors will be logged with stack trace
        winston.format.errors({ stack: opts.opts.hideTrace || true }),
        // Add custom Log fields to the log
        winston.format(info => {
          // Info contains an Error property
          if (info.error && info.error instanceof Error) {
            info.stack = info.error.stack;
            info.error = undefined;
          }

          info.label = `${info.organization}.${info.context}.${info.app}`;

          return info;
        })(),
        // Add custom fields to the data property
        winston.format.metadata({
          key: 'data',
          fillExcept: ['timestamp', 'level', 'message'],
        }),
        // Format the log as JSON
        winston.format.json(),
      ),
      transports,
      exceptionHandlers: transports,
      rejectionHandlers: transports,
    };
  }

}
