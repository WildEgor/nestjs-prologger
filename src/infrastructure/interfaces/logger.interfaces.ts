export interface IConsoleTransportOpts {
  format: 'json' | 'pretty';
}

export interface ILoggerMetaOptions {
  organization?: string;
  context?: string;
  app?: string;
}

export interface ILoggerOptions {
  hideTrace?: boolean;
  meta?: ILoggerMetaOptions;
  console?: IConsoleTransportOpts;
}

export interface ILoggerModuleOptions {
  opts: ILoggerOptions;
  transports?: unknown[];
}

export enum LogLevels {
  Silent = 'silent',
  Debug = 'debug',
  Verbose = 'verbose',
  Log = 'log',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Emergency = 'emergency',
}

export type LogLevel = LogLevels | string;

export enum LogColors {
  red = '\x1b[31m',
  bgRed = '\x1b[41m\x1b[30m',
  green = '\x1b[32m',
  yellow = '\x1b[33m',
  blue = '\x1b[34m',
  magenta = '\x1b[35m',
  cyan = '\x1b[36m',
  black = '\x1b',
  pink = '\x1b[38;5;206m',
}

export interface ILogPayload {
  correlationId?: string;
  organization?: string;
  context?: string;
  label?: string;
  app?: string;
  source?: string;
  error?: Error;
  props?: NodeJS.Dict<unknown>;
}

export interface ILoggerPort {

  /**
   * @description Toggle profile for logger. Adds some additional information to the log.
   * @param id
   */
  startProfile(id: string): void;

  /**
   * @description Set log levels. If no levels are provided, all levels are set. If levels are provided, only those levels are set. If empty array is provided, no levels are set.
   * @param levels
   */
  setLogLevels(levels?: LogLevel[]): void;

  /**
   * @description Base log a message
   * @param level
   * @param message
   * @param data
   * @param profile
   */
  print(
    level: LogLevel,
    message: string | Error,
    data?: ILogPayload,
    profile?: string,
  ): void;

  /**
   * @description Log a message with level `log`
   * @param message
   * @param data
   * @param profile
   */
  log(
    message: string | Error,
    data?: ILogPayload,
    profile?: string,
  ): void;

  /**
   * @description Log a message with level `debug` and color `blue`
   * @param message
   * @param data
   * @param profile
   */
  debug(message: string, data?: ILogPayload, profile?: string): void;

  /**
   * @description Log a message with level `info` and color `green`
   * @param message
   * @param data
   * @param profile
   */
  info(message: string, data?: ILogPayload, profile?: string): void;

  /**
   * @description Log a message with level `warn` and color `yellow`
   * @param message
   * @param data
   * @param profile
   */
  warn(message: string | Error, data?: ILogPayload, profile?: string): void;

  /**
   * @description Log a message with level `error` and color `red`
   * @param message
   * @param data
   * @param profile
   */
  error(message: string | Error, data?: ILogPayload, profile?: string): void;

  /**
   * @description Log a message with level `verbose` and color `cyan`
   * @param message
   * @param data
   * @param profile
   */
  verbose(message: string | Error, data?: ILogPayload, profile?: string): void;

  /**
   * @description Log a message with level `emergency` and color `bgRed`
   * @param message
   * @param data
   * @param profile
   */
  emergency(message: string | Error, data?: ILogPayload, profile?: string): void;

  /**
   * @description Log a message with level `fatal` and color `bgRed`
   * @param message
   * @param data
   * @param profile
   */
  fatal(message: string | Error, data?: ILogPayload, profile?: string): void;

}
