import { afterAll, afterEach, beforeAll, describe, expect, jest, test } from '@jest/globals';
import { FactoryTests } from './tests.factory';
import { LoggerModule } from '../modules';

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

  describe('Logger', () => {
    test('Logger', () => {
      expect(true).toBeDefined();
    });
  });
});
