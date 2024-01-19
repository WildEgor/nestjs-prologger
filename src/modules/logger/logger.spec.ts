import { jest, beforeEach, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { LoggerModule } from './logger.module';
import { LoggerAdapter } from './logger.adapter';
import { ILoggerPort } from '../../infrastructure/interfaces/logger.interfaces';
import { LoggerConstants } from './logger.constants';

describe('Logger', () => {
  let logger: LoggerAdapter | undefined;
  let adapter: ILoggerPort | undefined;

  beforeEach(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          opts: {
            hideTrace: false,
            meta: {},
            console: {
              format: 'pretty',
            },
          }
        })
      ],
    }).compile();

    logger = moduleRef.get<LoggerAdapter>(LoggerAdapter);
    adapter = moduleRef.get<ILoggerPort>(LoggerConstants.loggerBase);
  })

  it('LoggerAdapter should be defined', () => {
    expect(logger).toBeDefined();
  });


  it('LoggerAdapter should log', () => {
    // @ts-ignore
    const logSpy = jest.spyOn(adapter, 'info');

    logger?.log('test');

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy.mock.calls[0][0]).toEqual('test');
    expect(logger).toBeDefined();
    logSpy.mockRestore();
  });
})
