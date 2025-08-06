import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

const todayFormat = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const winstonConfig: WinstonModuleOptions = {
  levels: winston.config.npm.levels,
  level: 'verbose',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message, context }) => {
          const msg =
            typeof message === 'object'
              ? JSON.stringify(message, null, 2)
              : message;
          return `${timestamp} [${level}]${context ? ' [' + context + ']' : ''} ${msg}`;
        }),
      ),
    }),
    new winston.transports.File({
      level: 'verbose',
      filename: `application_${todayFormat()}.log`,
      dirname: 'logs',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(), // Mantém estruturado no arquivo
      ),
    }),
  ],
};
