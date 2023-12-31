import { ClsModule } from 'nestjs-cls';
import { v4 } from 'uuid';
import { ContextConstants } from './context.constants';
import { ContextRepository } from './context.repository';
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        // TODO: debug with gql context
        idGenerator: (req: any) => {
          const header = req?.headers['x-correlation-id'] || req?.ctx?.req?.headers['x-correlation-id'] || req?.ctx?.headers['x-correlation-id'];

          if (!header?.length) {
            return v4();
          }

          return header;
        },
      },
    }),
  ],
  providers: [
    {
      provide: ContextConstants.contextRepository,
      useClass: ContextRepository,
    },
  ],
  exports: [
    {
      provide: ContextConstants.contextRepository,
      useClass: ContextRepository,
    },
  ],
})
export class ContextModule {
}
