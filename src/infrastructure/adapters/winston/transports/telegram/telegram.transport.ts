import Transport from 'winston-transport';
import {
  FormatOptionsFn, ILog,
  ITelegramFormatOptions,
  ITelegramTransportOpts,
  LogLevels,
} from '../../../../interfaces/logger.interfaces';
import { MessageCollector } from '../utils';
import { TelegramSender } from './telegram.sender';

export class TelegramTransport extends Transport {

  private readonly _MAX_MESSAGE_LENGTH = 4096;
  private readonly _token: string;
  private readonly _chatId: string;
  private readonly _parseMode: string;
  private readonly _lvls: Set<LogLevels>;
  private readonly _disableNotification: boolean;
  private readonly _template: string;
  private readonly _formatMessage?: FormatOptionsFn;
  private readonly _batchingDelay: number;
  private readonly _batchingSeparator: string;
  private readonly _sender: TelegramSender;
  private readonly _messageCollector: MessageCollector<string>;

  constructor(options: ITelegramTransportOpts) {
    super(options);

    if (!options.token?.length) {
      throw new Error('You should provide token for Telegram transport');
    }

    if (!options.chatId?.length) {
      throw new Error('You should provide chatId for Telegram transport');
    }

    if (options.formatMessage && typeof options.formatMessage !== 'function') {
      throw new Error('\'formatMessage\' property should be function for Telegram transport');
    }

    this.handleExceptions = options.handleExceptions ?? true;
    this.silent = options.silent || false;

    this._token = options.token;
    this._chatId = options.chatId;
    this._parseMode = options.parseMode || 'Markdown';
    this._lvls = new Set(options.levels || []);
    this._disableNotification = options.disableNotification || false;
    this._template = options.template || `**{level}: [{context}]**
    **Message:** [{message}]`;
    this._formatMessage = options.formatMessage;
    this._batchingDelay = options.batchingDelay || 0;
    this._batchingSeparator = options.batchingSeparator || '\n\n';
    this._messageCollector = new MessageCollector<string>(options.batchingDelay);
    this._sender = new TelegramSender();

    this._messageCollector.onResolve(<T>(messages: T[]) => {
      this.send(messages.join(this._batchingSeparator))
        .catch(console.error);
    });
  }

  public static create(opts: ITelegramTransportOpts): TelegramTransport {
    return new TelegramTransport(opts);
  }

  log(info: ILog, next: () => void): void {
    if (!this.silent && this._lvls.has(info.level)) {
      const formatOptions: ITelegramFormatOptions = {
        context: `${info?.data?.organization}.${info?.data?.context}.${info?.data?.app}`,
        timestamp: info.timestamp || new Date().toISOString(),
        level: info.level?.toUpperCase() as LogLevels,
        message: info.message,
        metadata: info.data || {},
      };

      let messageText = '';
      if (this._formatMessage) {
        messageText = this._formatMessage(formatOptions, info);
      }
      else {
        messageText = this._format(this._template, formatOptions);
      }

      if (this._batchingDelay) {
        this._messageCollector.cache(messageText);
      }
      else {
        this.send(messageText)
          .catch(console.error);
      }
    }

    next();
  }

  private async send(text: string): Promise<void> {
    if (text.length < this._MAX_MESSAGE_LENGTH) {
      await this._sender.send(this._token, {
        chat_id: this._chatId,
        text,
        disable_notification: this._disableNotification,
        parse_mode: this._parseMode,
      });
    }
    else {
      const size = Math.ceil(text.length / this._MAX_MESSAGE_LENGTH);
      let offset = 0;

      for (let i = 0; i < size; i += 1) {
        await this._sender.send(this._token, {
          chat_id: this._chatId,
          text: text.substring(offset, this._MAX_MESSAGE_LENGTH),
          disable_notification: this._disableNotification,
          parse_mode: this._parseMode,
        });

        offset += this._MAX_MESSAGE_LENGTH;
      }
    }
  }

  private _format(string: string, data: object): string {
    return Object.entries(data)
      .reduce((res, [key, value]) => {
        const search = `{${key}}`;

        if (
          res.indexOf(search) !== -1 &&
          res.indexOf(`\\${key}`) === -1 && // Escaped on start
          res.indexOf(`${key}\\`) === -1 // Escaped on end
        ) {
          return res.replace(search, value);
        }

        return res;
      }, string);
  }

}
