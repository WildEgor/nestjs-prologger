import { ConsoleLogger, Injectable } from '@nestjs/common';
import { LoggerService } from '@nestjs/common/services/logger.service';
import { ILoggerPort, ILogPayload, LogLevel } from '../../infrastructure/interfaces/logger.interfaces';

@Injectable()
export class LoggerAdapter
  extends ConsoleLogger
  implements LoggerService {

  public constructor(private logger: ILoggerPort) {
    super();
  }

  public setLogLevels(levels: LogLevel[]): void {
    this.logger.setLogLevels(levels);
  }

  public log(message: any, ...optionalParams: any[]): void {
    return this.logger.info(message, this.getLogData(optionalParams));
  }

  public error(message: any, ...optionalParams: any[]): void {
    return this.logger.error(message, this.getLogData(optionalParams));
  }

  public warn(message: any, ...optionalParams: any[]): void {
    return this.logger.warn(message, this.getLogData(optionalParams));
  }

  public debug(message: any, ...optionalParams: any[]): void {
    return this.logger.debug(message, this.getLogData(optionalParams));
  }

  public verbose(message: any, ...optionalParams: any[]): void {
    return this.logger.verbose(message, this.getLogData(optionalParams));
  }

  private getLogData(...optionalParams: any[]): ILogPayload {
    const source = optionalParams[0]?.length ? optionalParams[0] : this.context;
    return {
      source,
    };
  }

}
