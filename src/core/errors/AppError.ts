export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION = 'VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
  TIMEOUT = 'TIMEOUT_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  timestamp: Date;
}

export const createAppError = (
  type: ErrorType,
  message: string,
  originalError?: unknown
): AppError => ({
  type,
  message,
  originalError,
  timestamp: new Date(),
});

export const networkError = (message: string, originalError?: unknown): AppError =>
  createAppError(ErrorType.NETWORK, message, originalError);

export const notFoundError = (message: string): AppError =>
  createAppError(ErrorType.NOT_FOUND, message);

export const validationError = (message: string): AppError =>
  createAppError(ErrorType.VALIDATION, message);

export const unknownError = (message: string, originalError?: unknown): AppError =>
  createAppError(ErrorType.UNKNOWN, message, originalError);

export const timeoutError = (message: string): AppError =>
  createAppError(ErrorType.TIMEOUT, message);

export const unauthorizedError = (message: string): AppError =>
  createAppError(ErrorType.UNAUTHORIZED, message);
