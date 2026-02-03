export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  error?: unknown;
}

class LoggerService {
  private isDevelopment: boolean = __DEV__;

  private log(entry: LogEntry): void {
    if (!this.isDevelopment && entry.level === LogLevel.DEBUG) {
      return; // Skip debug logs in production
    }

    const timestamp = entry.timestamp.toISOString();
    const contextStr = entry.context ? ` | ${JSON.stringify(entry.context)}` : '';
    const errorStr = entry.error ? ` | Error: ${JSON.stringify(entry.error)}` : '';

    const logMessage = `[${timestamp}] [${entry.level}] ${entry.message}${contextStr}${errorStr}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
      case LogLevel.INFO:
        console.log(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.ERROR:
        console.error(logMessage);
        break;
    }
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    this.log({
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date(),
      context,
    });
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.log({
      level: LogLevel.INFO,
      message,
      timestamp: new Date(),
      context,
    });
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    this.log({
      level: LogLevel.WARN,
      message,
      timestamp: new Date(),
      context,
    });
  }

  public error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    this.log({
      level: LogLevel.ERROR,
      message,
      timestamp: new Date(),
      context,
      error,
    });
  }
}

export const logger = new LoggerService();
