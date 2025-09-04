import React, { useState, useEffect, useRef } from 'react';

const RealTimePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: null,
    loadTime: 0,
    renderTime: 0,
    networkRequests: 0,
    cacheHitRate: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const renderStartRef = useRef(null);

  // FPS monitoring
  useEffect(() => {
    let animationId;
    
    const measureFPS = () => {
      frameCountRef.current++;
      const now = performance.now();
      
      if (now >= lastTimeRef.current + 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        setMetrics(prev => ({ ...prev, fps }));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };
    
    animationId = requestAnimationFrame(measureFPS);
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Memory monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      if (performance.memory) {
        const memory = {
          used: Math.round(performance.memory.usedJSMemory / 1048576), // MB
          total: Math.round(performance.memory.totalJSMemory / 1048576),
          limit: Math.round(performance.memory.jsMemoryLimit / 1048576),
        };
        setMetrics(prev => ({ ...prev, memory }));
      }

      // Network monitoring
      const resources = performance.getEntriesByType('resource');
      const apiRequests = resources.filter(r => 
        r.name.includes('api') || r.name.includes('localhost:4000')
      ).length;
      
      setMetrics(prev => ({ ...prev, networkRequests: apiRequests }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Page load time monitoring
  useEffect(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      const loadTime = Math.round(navigationEntry.loadEventEnd - navigationEntry.fetchStart);
      setMetrics(prev => ({ ...prev, loadTime }));
    }
  }, []);

  // Component render time monitoring
  useEffect(() => {
    renderStartRef.current = performance.now();
    
    return () => {
      if (renderStartRef.current) {
        const renderTime = performance.now() - renderStartRef.current;
        setMetrics(prev => ({ ...prev, renderTime: Math.round(renderTime) }));
      }
    };
  });

  if (process.env.NODE_ENV !== 'development') return null;

  const getPerformanceColor = (value, thresholds) => {
    if (value >= thresholds.good) return '#10b981'; // green
    if (value >= thresholds.ok) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getFPSColor = () => getPerformanceColor(metrics.fps, { good: 50, ok: 30 });
  const getMemoryColor = () => {
    if (!metrics.memory) return '#6b7280';
    const percentage = (metrics.memory.used / metrics.memory.limit) * 100;
    return getPerformanceColor(100 - percentage, { good: 70, ok: 50 });
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '11px',
        zIndex: 10001,
        maxWidth: '250px',
        fontFamily: 'monospace',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#fe6019' }}>
        ⚡ Real-Time Performance
      </div>
      
      <div style={{ display: 'grid', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>FPS:</span>
          <span style={{ color: getFPSColor(), fontWeight: 'bold' }}>
            {metrics.fps}
          </span>
        </div>
        
        {metrics.memory && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Memory:</span>
              <span style={{ color: getMemoryColor() }}>
                {metrics.memory.used}MB / {metrics.memory.limit}MB
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Usage:</span>
              <span style={{ color: getMemoryColor() }}>
                {Math.round((metrics.memory.used / metrics.memory.limit) * 100)}%
              </span>
            </div>
          </>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Load Time:</span>
          <span style={{ color: metrics.loadTime < 3000 ? '#10b981' : '#f59e0b' }}>
            {metrics.loadTime}ms
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>API Calls:</span>
          <span>{metrics.networkRequests}</span>
        </div>
        
        <div style={{ borderTop: '1px solid #374151', marginTop: '6px', paddingTop: '6px' }}>
          <div style={{ fontSize: '10px', color: '#9ca3af' }}>
            🟢 Excellent | 🟡 Good | 🔴 Needs Improvement
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimePerformanceMonitor;
