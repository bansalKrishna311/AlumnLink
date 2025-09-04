import React from 'react';

// Performance optimization utilities

// Throttle function for limiting function calls
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization utility for expensive calculations
export const memoize = (fn, getKey) => {
  const cache = new Map();
  
  return (...args) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Prevent memory leaks by limiting cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
};

// Image optimization utilities
export const getOptimizedImageUrl = (url, width = 400, quality = 80) => {
  if (!url) return '/placeholder.jpg';
  
  // If it's already optimized or a placeholder, return as is
  if (url.includes('placeholder') || url.includes('w_')) {
    return url;
  }
  
  // For Cloudinary URLs, add optimization parameters
  if (url.includes('cloudinary')) {
    return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
  }
  
  return url;
};

// Bundle splitting utility
export const lazyLoadComponent = (importFunc, fallback = null) => {
  return React.lazy(() => 
    importFunc().catch(() => ({
      default: () => fallback || <div>Failed to load component</div>
    }))
  );
};

// Memory cleanup utilities
export const cleanupEventListeners = (element, events) => {
  events.forEach(({ event, handler }) => {
    element.removeEventListener(event, handler);
  });
};

export const cleanupTimers = (timers) => {
  timers.forEach(timer => {
    if (timer) {
      clearTimeout(timer);
      clearInterval(timer);
    }
  });
};

// Network optimization
export const createAbortController = () => {
  const controller = new AbortController();
  return {
    controller,
    signal: controller.signal,
    abort: () => controller.abort()
  };
};

// Local storage with expiration
export const setLocalStorageWithExpiry = (key, value, ttl) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getLocalStorageWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  
  const item = JSON.parse(itemStr);
  const now = new Date();
  
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  
  return item.value;
};

// Performance measurement
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
    
    return result;
  };
};

// Resource preloading
export const preloadResource = (href, as = 'script', crossorigin = null) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) link.crossOrigin = crossorigin;
  document.head.appendChild(link);
};

// Critical resource hints
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const domains = ['api.alumnlink.com', 'cdn.alumnlink.com'];
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
  
  // Preconnect to critical origins
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = '//api.alumnlink.com';
  document.head.appendChild(link);
};

// Worker utilities for heavy computations
export const createWorker = (fn) => {
  const blob = new Blob([`(${fn.toString()})()`], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};

// Error boundary utility
export const withErrorBoundary = (Component, fallback) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
    
    componentDidCatch(error, errorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    render() {
      if (this.state.hasError) {
        return fallback || <div>Something went wrong.</div>;
      }
      
      return <Component {...this.props} />;
    }
  };
};
