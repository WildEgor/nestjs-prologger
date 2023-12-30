import axios, { AxiosError } from 'axios';
import { ITelegramRequestPayload, ITelegramSender } from './telegram.interfaces';

export class TelegramSender implements ITelegramSender {

  private readonly _baseUrl: string = 'https://api.telegram.org';
  private readonly _defaultParseMode = 'Markdown';

  public async send(token: string, payload: ITelegramRequestPayload): Promise<boolean> {
    try {
      const requestBody = {
        text: payload.text,
        chat_id: payload.chat_id,
        disable_notification: payload.disable_notification,
        parse_mode: this._defaultParseMode,
      };

      if (payload.parse_mode) {
        requestBody.parse_mode = payload.parse_mode;
      }

      await axios.post(`${this._baseUrl}/bot${token}/sendMessage`, requestBody);

      return true;
    }
    catch (e: unknown) {
      if (e instanceof AxiosError) {
        console.error(e.response?.data);
      }
      else if (e instanceof Error) {
        console.error(e.message);
      }
    }

    return false;
  }

}
