import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectLogger } from '@wildegor/nestjs-prologger/modules/modules/logger/logger.decorators';
import { ILoggerPort } from '@wildegor/nestjs-prologger/modules/infrastructure/interfaces/logger.interfaces';
import { Span } from 'nestjs-otel';

@Controller()
export class AppController {
  constructor(
    @InjectLogger()
    private readonly logger: ILoggerPort,
    private readonly appService: AppService,
  ) {}

  @Span('CRITICAL_SECTION')
  @Get()
  test(): string {
    this.logger.warn('Calling test()', {
      props: {
        foo: 'bar',
      },
    });

    return this.appService.getHello();
  }
}
