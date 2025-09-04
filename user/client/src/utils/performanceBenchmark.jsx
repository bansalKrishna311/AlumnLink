import { useState, useEffect } from 'react';

/**
 * Performance benchmarking utilities
 */

export const usePerformanceBenchmark = (componentName) => {
  const [benchmarks, setBenchmarks] = useState({
    mountTime: 0,
    updateTime: 0,
    renderCount: 0,
    averageRenderTime: 0,
  });

  const startTimeRef = useState(() => performance.now())[0];
  const lastUpdateRef = useState(() => performance.now())[0];
  const renderTimesRef = useState(() => [])[0];

  useEffect(() => {
    // Component mount benchmark
    const mountTime = performance.now() - startTimeRef;
    setBenchmarks(prev => ({ ...prev, mountTime }));

    return () => {
      // Component unmount benchmark
      const totalTime = performance.now() - startTimeRef;
      console.log(`📊 ${componentName} Performance:`, {
        totalLifetime: Math.round(totalTime),
        mountTime: Math.round(mountTime),
        renderCount: renderTimesRef.length,
        averageRenderTime: renderTimesRef.length > 0 
          ? Math.round(renderTimesRef.reduce((a, b) => a + b, 0) / renderTimesRef.length)
          : 0,
      });
    };
  }, [componentName, startTimeRef, renderTimesRef]);

  useEffect(() => {
    // Update benchmark
    const updateTime = performance.now() - lastUpdateRef;
    renderTimesRef.push(updateTime);
    
    setBenchmarks(prev => ({
      ...prev,
      updateTime,
      renderCount: prev.renderCount + 1,
      averageRenderTime: renderTimesRef.reduce((a, b) => a + b, 0) / renderTimesRef.length,
    }));
  });

  return benchmarks;
};

export const measureAsyncOperation = async (operation, name) => {
  const start = performance.now();
  try {
    const result = await operation();
    const duration = performance.now() - start;
    console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
    return { result, duration };
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
};

export const measureRenderPerformance = (Component, props = {}) => {
  return (wrappedProps) => {
    const start = performance.now();
    
    useEffect(() => {
      const renderTime = performance.now() - start;
      console.log(`🎨 ${Component.name || 'Component'} render: ${renderTime.toFixed(2)}ms`);
    });

    return <Component {...props} {...wrappedProps} />;
  };
};

// Network performance utilities
export const measureNetworkRequest = async (requestFn, description) => {
  const start = performance.now();
  const requestStart = performance.mark?.('request-start');
  
  try {
    const result = await requestFn();
    const duration = performance.now() - start;
    
    performance.mark?.('request-end');
    performance.measure?.('request-duration', 'request-start', 'request-end');
    
    console.log(`🌐 ${description}: ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`🌐 ${description} failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
};

// Memory performance utilities
export const measureMemoryUsage = (operation, description) => {
  const initialMemory = performance.memory?.usedJSMemory || 0;
  
  const result = operation();
  
  setTimeout(() => {
    const finalMemory = performance.memory?.usedJSMemory || 0;
    const memoryDiff = finalMemory - initialMemory;
    console.log(`💾 ${description} memory impact: ${(memoryDiff / 1024).toFixed(2)}KB`);
  }, 0);
  
  return result;
};

// Virtual scrolling performance test
export const testVirtualScrollPerformance = (itemCount = 10000) => {
  const start = performance.now();
  
  // Simulate virtual scrolling calculations
  const itemHeight = 120;
  const containerHeight = 600;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const overscan = 5;
  
  // Calculate visible range
  for (let scrollTop = 0; scrollTop < itemCount * itemHeight; scrollTop += itemHeight) {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(itemCount - 1, startIndex + visibleCount + overscan * 2);
    
    // Simulate rendering visible items
    for (let i = startIndex; i <= endIndex; i++) {
      // Simulate item render
    }
  }
  
  const duration = performance.now() - start;
  console.log(`📜 Virtual scroll simulation (${itemCount} items): ${duration.toFixed(2)}ms`);
  
  return {
    itemCount,
    duration,
    itemsPerMs: itemCount / duration,
  };
};

// Overall app performance score
export const calculatePerformanceScore = () => {
  const metrics = {
    fps: 60, // Will be updated by real-time monitor
    memory: performance.memory?.usedJSMemory || 0,
    loadTime: 0,
    networkRequests: 0,
  };

  // Calculate scores (0-100)
  const fpsScore = Math.min(100, (metrics.fps / 60) * 100);
  const memoryScore = performance.memory 
    ? Math.max(0, 100 - ((metrics.memory / performance.memory.jsMemoryLimit) * 100))
    : 100;
  const loadTimeScore = Math.max(0, 100 - (metrics.loadTime / 5000) * 100); // 5s = 0 score
  
  const overallScore = (fpsScore + memoryScore + loadTimeScore) / 3;
  
  return {
    overall: Math.round(overallScore),
    fps: Math.round(fpsScore),
    memory: Math.round(memoryScore),
    loadTime: Math.round(loadTimeScore),
    grade: overallScore >= 90 ? 'A+' : 
           overallScore >= 80 ? 'A' : 
           overallScore >= 70 ? 'B' : 
           overallScore >= 60 ? 'C' : 'D',
  };
};

export default {
  usePerformanceBenchmark,
  measureAsyncOperation,
  measureRenderPerformance,
  measureNetworkRequest,
  measureMemoryUsage,
  testVirtualScrollPerformance,
  calculatePerformanceScore,
};
