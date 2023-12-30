import DailyRotateFile = require('winston-daily-rotate-file');
import { IFileTransportOpts } from '../../../../interfaces/logger.interfaces';

export class FileTransport {

  public static create(opts?: IFileTransportOpts): DailyRotateFile {
    return new DailyRotateFile({
      dirname: opts?.path || 'logs',
      filename: `${opts?.path || 'log'}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: opts?.period || '7d',
    });
  }

}
