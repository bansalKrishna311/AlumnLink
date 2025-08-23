// errorHandler.middleware.js - Centralized Error Handling
import mongoose from 'mongoose';

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error handler wrapper
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// MongoDB error handlers
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400, 'INVALID_ID');
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
  return new AppError(message, 400, 'DUPLICATE_FIELD');
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again', 401, 'INVALID_TOKEN');
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again', 401, 'TOKEN_EXPIRED');
};

const handleMongoNetworkError = () => {
  return new AppError('Database connection failed. Please try again later', 503, 'DB_CONNECTION_ERROR');
};

// Send error response in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: {
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      stack: err.stack,
      details: err
    },
    timestamp: new Date().toISOString()
  });
};

// Send error response in production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      timestamp: new Date().toISOString()
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR:', err);
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      code: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString()
    });
  }
};

// Main error handling middleware
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  
  // Log error for monitoring
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${err.message}`);
  
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    
    // Handle specific error types
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (err.name === 'MongoNetworkError') error = handleMongoNetworkError();
    
    sendErrorProd(error, res);
  }
};

// 404 handler for unmatched routes
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Can't find ${req.originalUrl} on this server`, 404, 'ROUTE_NOT_FOUND');
  next(error);
};

// Specific error creators
export const createValidationError = (message) => {
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

export const createAuthError = (message = 'Authentication failed') => {
  return new AppError(message, 401, 'AUTH_ERROR');
};

export const createForbiddenError = (message = 'Access forbidden') => {
  return new AppError(message, 403, 'FORBIDDEN');
};

export const createNotFoundError = (resource = 'Resource') => {
  return new AppError(`${resource} not found`, 404, 'NOT_FOUND');
};

export const createServerError = (message = 'Internal server error') => {
  return new AppError(message, 500, 'SERVER_ERROR');
};

// Database error handler
export const handleDatabaseError = (error, operation = 'Database operation') => {
  console.error(`${operation} failed:`, error);
  
  if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
    return new AppError('Database connection timeout. Please try again', 503, 'DB_TIMEOUT');
  }
  
  if (error.name === 'MongoServerSelectionError') {
    return new AppError('Database server unavailable. Please try again later', 503, 'DB_UNAVAILABLE');
  }
  
  if (error.code === 11000) {
    return handleDuplicateFieldsDB(error);
  }
  
  if (error.name === 'ValidationError') {
    return handleValidationErrorDB(error);
  }
  
  if (error.name === 'CastError') {
    return handleCastErrorDB(error);
  }
  
  return new AppError('Database operation failed', 500, 'DB_ERROR');
};

// Request timeout handler
export const requestTimeout = (timeout = 30000) => {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      const error = new AppError('Request timeout', 408, 'REQUEST_TIMEOUT');
      next(error);
    }, timeout);
    
    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));
    
    next();
  };
};

// Unhandled rejection handler
process.on('unhandledRejection', (err, promise) => {
  console.error('UNHANDLED REJECTION:', err.message);
  console.error('Promise:', promise);
  
  // Close server gracefully
  if (global.server) {
    global.server.close(() => {
      console.log('Server closed due to unhandled rejection');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message);
  console.error('Stack:', err.stack);
  
  console.log('Shutting down due to uncaught exception');
  process.exit(1);
});
