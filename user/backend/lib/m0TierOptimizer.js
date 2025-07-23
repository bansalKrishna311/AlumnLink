// m0TierOptimizer.js - MongoDB M0 Tier Optimization Service
import mongoose from 'mongoose';

class M0TierOptimizer {
  constructor() {
    this.activityTracker = {
      lastActivity: Date.now(),
      requestCount: 0,
      activeConnections: 0,
      peakConnections: 0
    };
    
    this.optimizationStats = {
      connectionReuses: 0,
      pingsSaved: 0,
      reconnections: 0,
      totalRequests: 0
    };
    
    this.adaptiveSettings = {
      isHighActivity: false,
      pingInterval: 120000, // Start with 2 minutes
      maxPingInterval: 600000, // Max 10 minutes
      minPingInterval: 60000, // Min 1 minute
    };
    
    this.connectionMonitor = null;
  }

  // Initialize the optimizer
  init() {
    console.log('🚀 M0 Tier Optimizer initialized');
    this.startAdaptiveMonitoring();
    this.setupActivityTracking();
  }

  // Track database activity for intelligent keep-alive
  trackActivity(operationType = 'read') {
    this.activityTracker.lastActivity = Date.now();
    this.activityTracker.requestCount++;
    this.optimizationStats.totalRequests++;
    
    // Determine if we're in high activity period
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);
    
    // If we've had more than 10 requests in last 5 minutes, consider it high activity
    if (this.activityTracker.requestCount > 10) {
      this.adaptiveSettings.isHighActivity = true;
      this.adaptPingInterval(true);
    } else {
      this.adaptiveSettings.isHighActivity = false;
      this.adaptPingInterval(false);
    }
    
    // Reset request count every 5 minutes
    if (this.lastCountReset && (now - this.lastCountReset) > 300000) {
      this.activityTracker.requestCount = 0;
      this.lastCountReset = now;
    } else if (!this.lastCountReset) {
      this.lastCountReset = now;
    }
  }

  // Adapt ping interval based on activity
  adaptPingInterval(isHighActivity) {
    const oldInterval = this.adaptiveSettings.pingInterval;
    
    if (isHighActivity) {
      // High activity: ping less frequently to save resources
      this.adaptiveSettings.pingInterval = Math.min(
        this.adaptiveSettings.pingInterval * 1.5,
        this.adaptiveSettings.maxPingInterval
      );
    } else {
      // Low activity: ping more frequently to keep connection alive
      this.adaptiveSettings.pingInterval = Math.max(
        this.adaptiveSettings.pingInterval * 0.8,
        this.adaptiveSettings.minPingInterval
      );
    }
    
    if (oldInterval !== this.adaptiveSettings.pingInterval) {
      console.log(`📊 Adapted ping interval: ${oldInterval}ms → ${this.adaptiveSettings.pingInterval}ms (${isHighActivity ? 'high' : 'low'} activity)`);
    }
  }

  // Check if we need to ping based on smart logic
  shouldPing() {
    const now = Date.now();
    const timeSinceLastActivity = now - this.activityTracker.lastActivity;
    const maxIdleTime = 15 * 60 * 1000; // 15 minutes max idle
    
    // Don't ping if connection is not ready
    if (mongoose.connection.readyState !== 1) {
      return false;
    }
    
    // Always ping if it's been too long since last activity
    if (timeSinceLastActivity > maxIdleTime) {
      return true;
    }
    
    // If high activity, rely on natural traffic to keep connection alive
    if (this.adaptiveSettings.isHighActivity && timeSinceLastActivity < 300000) {
      this.optimizationStats.pingsSaved++;
      return false;
    }
    
    // Normal ping logic for low activity periods
    return timeSinceLastActivity < (5 * 60 * 1000); // 5 minutes
  }

  // Start adaptive monitoring
  startAdaptiveMonitoring() {
    if (this.connectionMonitor) {
      clearInterval(this.connectionMonitor);
    }
    
    this.connectionMonitor = setInterval(() => {
      this.performIntelligentPing();
    }, this.adaptiveSettings.pingInterval);
  }

  // Perform intelligent ping
  async performIntelligentPing() {
    if (!this.shouldPing()) {
      return;
    }
    
    try {
      const startTime = Date.now();
      await mongoose.connection.db.command({ ping: 1 });
      const pingTime = Date.now() - startTime;
      
      console.log(`🎯 Smart ping successful (${pingTime}ms) - Activity: ${this.adaptiveSettings.isHighActivity ? 'HIGH' : 'LOW'}`);
      
      // If ping is consistently fast, we can reduce frequency
      if (pingTime < 100 && !this.adaptiveSettings.isHighActivity) {
        this.adaptPingInterval(true); // Treat as high performance, reduce pings
      }
      
    } catch (error) {
      console.error('🚨 Smart ping failed:', error.message);
      
      // On failure, be more aggressive with pings temporarily
      this.adaptiveSettings.pingInterval = this.adaptiveSettings.minPingInterval;
      this.restartMonitoring();
    }
  }

  // Setup activity tracking middleware
  setupActivityTracking() {
    // Mongoose middleware to track queries
    mongoose.plugin(function(schema) {
      schema.pre(['find', 'findOne', 'findOneAndUpdate', 'save', 'updateOne', 'deleteOne'], function() {
        const operationType = this.op || this.constructor.name;
        // Use global optimizer instance
        if (global.m0Optimizer) {
          global.m0Optimizer.trackActivity(operationType);
        }
      });
    });
  }

  // Restart monitoring with new interval
  restartMonitoring() {
    if (this.connectionMonitor) {
      clearInterval(this.connectionMonitor);
    }
    this.startAdaptiveMonitoring();
  }

  // Get optimization statistics
  getStats() {
    return {
      ...this.optimizationStats,
      currentSettings: this.adaptiveSettings,
      activityInfo: {
        ...this.activityTracker,
        timeSinceLastActivity: Date.now() - this.activityTracker.lastActivity
      },
      connectionStatus: {
        state: mongoose.connection.readyState,
        stateName: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
      }
    };
  }

  // Manual optimization trigger
  optimize() {
    const stats = this.getStats();
    console.log('🔧 M0 Tier Optimization Stats:', JSON.stringify(stats, null, 2));
    
    // Restart with optimized settings
    this.restartMonitoring();
    
    return stats;
  }

  // Stop the optimizer
  stop() {
    if (this.connectionMonitor) {
      clearInterval(this.connectionMonitor);
      this.connectionMonitor = null;
    }
    console.log('🛑 M0 Tier Optimizer stopped');
  }
}

// Create singleton instance
const m0Optimizer = new M0TierOptimizer();

// Make it globally available for middleware
global.m0Optimizer = m0Optimizer;

export default m0Optimizer;
export { M0TierOptimizer };
