import { Inject } from '@nestjs/common';
import { LoggerConstants } from './logger.constants';

export const InjectLogger = (): ReturnType<typeof Inject> => Inject(LoggerConstants.logger);
export const InjectLoggerBase = (): ReturnType<typeof Inject> => Inject(LoggerConstants.loggerBase);
export const InjectLoggerOpts = (): ReturnType<typeof Inject> => Inject(LoggerConstants.options);
