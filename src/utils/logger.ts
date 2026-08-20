/**
 * Enterprise structured logging and telemetry tracker for TDM Nexus
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: unknown;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private buffer: LogEntry[] = [];
  private readonly maxBufferSize = 100;

  private createEntry(level: LogLevel, context: string, message: string, data?: unknown, error?: Error | unknown): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      data,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error ? {
        name: 'UnknownError',
        message: String(error),
      } : undefined,
    };

    this.buffer.push(entry);
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }

    return entry;
  }

  debug(context: string, message: string, data?: unknown): LogEntry {
    const entry = this.createEntry('debug', context, message, data);
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${entry.timestamp}] [DEBUG] [${context}] ${message}`, data ?? '');
    }
    return entry;
  }

  info(context: string, message: string, data?: unknown): LogEntry {
    const entry = this.createEntry('info', context, message, data);
    console.info(`[${entry.timestamp}] [INFO] [${context}] ${message}`, data ?? '');
    return entry;
  }

  warn(context: string, message: string, data?: unknown): LogEntry {
    const entry = this.createEntry('warn', context, message, data);
    console.warn(`[${entry.timestamp}] [WARN] [${context}] ${message}`, data ?? '');
    return entry;
  }

  error(context: string, message: string, error?: Error | unknown, data?: unknown): LogEntry {
    const entry = this.createEntry('error', context, message, data, error);
    console.error(`[${entry.timestamp}] [ERROR] [${context}] ${message}`, error ?? '', data ?? '');
    return entry;
  }

  getRecentLogs(): ReadonlyArray<LogEntry> {
    return [...this.buffer];
  }

  clearLogs(): void {
    this.buffer = [];
  }
}

export const logger = new Logger();
