import { ConsoleLogger } from '@nestjs/common';
import { LoggerService } from '@nestjs/common/services/logger.service';
import { ILoggerPort, ILogPayload } from '../../infrastructure/interfaces/logger.interfaces';

export class LoggerAdapter
  extends ConsoleLogger
  implements LoggerService {

  public constructor(private logger: ILoggerPort) {
    super();
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
    return {
      source: optionalParams[0] ? optionalParams[0] : undefined,
    };
  }

}
