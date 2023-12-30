export interface ITelegramRequestPayload {
  chat_id: string;
  text: string;
  disable_notification?: boolean;
  parse_mode?: string;
}

export interface ITelegramSender {
  send(token: string, payload: ITelegramRequestPayload): Promise<boolean>;
}
