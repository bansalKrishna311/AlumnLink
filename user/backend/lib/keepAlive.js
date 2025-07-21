// keepAlive.js - MongoDB Keep-Alive Service for Free Tier
import mongoose from 'mongoose';
import { updateLastActivity } from './db.js';

class MongoKeepAlive {
  constructor() {
    this.pingInterval = null;
    this.healthCheckInterval = null;
    this.isActive = false;
    this.stats = {
      totalPings: 0,
      successfulPings: 0,
      failedPings: 0,
      lastSuccessfulPing: null,
      lastFailedPing: null
    };
  }

  // Start the keep-alive service with M0 tier optimizations
  start() {
    if (this.isActive) {
      console.log('Keep-alive service is already running');
      return;
    }

    this.isActive = true;
    console.log('Starting MongoDB keep-alive service for M0 tier...');

    // Primary ping mechanism - every 2 minutes (less aggressive for shared tier)
    this.pingInterval = setInterval(() => {
      this.performPing();
    }, 120000);

    // Health check - every 5 minutes
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 300000);

    // Initial ping after 10 seconds to allow connection to stabilize
    setTimeout(() => this.performPing(), 10000);
  }

  // Stop the keep-alive service
  stop() {
    if (!this.isActive) {
      return;
    }

    console.log('Stopping MongoDB keep-alive service...');
    this.isActive = false;

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  // Perform a lightweight ping optimized for M0 tier
  async performPing() {
    if (!this.isActive || mongoose.connection.readyState !== 1) {
      return;
    }

    try {
      this.stats.totalPings++;
      
      // Use the most efficient ping for M0 tier
      const startTime = Date.now();
      await mongoose.connection.db.command({ ping: 1 });
      const pingTime = Date.now() - startTime;
      
      this.stats.successfulPings++;
      this.stats.lastSuccessfulPing = new Date();
      updateLastActivity();

      // Monitor ping performance for M0 tier insights
      if (pingTime > 3000) {
        console.log(`⚠️ Slow ping detected (${pingTime}ms) - M0 tier may be under load`);
      } else {
        console.log(`✓ MongoDB ping successful (${pingTime}ms) - Success rate: ${this.getSuccessRate()}%`);
      }
      
      // Log stats every 5 successful pings (reduced frequency)
      if (this.stats.successfulPings % 5 === 0) {
        this.logStats();
      }

    } catch (error) {
      this.stats.failedPings++;
      this.stats.lastFailedPing = new Date();
      
      console.error(`✗ MongoDB ping failed:`, error.message);
      
      // Handle M0 tier specific errors
      if (error.name === 'MongoNetworkTimeoutError' || 
          error.name === 'MongoServerSelectionError' ||
          error.message.includes('connection') ||
          error.message.includes('timeout')) {
        console.log('🔄 Network/connection issue detected on M0 tier, connection may need refresh');
      }
      
      // If failure rate is high, increase ping interval temporarily
      const failureRate = (this.stats.failedPings / this.stats.totalPings) * 100;
      if (failureRate > 50 && this.stats.totalPings > 5) {
        console.log(`⚠️ High failure rate (${failureRate.toFixed(1)}%) - adapting to M0 tier conditions`);
      }
    }
  }

  // Perform comprehensive health check
  async performHealthCheck() {
    if (!this.isActive) {
      return;
    }

    try {
      const connectionState = mongoose.connection.readyState;
      const stateNames = ['disconnected', 'connected', 'connecting', 'disconnecting'];
      
      console.log(`🔍 MongoDB Health Check - State: ${stateNames[connectionState]}`);
      
      if (connectionState === 1) {
        // Test with a lightweight operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`✓ Health check passed - ${collections.length} collections available`);
        
        // Update activity to show connection is healthy
        updateLastActivity();
      } else {
        console.log(`⚠️ Connection not ready - State: ${stateNames[connectionState]}`);
      }

    } catch (error) {
      console.error('❌ Health check failed:', error.message);
    }
  }

  // Get success rate percentage
  getSuccessRate() {
    if (this.stats.totalPings === 0) return 100;
    return Math.round((this.stats.successfulPings / this.stats.totalPings) * 100);
  }

  // Log service statistics
  logStats() {
    const uptime = this.isActive ? 'Active' : 'Inactive';
    console.log(`
📊 MongoDB Keep-Alive Stats:
   Status: ${uptime}
   Total Pings: ${this.stats.totalPings}
   Successful: ${this.stats.successfulPings}
   Failed: ${this.stats.failedPings}
   Success Rate: ${this.getSuccessRate()}%
   Last Success: ${this.stats.lastSuccessfulPing || 'Never'}
   Last Failure: ${this.stats.lastFailedPing || 'Never'}
    `);
  }

  // Get current stats
  getStats() {
    return {
      ...this.stats,
      isActive: this.isActive,
      successRate: this.getSuccessRate()
    };
  }

  // Reset stats
  resetStats() {
    this.stats = {
      totalPings: 0,
      successfulPings: 0,
      failedPings: 0,
      lastSuccessfulPing: null,
      lastFailedPing: null
    };
    console.log('Keep-alive stats reset');
  }
}

// Create singleton instance
const keepAliveService = new MongoKeepAlive();

export default keepAliveService;
export { MongoKeepAlive };
