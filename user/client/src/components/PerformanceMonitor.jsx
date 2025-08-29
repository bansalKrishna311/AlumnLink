import React, { useState, useEffect } from 'react';
import { requestManager } from '@/utils/requestManager';
import useAppStore from '@/stores/useAppStore';

const PerformanceMonitor = () => {
  const [stats, setStats] = useState({
    requestCache: { cacheSize: 0, pendingRequests: 0, expiredEntries: 0 },
    storeState: {},
    memory: null,
    networkRequests: 0,
  });

  const store = useAppStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const requestCacheStats = requestManager.getCacheStats();
      
      const storeState = {
        postsCount: store.posts?.length || 0,
        trendingTagsCount: store.trendingTags?.length || 0,
        connectionsCount: store.userConnections?.length || 0,
        conversationsCount: store.conversations?.length || 0,
        isAuthenticated: store.isAuthenticated,
      };

      const memory = performance.memory ? {
        used: Math.round(performance.memory.usedJSMemory / 1048576), // MB
        total: Math.round(performance.memory.totalJSMemory / 1048576),
        limit: Math.round(performance.memory.jsMemoryLimit / 1048576),
      } : null;

      // Count network requests
      const resources = performance.getEntriesByType('resource');
      const apiRequests = resources.filter(r => 
        r.name.includes('api') || r.name.includes('localhost:4000')
      ).length;

      setStats({
        requestCache: requestCacheStats,
        storeState,
        memory,
        networkRequests: apiRequests,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [store]);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '11px',
        zIndex: 10000,
        maxWidth: '300px',
        fontFamily: 'monospace',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#fe6019' }}>
        🚀 Performance Monitor
      </div>
      
      <div style={{ marginBottom: '6px' }}>
        <strong>Request Cache:</strong>
        <div>Cached: {stats.requestCache.cacheSize}/{stats.requestCache.maxCacheSize}</div>
        <div>Pending: {stats.requestCache.pendingRequests}</div>
        <div>Memory: {Math.round(stats.requestCache.memoryUsage / 1024)}KB ({stats.requestCache.memoryUsagePercentage}%)</div>
        <div>Expired: {stats.requestCache.expiredEntries}</div>
      </div>

      <div style={{ marginBottom: '6px' }}>
        <strong>Store State:</strong>
        <div>Posts: {stats.storeState.postsCount}</div>
        <div>Tags: {stats.storeState.trendingTagsCount}</div>
        <div>Connections: {stats.storeState.connectionsCount}</div>
        <div>Conversations: {stats.storeState.conversationsCount}</div>
        <div>Auth: {stats.storeState.isAuthenticated ? '✅' : '❌'}</div>
      </div>

      {stats.memory && (
        <div style={{ marginBottom: '6px' }}>
          <strong>Memory (MB):</strong>
          <div>Used: {stats.memory.used}</div>
          <div>Total: {stats.memory.total}</div>
          <div>Limit: {stats.memory.limit}</div>
        </div>
      )}

      <div style={{ marginBottom: '6px' }}>
        <strong>Network:</strong>
        <div>API Requests: {stats.networkRequests}</div>
      </div>

      <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
        <button
          onClick={() => requestManager.clearCache()}
          style={{
            background: '#fe6019',
            border: 'none',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '10px',
            cursor: 'pointer',
          }}
        >
          Clear Cache
        </button>
        <button
          onClick={() => store.clearCache()}
          style={{
            background: '#666',
            border: 'none',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '10px',
            cursor: 'pointer',
          }}
        >
          Clear Store
        </button>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
