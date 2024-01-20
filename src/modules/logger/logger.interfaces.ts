import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import {
  ILoggerModuleOptions,
  ILoggerTransportsModuleOptions,
} from '../../infrastructure/interfaces/logger.interfaces';

export interface ILoggerConfigFactory {
  createLoggerConfig(): Promise<ILoggerModuleOptions> | ILoggerModuleOptions;
}

export interface ILoggerAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting: Type<ILoggerConfigFactory>;
}


export interface ILoggerTransportsConfigFactory {
  createTransportsConfig(): Promise<ILoggerTransportsModuleOptions> | ILoggerTransportsModuleOptions;
}

export interface ILoggerTransportsAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting: Type<ILoggerTransportsConfigFactory>;
}
