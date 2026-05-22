import { Request, Response, NextFunction } from 'express';
import { isAppError } from '../types/errors';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);

  if (isAppError(err)) {
    if (err.code === '23505') {
      res.status(409).json({
        success: false,
        message: 'Duplicate record — unique constraint violated',
        detail: err.detail,
      });
      return;
    }

    if (err.code === '23503') {
      res.status(400).json({
        success: false,
        message: 'Invalid reference — related record not found',
        detail: err.detail,
      });
      return;
    }

    const status = err.status || 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Internal server error',
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}
