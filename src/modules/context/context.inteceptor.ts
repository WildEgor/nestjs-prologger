import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectContextRepository } from './context.decorators';
import { CorrelationIdHeader, IContextRepository } from './index';

@Injectable()
export class LoggerCorrelationIdInterceptor implements NestInterceptor {

  private readonly context: IContextRepository;

  constructor(
    @InjectContextRepository()
      context: IContextRepository,
  ) {
    this.context = context;
  }

  public intercept(context: ExecutionContext, $call: CallHandler): Observable<unknown> {
    const header = this.context.getContextId();

    if (context.getType() === 'http') {
      // TODO: add support for express/fastify
      const res = context.switchToHttp()
        .getResponse();

      res?.header(CorrelationIdHeader, header);
    }

    return $call.handle();
  }

}
