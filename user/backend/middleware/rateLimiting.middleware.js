// rateLimiting.middleware.js - Rate Limiting and Security
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000),
      limit: req.rateLimit.limit,
      current: req.rateLimit.current
    });
  }
});

// Strict rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutes'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts from this IP, please try again later',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Password reset rate limiting
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later',
    code: 'PASSWORD_RESET_LIMIT_EXCEEDED',
    retryAfter: '1 hour'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many password reset attempts from this IP, please try again later',
      code: 'PASSWORD_RESET_LIMIT_EXCEEDED',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// File upload rate limiting
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 uploads per windowMs
  message: {
    success: false,
    message: 'Too many upload attempts, please try again later',
    code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutes'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many upload attempts from this IP, please try again later',
      code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Admin endpoints rate limiting
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 admin requests per windowMs
  message: {
    success: false,
    message: 'Too many admin requests, please try again later',
    code: 'ADMIN_RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutes'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many admin requests from this IP, please try again later',
      code: 'ADMIN_RATE_LIMIT_EXCEEDED',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Speed limiter to slow down repeated requests
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per windowMs at full speed
  delayMs: () => 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
  validate: { delayMs: false } // Disable the warning message
});

// Create custom rate limiter
export const createRateLimiter = (options = {}) => {
  const defaults = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
      success: false,
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false
  };

  return rateLimit({ ...defaults, ...options });
};

// Skip rate limiting for certain conditions
export const skipRateLimit = (req) => {
  // Skip rate limiting for health checks
  if (req.path === '/health' || req.path === '/health/db') {
    return true;
  }
  
  // Skip for admin users (implement based on your auth logic)
  if (req.user && req.user.role === 'superadmin') {
    return true;
  }
  
  // Skip for localhost in development
  if (process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1') {
    return true;
  }
  
  return false;
};

// Flexible rate limiter with custom skip logic
export const flexibleLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: skipRateLimit,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// DDoS protection - very strict limits
export const ddosProtection = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Very strict: 30 requests per minute
  message: {
    success: false,
    message: 'Suspected DDoS attack. Access temporarily blocked',
    code: 'DDOS_PROTECTION_TRIGGERED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`[SECURITY] Potential DDoS from IP: ${req.ip} at ${new Date().toISOString()}`);
    res.status(429).json({
      success: false,
      message: 'Suspected malicious activity. Access temporarily blocked',
      code: 'DDOS_PROTECTION_TRIGGERED',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Burst protection for sudden spikes
export const burstProtection = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute max
  message: {
    success: false,
    message: 'Request burst detected. Please slow down',
    code: 'BURST_LIMIT_EXCEEDED'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests in a short time. Please slow down',
      code: 'BURST_LIMIT_EXCEEDED',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});
