import { CLS_ID, ClsService } from 'nestjs-cls';
import { Injectable } from '@nestjs/common';
import { IContextRepository } from './context.interfaces';

@Injectable()
export class ContextRepository implements IContextRepository {

  constructor(private readonly cls: ClsService) {
  }

  public get<T>(key: string): T | undefined {
    return this.cls.get(key);
  }

  public setContextId(id: string): void {
    this.cls.set(CLS_ID, id);
  }

  public getContextId(): string {
    return this.cls.getId();
  }

  public set<T>(key: string, value: T): void {
    this.cls.set(key, value);
  }

}
