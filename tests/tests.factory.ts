import { ModuleMetadata } from '@nestjs/common/interfaces';
import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { LoggerAdapter } from '../modules/modules/logger/logger.adapter';
// import { LoggerAdapter } from '../src/modules/logger/logger.adapter';

export class FactoryTests {

  private _application?: NestApplication;

  public get application(): NestApplication {
    if (!this._application) {
      throw new Error('You should run "init()" before accessing Nest Instance');
    }
    return this._application;
  }

  public async init(metadata: ModuleMetadata): Promise<void> {
    const port = 50000;

    const moduleFixture = await Test.createTestingModule(metadata).compile();

    this._application = moduleFixture.createNestApplication({
      bufferLogs: true,
    });

    // TODO: Fix this
    const logger = this._application.get<LoggerAdapter>(LoggerAdapter, { strict: false });
    this._application.useLogger(logger);

    await this.application.listen(port);
  }

  public async close(): Promise<void> {
    await this.application.close();
  }

}
