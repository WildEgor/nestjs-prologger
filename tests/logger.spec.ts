import { afterAll, afterEach, beforeAll, describe, expect, jest, test } from '@jest/globals';
import { LoggerModule } from '../modules';
import { LoggerAdapter } from '../modules/modules/logger/logger.adapter';
import { FactoryTests } from './tests.factory';

describe('LoggerModule', () => {
  const fixture = new FactoryTests();

  beforeAll(async() => {
    await fixture.init({
      imports: [
        LoggerModule.forRoot({
          opts: {
            hideTrace: false,
            meta: {},
            console: {
              format: 'pretty',
            },
          }
        }),
      ],
    });
  });

  afterAll(async() => {
    await fixture.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('Logger E2E Tests', () => {
    test('LoggerAdapter should be defined', () => {
      const adapter = fixture.application.get(LoggerAdapter);
      expect(adapter).toBeDefined();
    });


    test('LoggerAdapter should log', () => {
      const adapter = fixture.application.get(LoggerAdapter);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const logSpy = jest.spyOn(adapter, 'debug');

      adapter?.debug('Example Message', {
        source: 'ExampleService',
        event_name: 'example_executed',
        props: {
          user_id: '123'
        }
      });

      expect(logSpy).toHaveBeenCalled();
      expect(logSpy.mock.calls[0][0]).toEqual('Example Message');
      expect(adapter).toBeDefined();
      logSpy.mockRestore();
    });
  });
});
