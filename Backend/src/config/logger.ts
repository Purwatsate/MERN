import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logsDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const isDev = process.env.NODE_ENV !== 'production';
const logLevel = process.env.LOG_LEVEL || (isDev ? 'debug' : 'info');

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, service: _s, ...meta } = info;
    const msg = String(message ?? '');

    // HTTP access lines: message only (no meta blob)
    if (/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) /.test(msg)) {
      return `${timestamp} [${level}]: ${msg}`;
    }

    const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level}]: ${msg}${rest}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: logLevel,
  defaultMeta: { service: 'police-database-api' },
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5_242_880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
          const { timestamp, level, message, service, ...rest } = info;
          const entry: Record<string, unknown> = {
            time: timestamp,
            level,
            message,
            service,
          };
          if (Object.keys(rest).length > 0) {
            entry.extra = rest;
          }
          return JSON.stringify(entry);
        })
      ),
      maxsize: 5_242_880,
      maxFiles: 5,
    }),
  ],
});

export default logger;
