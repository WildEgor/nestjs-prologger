export type ResolveHandler = <T>(messages: T[]) => void;

// TODO: drain messages if limit is reached can prevent memory licks
export class MessageCollector<T> {

  private readonly _MAX_MESSAGES = 100;
  private readonly _messages: T[];
  private readonly _timeout: number;
  private _timeoutId: NodeJS.Timeout | null = null;
  private _resolveHandler: ResolveHandler | null = null;

  constructor(timeout = 1000) {
    this._messages = [];
    this._timeout = timeout;
  }

  public cache(message: T): void {
    this._messages.push(message);

    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId);
    }

    if (this._messages.length === this._MAX_MESSAGES) {
      this._clear();
    }

    this._timeoutId = setTimeout(() => {
      this._clear();
    }, this._timeout);
  }

  private _clear(): void {
    if (this._resolveHandler !== null && this._messages.length) {
      this._resolveHandler(this._messages);
    }

    this._messages.length = 0;
    this._timeoutId = null;
  }

  public onResolve(handler: ResolveHandler): void {
    this._resolveHandler = handler;
  }

}
