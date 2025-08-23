// logger.js - Professional Logging System
import fs from 'fs';
import path from 'path';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor() {
    this.level = process.env.LOG_LEVEL === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;
    this.enableConsole = process.env.NODE_ENV !== 'production';
    this.enableFile = true;
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaString}`;
  }

  writeToFile(level, message, meta) {
    if (!this.enableFile) return;

    const logMessage = this.formatMessage(level, message, meta);
    const fileName = `${level.toLowerCase()}.log`;
    const filePath = path.join(logsDir, fileName);

    // Also write to general log
    const generalPath = path.join(logsDir, 'general.log');

    try {
      fs.appendFileSync(filePath, logMessage + '\n');
      fs.appendFileSync(generalPath, logMessage + '\n');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }

  log(level, message, meta = {}) {
    const levelValue = LOG_LEVELS[level];
    
    if (levelValue > this.level) return;

    // Console output (development only)
    if (this.enableConsole) {
      const emoji = {
        ERROR: '❌',
        WARN: '⚠️',
        INFO: 'ℹ️',
        DEBUG: '🐛'
      };
      
      const color = {
        ERROR: '\x1b[31m',  // Red
        WARN: '\x1b[33m',   // Yellow
        INFO: '\x1b[36m',   // Cyan
        DEBUG: '\x1b[35m'   // Magenta
      };
      
      const reset = '\x1b[0m';
      console.log(`${emoji[level]} ${color[level]}${message}${reset}`, meta);
    }

    // File output
    this.writeToFile(level, message, meta);
  }

  error(message, meta = {}) {
    this.log('ERROR', message, meta);
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }

  // Database operation logging
  database(operation, duration, success = true, meta = {}) {
    const level = success ? 'INFO' : 'ERROR';
    const status = success ? 'SUCCESS' : 'FAILED';
    this.log(level, `DB ${operation} ${status} (${duration}ms)`, meta);
  }

  // Authentication logging
  auth(action, userId, success = true, meta = {}) {
    const level = success ? 'INFO' : 'WARN';
    const status = success ? 'SUCCESS' : 'FAILED';
    this.log(level, `AUTH ${action} ${status}`, { userId, ...meta });
  }

  // API request logging
  request(method, path, statusCode, duration, userId = null) {
    const level = statusCode >= 400 ? 'WARN' : 'INFO';
    this.log(level, `${method} ${path} ${statusCode} (${duration}ms)`, { userId });
  }

  // Security event logging
  security(event, severity = 'MEDIUM', meta = {}) {
    const level = severity === 'HIGH' ? 'ERROR' : 'WARN';
    this.log(level, `SECURITY ${event}`, { severity, ...meta });
  }

  // Performance logging
  performance(operation, duration, threshold = 1000) {
    const level = duration > threshold ? 'WARN' : 'INFO';
    const status = duration > threshold ? 'SLOW' : 'NORMAL';
    this.log(level, `PERF ${operation} ${status} (${duration}ms)`, { threshold });
  }

  // Upload logging
  upload(fileName, size, duration, success = true, meta = {}) {
    const level = success ? 'INFO' : 'ERROR';
    const status = success ? 'SUCCESS' : 'FAILED';
    this.log(level, `UPLOAD ${fileName} ${status} (${size} bytes, ${duration}ms)`, meta);
  }

  // MongoDB keep-alive logging
  keepAlive(pingTime, success = true) {
    if (success && pingTime < 1000) {
      // Only log successful pings if they're slow or it's been a while
      return;
    }
    
    const level = success ? 'INFO' : 'WARN';
    const status = success ? 'SUCCESS' : 'FAILED';
    this.log(level, `KEEPALIVE ${status} (${pingTime}ms)`);
  }

  // Clean up old log files
  cleanup(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days
    try {
      const files = fs.readdirSync(logsDir);
      const now = Date.now();

      files.forEach(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          this.info(`Cleaned up old log file: ${file}`);
        }
      });
    } catch (err) {
      this.error('Failed to cleanup log files', { error: err.message });
    }
  }
}

// Create singleton logger instance
const logger = new Logger();

// Middleware to log HTTP requests
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Override res.end to capture response details
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    const userId = req.user?.id || req.user?._id;
    
    logger.request(req.method, req.path, res.statusCode, duration, userId);
    
    originalEnd.apply(this, args);
  };
  
  next();
};

// Performance monitoring wrapper
export const performanceLogger = (operation) => {
  return async (fn, ...args) => {
    const startTime = Date.now();
    
    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      logger.performance(operation, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`${operation} failed`, { duration, error: error.message });
      throw error;
    }
  };
};

// Replace console.log in production
if (process.env.NODE_ENV === 'production') {
  console.log = (...args) => logger.info(args.join(' '));
  console.error = (...args) => logger.error(args.join(' '));
  console.warn = (...args) => logger.warn(args.join(' '));
}

export default logger;
