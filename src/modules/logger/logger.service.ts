import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { InjectLoggerBase, InjectLoggerOpts } from './logger.decorators';
import {
  ILoggerModuleOptions,
  ILoggerPort,
  ILogPayload,
  LogLevel,
} from '../../infrastructure/interfaces/logger.interfaces';
import { IContextRepository } from '../context';
import { InjectContextRepository } from '../context/context.decorators';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements ILoggerPort {

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
    // Set the source class from the parent class
    this._source = parentClass?.constructor?.name;
    this._configs = configs;
    this._logger = logger;
    this._contextRepository = contextRepository;
  }

  public startProfile(id: string): void {
    this._logger.startProfile(id);
  }

  public setLogLevels(levels?: LogLevel[]): void {
    this._logger.setLogLevels(levels);
  }

  public verbose(message: string | Error, data?: ILogPayload | undefined, profile?: string | undefined): void {
    this._logger.verbose(message, this._extractLogPayload(data), profile);
  }

  public debug(message: string, data?: ILogPayload, profile?: string): void {
    return this._logger.debug(message, this._extractLogPayload(data), profile);
  }

  public info(message: string, data?: ILogPayload, profile?: string): void {
    return this._logger.info(message, this._extractLogPayload(data), profile);
  }

  public warn(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this._logger.warn(message, this._extractLogPayload(data), profile);
  }

  public error(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this._logger.error(message, this._extractLogPayload(data), profile);
  }

  public emergency(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this._logger.emergency(message, this._extractLogPayload(data), profile);
  }

  public fatal(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this._logger.fatal(message, this._extractLogPayload(data), profile);
  }

  public log(
    level: LogLevel,
    message: string | Error,
    data?: ILogPayload,
    profile?: string,
  ): void {
    return this._logger.log(level, message, this._extractLogPayload(data), profile);
  }

  private _extractLogPayload(data?: ILogPayload): ILogPayload {
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
