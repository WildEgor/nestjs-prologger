import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import {
  ILoggerModuleOptions,
} from '../../infrastructure/interfaces/logger.interfaces';

export interface ILoggerConfigFactory {
  createLoggerConfig(): Promise<ILoggerModuleOptions> | ILoggerModuleOptions;
}

export interface ILoggerAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting: Type<ILoggerConfigFactory>;
}

