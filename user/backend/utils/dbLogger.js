// Enhanced logging utility for database operations
import fs from 'fs';
import path from 'path';

class DatabaseLogger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  log(level, message, extra = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...extra
    };

    // Console log
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, extra);

    // File log
    const logFile = path.join(this.logDir, 'database.log');
    const logLine = JSON.stringify(logEntry) + '\n';
    
    try {
      fs.appendFileSync(logFile, logLine);
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }

  info(message, extra = {}) {
    this.log('info', message, extra);
  }

  warn(message, extra = {}) {
    this.log('warn', message, extra);
  }

  error(message, extra = {}) {
    this.log('error', message, extra);
  }

  debug(message, extra = {}) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, extra);
    }
  }
}

const dbLogger = new DatabaseLogger();
export default dbLogger;
