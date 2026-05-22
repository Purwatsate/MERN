export interface AppError extends Error {
  status?: number;
  code?: string;
  detail?: string;
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof Error;
}
