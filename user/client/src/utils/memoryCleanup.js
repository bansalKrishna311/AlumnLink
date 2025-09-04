import { useEffect, useRef } from 'react';

/**
 * Memory cleanup utilities for React components
 */

// Hook for automatic cleanup on component unmount
export const useMemoryCleanup = (cleanupFunctions = []) => {
  const cleanupRef = useRef(cleanupFunctions);
  
  // Update cleanup functions
  cleanupRef.current = cleanupFunctions;
  
  useEffect(() => {
    return () => {
      cleanupRef.current.forEach(cleanupFn => {
        if (typeof cleanupFn === 'function') {
          try {
            cleanupFn();
          } catch (error) {
            console.warn('Cleanup function failed:', error);
          }
        }
      });
    };
  }, []);
};

// Hook for monitoring component memory usage
export const useMemoryMonitor = (componentName = 'Component') => {
  const startMemory = useRef(null);
  const maxMemory = useRef(0);
  
  useEffect(() => {
    if (performance.memory) {
      startMemory.current = performance.memory.usedJSMemory;
    }
    
    const checkMemory = () => {
      if (performance.memory) {
        const currentMemory = performance.memory.usedJSMemory;
        maxMemory.current = Math.max(maxMemory.current, currentMemory);
      }
    };
    
    const interval = setInterval(checkMemory, 5000); // Check every 5 seconds
    
    return () => {
      clearInterval(interval);
      
      if (performance.memory && startMemory.current) {
        const endMemory = performance.memory.usedJSMemory;
        const memoryDiff = endMemory - startMemory.current;
        const maxMemoryDiff = maxMemory.current - startMemory.current;
        
        console.log(`Memory usage for ${componentName}:`, {
          startMemory: Math.round(startMemory.current / 1024 / 1024) + 'MB',
          endMemory: Math.round(endMemory / 1024 / 1024) + 'MB',
          memoryDiff: Math.round(memoryDiff / 1024 / 1024) + 'MB',
          maxMemoryUsed: Math.round(maxMemoryDiff / 1024 / 1024) + 'MB',
        });
      }
    };
  }, [componentName]);
};

// Hook for cleaning up large objects and arrays
export const useLargeObjectCleanup = () => {
  const objectsRef = useRef(new Set());
  
  const registerObject = (obj) => {
    objectsRef.current.add(obj);
  };
  
  const cleanup = () => {
    objectsRef.current.forEach(obj => {
      if (Array.isArray(obj)) {
        obj.length = 0; // Clear array
      } else if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          delete obj[key]; // Clear object properties
        });
      }
    });
    objectsRef.current.clear();
  };
  
  useEffect(() => {
    return cleanup;
  }, []);
  
  return { registerObject, cleanup };
};

// Utility function for safe DOM cleanup
export const cleanupDOMElements = (elements = []) => {
  elements.forEach(element => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
};

// Utility function for cleaning up event listeners
export const cleanupEventListeners = (listeners = []) => {
  listeners.forEach(({ target, event, handler, options }) => {
    if (target && typeof target.removeEventListener === 'function') {
      target.removeEventListener(event, handler, options);
    }
  });
};

// Utility function for cleaning up timers
export const cleanupTimers = (timers = []) => {
  timers.forEach(timer => {
    if (timer.type === 'timeout') {
      clearTimeout(timer.id);
    } else if (timer.type === 'interval') {
      clearInterval(timer.id);
    }
  });
};

// Utility for revoking object URLs
export const cleanupObjectURLs = (urls = []) => {
  urls.forEach(url => {
    if (typeof url === 'string' && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
};

// Comprehensive cleanup hook
export const useComprehensiveCleanup = () => {
  const timersRef = useRef([]);
  const listenersRef = useRef([]);
  const urlsRef = useRef([]);
  const elementsRef = useRef([]);
  
  const addTimer = (id, type = 'timeout') => {
    timersRef.current.push({ id, type });
  };
  
  const addListener = (target, event, handler, options) => {
    listenersRef.current.push({ target, event, handler, options });
  };
  
  const addURL = (url) => {
    urlsRef.current.push(url);
  };
  
  const addElement = (element) => {
    elementsRef.current.push(element);
  };
  
  useEffect(() => {
    return () => {
      cleanupTimers(timersRef.current);
      cleanupEventListeners(listenersRef.current);
      cleanupObjectURLs(urlsRef.current);
      cleanupDOMElements(elementsRef.current);
    };
  }, []);
  
  return {
    addTimer,
    addListener,
    addURL,
    addElement,
  };
};

export default {
  useMemoryCleanup,
  useMemoryMonitor,
  useLargeObjectCleanup,
  useComprehensiveCleanup,
  cleanupDOMElements,
  cleanupEventListeners,
  cleanupTimers,
  cleanupObjectURLs,
};
