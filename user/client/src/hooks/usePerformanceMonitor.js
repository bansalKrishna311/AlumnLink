import { useEffect, useState } from 'react';

// Performance monitoring hook
export const usePerformanceMonitor = (componentName) => {
  const [renderCount, setRenderCount] = useState(0);
  const [renderTime, setRenderTime] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    setRenderCount(prev => prev + 1);
    
    const endTime = performance.now();
    setRenderTime(endTime - startTime);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} - Render #${renderCount + 1} took ${endTime - startTime}ms`);
    }
  });

  return { renderCount, renderTime };
};

// Memory usage monitor
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if (performance.memory) {
        setMemoryInfo({
          usedJSMemory: Math.round(performance.memory.usedJSMemory / 1048576), // MB
          totalJSMemory: Math.round(performance.memory.totalJSMemory / 1048576), // MB
          jsMemoryLimit: Math.round(performance.memory.jsMemoryLimit / 1048576), // MB
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// Bundle size monitor
export const useBundleAnalyzer = () => {
  const [bundleInfo, setBundleInfo] = useState({
    loadTime: 0,
    resourcesLoaded: 0,
    totalSize: 0
  });

  useEffect(() => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    const resources = performance.getEntriesByType('resource');
    const totalSize = resources.reduce((total, resource) => {
      return total + (resource.transferSize || 0);
    }, 0);

    setBundleInfo({
      loadTime,
      resourcesLoaded: resources.length,
      totalSize: Math.round(totalSize / 1024) // KB
    });
  }, []);

  return bundleInfo;
};

// Component to display performance metrics in development
export const PerformanceDebugger = ({ enabled = process.env.NODE_ENV === 'development' }) => {
  const memoryInfo = useMemoryMonitor();
  const bundleInfo = useBundleAnalyzer();

  if (!enabled || !memoryInfo) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '200px'
    }}>
      <div><strong>Performance Monitor</strong></div>
      <div>Memory: {memoryInfo.usedJSMemory}MB / {memoryInfo.totalJSMemory}MB</div>
      <div>Bundle: {bundleInfo.totalSize}KB</div>
      <div>Load Time: {bundleInfo.loadTime}ms</div>
      <div>Resources: {bundleInfo.resourcesLoaded}</div>
    </div>
  );
};
