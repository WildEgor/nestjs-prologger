import { ClsModule } from 'nestjs-cls';
import { Global, Module } from '@nestjs/common';
import { v4 } from 'uuid';
import { ContextConstants } from './context.constants';
import { ContextRepository } from './context.repository';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        // TODO: debug with gql context
        idGenerator: (req: any) => {
          const header = req?.headers['x-correlation-id'] || req?.ctx?.headers['x-correlation-id'] || req?.ctx?.req?.headers['x-correlation-id'];

          if (!header?.length) {
            return v4();
          }

          return header;
        },
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: ContextConstants.contextRepository,
      useClass: ContextRepository,
    },
  ],
  exports: [ContextConstants.contextRepository],
})
export class ContextModule {
}
