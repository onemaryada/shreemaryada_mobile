// Production-ready logger utility
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

class Logger {
  private level: LogLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.WARN;

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatLog(level: string, tag: string, message: string, data?: any): string {
    const timestamp = this.getTimestamp();
    if (data) {
      return `[${timestamp}] [${level}] [${tag}] ${message} \n${JSON.stringify(data, null, 2)}`;
    }
    return `[${timestamp}] [${level}] [${tag}] ${message}`;
  }

  debug(tag: string, message: string, data?: any) {
    if (this.level <= LogLevel.DEBUG) {
      const log = this.formatLog('DEBUG', tag, message, data);
      console.log(log);
    }
  }

  info(tag: string, message: string, data?: any) {
    if (this.level <= LogLevel.INFO) {
      const log = this.formatLog('INFO', tag, message, data);
      console.log(log);
    }
  }

  warn(tag: string, message: string, data?: any) {
    if (this.level <= LogLevel.WARN) {
      const log = this.formatLog('WARN', tag, message, data);
      console.warn(log);
    }
  }

  error(tag: string, message: string, error?: Error | any) {
    if (this.level <= LogLevel.ERROR) {
      const errorData = error instanceof Error ? {
        message: error.message,
        stack: error.stack,
      } : error;
      const log = this.formatLog('ERROR', tag, message, errorData);
      console.error(log);
    }
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }
}

export const logger = new Logger();
