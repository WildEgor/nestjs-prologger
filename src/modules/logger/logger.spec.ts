import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { LoggerModule } from './logger.module';
import { LoggerAdapter } from './logger.adapter';
import { ILoggerPort, LogLevels } from '../../infrastructure/interfaces/logger.interfaces';
import { LoggerConstants } from './logger.constants';
import winston from 'winston';

describe('Logger Unit Tests', () => {
  let logger: LoggerAdapter | undefined;
  let adapter: ILoggerPort | undefined;

  beforeEach(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          opts: {
            hideTrace: false,
            meta: {
              organization: 'Example LLC',
              context: 'example-context',
              app: 'example-service',
            },
            console: {
              format: 'json',
            },
          }
        })
      ],
      providers: [
        LoggerModule.forTransports({
          transports: [new winston.transports.File({
            // lazy: true,
            filename: 'app.log'
          })],
        }),
      ]
    }).compile();

    logger = moduleRef.get<LoggerAdapter>(LoggerAdapter);
    logger?.setLogLevels([LogLevels.Log, LogLevels.Debug])
    adapter = moduleRef.get<ILoggerPort>(LoggerConstants.loggerBase);
  })

  it('LoggerAdapter should be defined', () => {
    expect(logger).toBeDefined();
  });


  it('LoggerAdapter should log', () => {
    // @ts-ignore
    const logSpy = jest.spyOn(adapter, 'debug');

    logger?.debug("Example Message", {
      source: 'ExampleService',
      event_name: "example_executed",
      props: {
        user_id: "123"
      }
    });

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy.mock.calls[0][0]).toEqual('Example Message');
    expect(logger).toBeDefined();
    logSpy.mockRestore();
  });
})
