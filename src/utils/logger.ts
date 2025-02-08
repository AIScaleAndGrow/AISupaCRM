type LogLevel = 'info' | 'warn' | 'error';

class Logger {
  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = {
      timestamp,
      level,
      message,
      ...(data && { data }),
    };

    switch (level) {
      case 'info':
        console.log(JSON.stringify(logMessage, null, 2));
        break;
      case 'warn':
        console.warn(JSON.stringify(logMessage, null, 2));
        break;
      case 'error':
        console.error(JSON.stringify(logMessage, null, 2));
        break;
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }
}

export const logger = new Logger();
