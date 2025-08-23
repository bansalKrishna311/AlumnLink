// security.middleware.js - Security Headers and Protection
import helmet from 'helmet';
import compression from 'compression';

// Security headers configuration
export const securityHeaders = helmet({
  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: false, // Disable for better compatibility
  
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https:", "ws:", "wss:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "https:"],
      frameSrc: ["'self'", "https:"]
    }
  },
  
  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },
  
  // Frame Options
  frameguard: { action: 'deny' },
  
  // Hide Powered By
  hidePoweredBy: true,
  
  // HSTS (HTTP Strict Transport Security)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  
  // IE No Open
  ieNoOpen: true,
  
  // No Sniff
  noSniff: true,
  
  // Origin Agent Cluster
  originAgentCluster: true,
  
  // Permitted Cross Domain Policies
  permittedCrossDomainPolicies: false,
  
  // Referrer Policy
  referrerPolicy: { policy: ["no-referrer"] },
  
  // X-XSS-Protection
  xssFilter: true
});

// Compression middleware
export const compressionMiddleware = compression({
  level: 6, // Compression level (0-9)
  threshold: 1024, // Only compress responses larger than 1kb
  filter: (req, res) => {
    // Don't compress if the request has a cache-control: no-transform directive
    if (req.headers['cache-control'] && req.headers['cache-control'].includes('no-transform')) {
      return false;
    }
    
    // Use the default filter function
    return compression.filter(req, res);
  }
});

// Custom security middleware
export const customSecurity = (req, res, next) => {
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Prevent caching of sensitive data
  if (req.path.includes('/api/v1/auth') || req.path.includes('/api/v1/admin')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  
  // Add API versioning header
  res.setHeader('X-API-Version', '1.0');
  
  // Add response time tracking
  res.setHeader('X-Response-Time', `${Date.now() - req.startTime}ms`);
  
  next();
};

// Request timing middleware
export const requestTiming = (req, res, next) => {
  req.startTime = Date.now();
  next();
};

// IP address validation and blocking
export const ipValidation = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Block known malicious IPs (you can maintain a blacklist)
  const blockedIPs = [
    // Add malicious IPs here
  ];
  
  if (blockedIPs.includes(clientIP)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
      code: 'IP_BLOCKED'
    });
  }
  
  // Log suspicious patterns
  const userAgent = req.get('User-Agent') || '';
  const suspiciousPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  
  if (isSuspicious && !req.path.includes('/health')) {
    console.warn(`[SECURITY] Suspicious request from ${clientIP}: ${userAgent}`);
  }
  
  next();
};

// Request size limiting
export const requestSizeLimit = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length']);
  const maxSize = 50 * 1024 * 1024; // 50MB limit
  
  if (contentLength > maxSize) {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large',
      code: 'REQUEST_TOO_LARGE',
      maxSize: '50MB'
    });
  }
  
  next();
};

// CORS security enhancement
export const corsSecurityEnhancement = (req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://alumnlink.com',
    'https://www.alumnlink.com',
    process.env.CLIENT_URL
  ].filter(Boolean);
  
  // Only allow requests from known origins in production
  if (process.env.NODE_ENV === 'production' && origin && !allowedOrigins.includes(origin)) {
    console.warn(`[SECURITY] Blocked request from unauthorized origin: ${origin}`);
    return res.status(403).json({
      success: false,
      message: 'Origin not allowed',
      code: 'ORIGIN_NOT_ALLOWED'
    });
  }
  
  next();
};

// Method validation
export const methodValidation = (req, res, next) => {
  const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
  
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED',
      allowed: allowedMethods
    });
  }
  
  next();
};

// Request logging for security monitoring
export const securityLogging = (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer'),
    userId: req.user?.id || 'anonymous'
  };
  
  // Log all authentication attempts
  if (req.path.includes('/auth/')) {
    console.log('[AUTH]', JSON.stringify(logData));
  }
  
  // Log admin access
  if (req.path.includes('/admin/')) {
    console.log('[ADMIN]', JSON.stringify(logData));
  }
  
  // Log file uploads
  if (req.method === 'POST' && req.headers['content-type']?.includes('multipart/form-data')) {
    console.log('[UPLOAD]', JSON.stringify(logData));
  }
  
  next();
};

// Honeypot middleware to catch bots
export const honeypot = (req, res, next) => {
  // Check for common bot patterns
  const userAgent = req.get('User-Agent') || '';
  const botPatterns = [
    /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i,
    /baiduspider/i, /yandexbot/i, /facebookexternalhit/i
  ];
  
  const isKnownBot = botPatterns.some(pattern => pattern.test(userAgent));
  
  // Allow known legitimate bots to access specific endpoints
  if (isKnownBot && (req.path === '/health' || req.path === '/robots.txt')) {
    return next();
  }
  
  // Block bots from accessing API endpoints
  if (isKnownBot && req.path.startsWith('/api/')) {
    return res.status(403).json({
      success: false,
      message: 'Bot access not allowed',
      code: 'BOT_ACCESS_DENIED'
    });
  }
  
  next();
};

// Content-Type validation
export const contentTypeValidation = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    
    if (!contentType) {
      return res.status(400).json({
        success: false,
        message: 'Content-Type header is required',
        code: 'MISSING_CONTENT_TYPE'
      });
    }
    
    const allowedTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data'
    ];
    
    const isValidContentType = allowedTypes.some(type => 
      contentType.toLowerCase().includes(type)
    );
    
    if (!isValidContentType) {
      return res.status(415).json({
        success: false,
        message: 'Unsupported Media Type',
        code: 'UNSUPPORTED_MEDIA_TYPE',
        supportedTypes: allowedTypes
      });
    }
  }
  
  next();
};
