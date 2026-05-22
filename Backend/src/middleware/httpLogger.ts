import expressWinston from 'express-winston';
import { logger } from '../config/logger';

/** Compact one-line HTTP access log (no headers / JWT in output). */
export const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: false,
  msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
  expressFormat: false,
  colorize: false,
  ignoreRoute: (req) => req.url === '/health',
});

/** Compact error log line from Express `next(err)`. */
export const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
  meta: false,
  msg: '{{err.message}} — {{req.method}} {{req.originalUrl}}',
});
