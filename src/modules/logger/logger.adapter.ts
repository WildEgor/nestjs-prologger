import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { LoggerService } from '@nestjs/common/services/logger.service';
import {
  ILoggerModuleOptions,
  ILoggerPort,
  ILogPayload,
  LogLevel,
} from '../../infrastructure/interfaces/logger.interfaces';
import { InjectLoggerBase, InjectLoggerOpts } from './logger.decorators';
import { INQUIRER } from '@nestjs/core';
import { InjectContextRepository } from '../context/context.decorators';
import { IContextRepository } from '../context';

@Injectable()
export class LoggerAdapter
  extends ConsoleLogger
  implements LoggerService {

  private readonly _source: string;
  private readonly _logger: ILoggerPort;
  private readonly _configs: ILoggerModuleOptions;
  private readonly _contextRepository: IContextRepository;

  constructor(
    @Inject(INQUIRER) parentClass: object,
    @InjectLoggerOpts()
      configs: ILoggerModuleOptions,
    @InjectLoggerBase()
      logger: ILoggerPort,
    @InjectContextRepository()
      contextRepository: IContextRepository,
  ) {
    super()
    // Set the source class from the parent class
    this._source = parentClass?.constructor?.name;
    this._configs = configs;
    this._logger = logger;
    this._contextRepository = contextRepository;
  }

  public setLogLevels(levels: LogLevel[]): void {
    this._logger.setLogLevels(levels);
  }

  public log(message: any, ...optionalParams: any[]): void {
    return this._logger.info(message, this.getLogData(optionalParams));
  }

  public error(message: any, ...optionalParams: any[]): void {
    return this._logger.error(message, this.getLogData(optionalParams));
  }

  public warn(message: any, ...optionalParams: any[]): void {
    return this._logger.warn(message, this.getLogData(optionalParams));
  }

  public debug(message: any, ...optionalParams: any[]): void {
    return this._logger.debug(message, this.getLogData(optionalParams));
  }

  public verbose(message: any, ...optionalParams: any[]): void {
    return this._logger.verbose(message, this.getLogData(optionalParams));
  }

  private getLogData(...optionalParams: any[]): ILogPayload {
    const data = optionalParams?.[0]?.length ? optionalParams[0][0] : {};

    return {
      ...data,
      organization: data?.organization || this._configs?.opts?.meta?.organization || '',
      context: data?.context || this._configs?.opts?.meta?.context || '',
      app: data?.app || this._configs?.opts?.meta?.app || '',
      source: data?.source || this._source,
      correlationId:
        data?.correlationId || this._contextRepository.getContextId(),
    };
  }

}
