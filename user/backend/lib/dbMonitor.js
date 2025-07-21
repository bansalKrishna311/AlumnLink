// dbMonitor.js - Database Performance Monitor for M0 Tier
import mongoose from 'mongoose';

class DatabaseMonitor {
  constructor() {
    this.queryStats = {
      totalQueries: 0,
      slowQueries: 0,
      failedQueries: 0,
      averageResponseTime: 0,
      responseTimeHistory: []
    };
    
    this.connectionStats = {
      connections: 0,
      disconnections: 0,
      errors: 0,
      uptime: Date.now()
    };

    this.isMonitoring = false;
  }

  // Start monitoring database performance
  startMonitoring() {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    console.log('📊 Starting database performance monitoring...');

    // Monitor mongoose queries (only in development)
    if (process.env.NODE_ENV !== 'production') {
      this.setupQueryMonitoring();
    }

    // Monitor connection events
    this.setupConnectionMonitoring();

    // Log stats periodically
    setInterval(() => {
      this.logPerformanceStats();
    }, 300000); // Every 5 minutes
  }

  // Setup query performance monitoring
  setupQueryMonitoring() {
    // Override mongoose Query prototype to track performance
    const originalExec = mongoose.Query.prototype.exec;
    
    mongoose.Query.prototype.exec = function() {
      const startTime = Date.now();
      
      return originalExec.apply(this, arguments)
        .then(result => {
          const duration = Date.now() - startTime;
          databaseMonitor.recordQuery(duration, true);
          
          // Log slow queries
          if (duration > 1000) {
            console.warn(`🐌 Slow query detected (${duration}ms):`, {
              collection: this.getOptions().collection?.name,
              operation: this.op,
              conditions: this.getFilter()
            });
          }
          
          return result;
        })
        .catch(error => {
          const duration = Date.now() - startTime;
          databaseMonitor.recordQuery(duration, false);
          throw error;
        });
    };
  }

  // Setup connection monitoring
  setupConnectionMonitoring() {
    mongoose.connection.on('connected', () => {
      this.connectionStats.connections++;
      console.log('📶 Database connected');
    });

    mongoose.connection.on('disconnected', () => {
      this.connectionStats.disconnections++;
      console.log('📶 Database disconnected');
    });

    mongoose.connection.on('error', (error) => {
      this.connectionStats.errors++;
      console.error('❌ Database error:', error.message);
    });
  }

  // Record query performance
  recordQuery(duration, success) {
    this.queryStats.totalQueries++;
    
    if (!success) {
      this.queryStats.failedQueries++;
    }
    
    if (duration > 1000) {
      this.queryStats.slowQueries++;
    }

    // Keep track of response times (last 100 queries)
    this.queryStats.responseTimeHistory.push(duration);
    if (this.queryStats.responseTimeHistory.length > 100) {
      this.queryStats.responseTimeHistory.shift();
    }

    // Calculate average response time
    if (this.queryStats.responseTimeHistory.length > 0) {
      this.queryStats.averageResponseTime = 
        this.queryStats.responseTimeHistory.reduce((a, b) => a + b, 0) / 
        this.queryStats.responseTimeHistory.length;
    }
  }

  // Get performance statistics
  getStats() {
    const uptime = Date.now() - this.connectionStats.uptime;
    const uptimeHours = Math.round(uptime / (1000 * 60 * 60) * 100) / 100;

    return {
      uptime: {
        milliseconds: uptime,
        hours: uptimeHours
      },
      queries: {
        ...this.queryStats,
        averageResponseTime: Math.round(this.queryStats.averageResponseTime * 100) / 100,
        slowQueryPercentage: this.queryStats.totalQueries > 0 
          ? Math.round((this.queryStats.slowQueries / this.queryStats.totalQueries) * 100 * 100) / 100
          : 0,
        failureRate: this.queryStats.totalQueries > 0
          ? Math.round((this.queryStats.failedQueries / this.queryStats.totalQueries) * 100 * 100) / 100
          : 0
      },
      connections: this.connectionStats,
      health: this.getHealthScore()
    };
  }

  // Calculate health score (0-100)
  getHealthScore() {
    const stats = this.queryStats;
    let score = 100;

    // Deduct points for slow queries
    if (stats.totalQueries > 0) {
      const slowQueryRatio = stats.slowQueries / stats.totalQueries;
      score -= slowQueryRatio * 30; // Max 30 points deduction
    }

    // Deduct points for failed queries
    if (stats.totalQueries > 0) {
      const failureRate = stats.failedQueries / stats.totalQueries;
      score -= failureRate * 40; // Max 40 points deduction
    }

    // Deduct points for high average response time
    if (stats.averageResponseTime > 500) {
      score -= Math.min(20, (stats.averageResponseTime - 500) / 100 * 5);
    }

    // Deduct points for connection issues
    const connectionIssueRatio = this.connectionStats.errors / 
      (this.connectionStats.connections + 1);
    score -= connectionIssueRatio * 10;

    return Math.max(0, Math.round(score));
  }

  // Log performance statistics
  logPerformanceStats() {
    if (!this.isMonitoring) {
      return;
    }

    const stats = this.getStats();
    
    console.log(`
📊 Database Performance Report:
   Uptime: ${stats.uptime.hours} hours
   Health Score: ${stats.health}/100
   
   Queries:
   - Total: ${stats.queries.totalQueries}
   - Average Response Time: ${stats.queries.averageResponseTime}ms
   - Slow Queries: ${stats.queries.slowQueries} (${stats.queries.slowQueryPercentage}%)
   - Failed Queries: ${stats.queries.failedQueries} (${stats.queries.failureRate}%)
   
   Connections:
   - Connected: ${stats.connections.connections} times
   - Disconnected: ${stats.connections.disconnections} times
   - Errors: ${stats.connections.errors}
    `);

    // Performance recommendations for M0 tier
    if (stats.health < 80) {
      console.log('⚠️ Performance recommendations:');
      
      if (stats.queries.slowQueryPercentage > 10) {
        console.log('  - Too many slow queries. Consider adding indexes or reducing query complexity.');
      }
      
      if (stats.queries.averageResponseTime > 500) {
        console.log('  - High average response time. Check network connectivity and query optimization.');
      }
      
      if (stats.queries.failureRate > 5) {
        console.log('  - High failure rate. Check error logs and connection stability.');
      }
    }
  }

  // Stop monitoring
  stopMonitoring() {
    this.isMonitoring = false;
    console.log('📊 Database monitoring stopped');
  }

  // Reset statistics
  resetStats() {
    this.queryStats = {
      totalQueries: 0,
      slowQueries: 0,
      failedQueries: 0,
      averageResponseTime: 0,
      responseTimeHistory: []
    };
    
    this.connectionStats = {
      connections: 0,
      disconnections: 0,
      errors: 0,
      uptime: Date.now()
    };

    console.log('📊 Database monitoring stats reset');
  }
}

// Create singleton instance
const databaseMonitor = new DatabaseMonitor();

export default databaseMonitor;
