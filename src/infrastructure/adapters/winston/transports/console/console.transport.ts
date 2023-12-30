import * as winston from 'winston';
import { LogColors, LogLevels } from '../../../../interfaces/logger.interfaces';

export class ConsoleTransport {

  public static create(): winston.transports.ConsoleTransportInstance {
    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf((log) => {
          const color = this._mapLogLevelColor(log.level as LogLevels);

          const prefix = `${log?.data?.label ? `[${log.data.label}]` : ''}`;

          return `${this._colorize(color, `${prefix}  -`)} ${log.timestamp}    ${
            log?.data?.correlationId
              ? `(${this._colorize(LogColors.cyan, log.data.correlationId)})`
              : ''
          } ${this._colorize(color, log.level.toUpperCase())} ${
            log?.data?.source
              ? `${this._colorize(LogColors.cyan, `[${log.data.source}]`)}`
              : ''
          } ${this._colorize(
            color,
            `${log.message} - ${log.data.error ? log.data.error : ''}`,
          )}${
            typeof log?.data?.durationMs !== 'undefined'
              ? this._colorize(color, ` +${log.data.durationMs}ms`)
              : ''
          }${
            log?.data?.stack ? this._colorize(color, `  - ${log.data.stack}`) : ''
          }${
            log?.data?.props
              ? `\n  - Props: ${JSON.stringify(log.data.props, null, 4)}`
              : ''
          }`;
        }),
      ),
    });
  }

  private static _colorize(color: LogColors, message: string): string {
    return `${color}${message}\x1b[0m`;
  }

  private static _mapLogLevelColor(level: LogLevels): LogColors {
    switch (level) {
      case LogLevels.Debug:
        return LogColors.blue;
      case LogLevels.Info:
        return LogColors.green;
      case LogLevels.Warn:
        return LogColors.yellow;
      case LogLevels.Error:
        return LogColors.red;
      case LogLevels.Verbose:
        return LogColors.pink;
      case LogLevels.Emergency:
        return LogColors.bgRed;
      case LogLevels.Silent:
        return LogColors.black;
      default:
        return LogColors.cyan;
    }
  }

}
