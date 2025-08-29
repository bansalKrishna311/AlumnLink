// smartConnectionManager.js - Single Source of Truth for MongoDB Connection
import mongoose from 'mongoose';

class SmartConnectionManager {
  constructor() {
    this.cachedConnection = null;
    this.isConnecting = false;
    this.keepAliveInterval = null;
    this.reconnectTimeout = null;
    this.lastActivity = Date.now();
    
    // Connection health tracking
    this.health = {
      isHealthy: true,
      lastPing: Date.now(),
      consecutiveFailures: 0,
      totalPings: 0,
      successfulPings: 0
    };
    
    // Circuit breaker to prevent infinite loops
    this.circuitBreaker = {
      isOpen: false,
      failureCount: 0,
      lastFailureTime: null,
      threshold: 5, // Open circuit after 5 consecutive failures
      timeout: 30000 // 30 seconds before attempting reconnection
    };
    
    // Prevent multiple intervals
    this.isServiceStarted = false;
  }

  // Connect to database with circuit breaker protection
  async connect() {
    // Circuit breaker check
    if (this.circuitBreaker.isOpen) {
      const timeSinceLastFailure = Date.now() - this.circuitBreaker.lastFailureTime;
      if (timeSinceLastFailure < this.circuitBreaker.timeout) {
        throw new Error(`Circuit breaker is open. Retry in ${Math.ceil((this.circuitBreaker.timeout - timeSinceLastFailure) / 1000)} seconds`);
      } else {
        console.log('🔄 Circuit breaker timeout elapsed, attempting reconnection...');
        this.circuitBreaker.isOpen = false;
        this.circuitBreaker.failureCount = 0;
      }
    }

    // Return cached connection if healthy
    if (this.cachedConnection && this.health.isHealthy && mongoose.connection.readyState === 1) {
      this.updateActivity();
      return this.cachedConnection;
    }

    // Use a shared promise for concurrent connection attempts
    if (this.isConnecting) {
      return this.isConnecting;
    }

    this.isConnecting = (async () => {
      try {
        console.log('🔌 Connecting to MongoDB...');
        // Optimized settings for M0 tier
        const options = {
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 10000,
          maxPoolSize: 2,
          minPoolSize: 0,
          maxIdleTimeMS: 30000,
          heartbeatFrequencyMS: 30000,
          retryWrites: false,
          retryReads: false,
          family: 4,
          bufferCommands: false,
          autoIndex: false,
          autoCreate: false
        };

        // Clear any existing connection first
        if (mongoose.connection.readyState !== 0) {
          await mongoose.disconnect();
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        this.cachedConnection = conn;
        this.health.isHealthy = true;
        this.health.consecutiveFailures = 0;
        this.circuitBreaker.failureCount = 0;
        this.updateActivity();
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        this.setupEventListeners();
        if (!this.isServiceStarted) {
          this.startKeepAliveService();
          this.isServiceStarted = true;
        }
        return conn;
      } catch (error) {
        console.error(`❌ MongoDB Connection Failed: ${error.message}`);
        this.circuitBreaker.failureCount++;
        this.circuitBreaker.lastFailureTime = Date.now();
        if (this.circuitBreaker.failureCount >= this.circuitBreaker.threshold) {
          this.circuitBreaker.isOpen = true;
          console.log(`🚨 Circuit breaker opened after ${this.circuitBreaker.failureCount} failures`);
        }
        this.cachedConnection = null;
        this.health.isHealthy = false;
        this.health.consecutiveFailures++;
        throw error;
      } finally {
        this.isConnecting = false;
      }
    })();

    return this.isConnecting;
  }

  // Setup event listeners (ONLY ONCE)
  setupEventListeners() {
    // Remove existing listeners first
    mongoose.connection.removeAllListeners();
    
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
      this.health.isHealthy = true;
      this.health.consecutiveFailures = 0;
      this.circuitBreaker.failureCount = 0;
      this.updateActivity();
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      this.cachedConnection = null;
      this.health.isHealthy = false;
      
      // IMPORTANT: Don't auto-reconnect here to prevent loops
      // Let the application handle reconnection on next request
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      this.cachedConnection = null;
      this.health.isHealthy = false;
      this.health.consecutiveFailures++;
    });
  }

  // Single keep-alive service (replaces all others)
  startKeepAliveService() {
    console.log('🚀 Starting unified keep-alive service...');
    
    // Clear any existing interval
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }
    
    // Ping every 2 minutes (conservative for M0 tier)
    this.keepAliveInterval = setInterval(async () => {
      await this.performHealthPing();
    }, 120000); // 2 minutes
  }

  // Smart health ping with circuit breaker
  async performHealthPing() {
    // Skip if circuit breaker is open
    if (this.circuitBreaker.isOpen) {
      return;
    }
    
    // Skip if not connected
    if (mongoose.connection.readyState !== 1) {
      return;
    }

    // Skip if no recent activity (save resources)
    const timeSinceLastActivity = Date.now() - this.lastActivity;
    const tenMinutes = 10 * 60 * 1000;
    
    if (timeSinceLastActivity > tenMinutes) {
      console.log('⏰ Skipping ping - no recent activity');
      return;
    }

    try {
      this.health.totalPings++;
      
      const startTime = Date.now();
      await mongoose.connection.db.command({ ping: 1 });
      const pingTime = Date.now() - startTime;
      
      this.health.successfulPings++;
      this.health.lastPing = Date.now();
      this.health.consecutiveFailures = 0;
      this.updateActivity();
      
      if (pingTime > 5000) {
        console.log(`⚠️ Slow ping: ${pingTime}ms`);
      } else {
        console.log(`✅ Ping successful: ${pingTime}ms`);
      }
      
    } catch (error) {
      console.error(`❌ Ping failed: ${error.message}`);
      this.health.consecutiveFailures++;
      
      // Open circuit breaker if too many consecutive ping failures
      if (this.health.consecutiveFailures >= 3) {
        this.circuitBreaker.isOpen = true;
        this.circuitBreaker.lastFailureTime = Date.now();
        console.log('🚨 Circuit breaker opened due to ping failures');
      }
    }
  }

  // Update activity timestamp
  updateActivity() {
    this.lastActivity = Date.now();
  }

  // Check if connection is healthy
  isHealthy() {
    return this.health.isHealthy && 
           mongoose.connection.readyState === 1 && 
           !this.circuitBreaker.isOpen;
  }

  // Force reconnection (with circuit breaker protection)
  async forceReconnect() {
    if (this.circuitBreaker.isOpen) {
      throw new Error('Circuit breaker is open - cannot force reconnect');
    }
    
    console.log('🔄 Forcing reconnection...');
    
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      
      this.cachedConnection = null;
      this.health.isHealthy = false;
      
      return await this.connect();
    } catch (error) {
      console.error('❌ Force reconnect failed:', error);
      throw error;
    }
  }

  // Get comprehensive stats
  getStats() {
    return {
      connection: {
        isHealthy: this.isHealthy(),
        state: mongoose.connection.readyState,
        stateName: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState]
      },
      health: this.health,
      circuitBreaker: this.circuitBreaker,
      activity: {
        lastActivity: this.lastActivity,
        timeSinceLastActivity: Date.now() - this.lastActivity
      }
    };
  }

  // Graceful shutdown
  async shutdown() {
    console.log('🛑 Shutting down connection manager...');
    
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    this.isServiceStarted = false;
    console.log('✅ Connection manager shutdown complete');
  }
}

// Create singleton instance
const connectionManager = new SmartConnectionManager();

// Graceful shutdown handlers
process.on('SIGINT', () => connectionManager.shutdown());
process.on('SIGTERM', () => connectionManager.shutdown());
process.on('SIGUSR2', () => connectionManager.shutdown()); // For nodemon

export default connectionManager;
export { SmartConnectionManager };
