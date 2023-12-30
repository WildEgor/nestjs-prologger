import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectContextRepository } from '../context/context.decorators';
import { IContextRepository } from '../context';
import { correlationIdHeader } from './logger.constants';

@Injectable()
export class LoggerCorrelationIDToHeaderInterceptor implements NestInterceptor {

  constructor(
    @InjectContextRepository() private readonly context: IContextRepository,
    // eslint-disable-next-line no-empty-function
  ) {
  }

  intercept(context: ExecutionContext, $call: CallHandler): Observable<unknown> {
    const header = this.context.getContextId();

    if (context.getType() === 'http') {
      const res = context.switchToHttp()
        .getResponse();

      res?.header(correlationIdHeader, header);
    }

    return $call.handle();
  }

}
