// m0-external-keepalive.js - External Keep-Alive specifically for MongoDB M0 Tier
// Run this script separately to ping your deployed app and keep M0 tier active

import https from 'https';
import http from 'http';

class M0ExternalKeepAlive {
  constructor() {
    this.config = {
      // Your deployed app URLs (add all your deployment URLs here)
      urls: [
        process.env.MAIN_APP_URL || 'https://your-app.vercel.app',
        process.env.API_URL || 'https://your-api.herokuapp.com'
      ].filter(url => url && !url.includes('your-')), // Remove placeholder URLs
      
      // M0 tier optimized intervals
      healthCheckInterval: 8 * 60 * 1000, // 8 minutes (under 10 minute timeout)
      fullCheckInterval: 25 * 60 * 1000, // 25 minutes for comprehensive check
      maxRetries: 3,
      timeout: 15000, // 15 seconds timeout
      
      // Adaptive settings
      adaptToFailures: true,
      backoffMultiplier: 1.5,
      maxBackoffInterval: 20 * 60 * 1000 // Max 20 minutes
    };
    
    this.stats = {
      totalPings: 0,
      successfulPings: 0,
      failedPings: 0,
      lastSuccess: null,
      lastFailure: null,
      consecutiveFailures: 0,
      adaptedInterval: this.config.healthCheckInterval
    };
    
    this.isRunning = false;
    this.intervals = [];
  }

  // Start the external keep-alive service
  start() {
    if (this.isRunning) {
      console.log('🔄 M0 External Keep-Alive is already running');
      return;
    }

    if (this.config.urls.length === 0) {
      console.error('❌ No URLs configured! Set MAIN_APP_URL and/or API_URL environment variables');
      process.exit(1);
    }

    this.isRunning = true;
    console.log('🚀 Starting M0 Tier External Keep-Alive Service...');
    console.log(`📍 Monitoring URLs: ${this.config.urls.join(', ')}`);
    console.log(`⏰ Health check interval: ${this.config.healthCheckInterval / 1000}s`);

    // Health check interval
    const healthInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.stats.adaptedInterval);
    
    // Full check interval
    const fullInterval = setInterval(() => {
      this.performFullChecks();
    }, this.config.fullCheckInterval);
    
    this.intervals.push(healthInterval, fullInterval);

    // Initial health check after 30 seconds
    setTimeout(() => this.performHealthChecks(), 30000);
  }

  // Stop the service
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    
    console.log('🛑 M0 External Keep-Alive stopped');
    this.logFinalStats();
  }

  // Perform health checks on all URLs
  async performHealthChecks() {
    if (!this.isRunning) return;

    console.log('🔍 Performing M0 tier health checks...');
    
    const promises = this.config.urls.map(url => 
      this.pingUrl(`${url}/health`, 'health')
    );
    
    try {
      const results = await Promise.allSettled(promises);
      this.processResults(results);
      this.adaptInterval();
    } catch (error) {
      console.error('❌ Health check batch failed:', error.message);
    }
  }

  // Perform comprehensive checks
  async performFullChecks() {
    if (!this.isRunning) return;

    console.log('🔎 Performing comprehensive M0 tier checks...');
    
    const endpoints = ['/health', '/health/db'];
    const promises = [];
    
    for (const url of this.config.urls) {
      for (const endpoint of endpoints) {
        promises.push(this.pingUrl(`${url}${endpoint}`, `full-${endpoint}`));
      }
    }
    
    try {
      const results = await Promise.allSettled(promises);
      this.processResults(results);
    } catch (error) {
      console.error('❌ Full check batch failed:', error.message);
    }
  }

  // Ping a specific URL
  async pingUrl(url, type = 'ping') {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: this.config.timeout,
        headers: {
          'User-Agent': 'M0-KeepAlive/1.0',
          'Accept': 'application/json'
        }
      };

      const req = client.request(options, (res) => {
        const responseTime = Date.now() - startTime;
        let data = '';
        
        res.on('data', chunk => {
          data += chunk;
        });
        
        res.on('end', () => {
          this.stats.totalPings++;
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            this.stats.successfulPings++;
            this.stats.lastSuccess = new Date();
            this.stats.consecutiveFailures = 0;
            
            console.log(`✅ ${type.toUpperCase()} ${url} - ${res.statusCode} (${responseTime}ms)`);
            
            // Log slow responses that might indicate M0 tier stress
            if (responseTime > 5000) {
              console.log(`⚠️  Slow response detected (${responseTime}ms) - M0 tier may be under load`);
            }
            
            resolve({ url, status: res.statusCode, responseTime, type });
          } else {
            this.handleFailure(url, `HTTP ${res.statusCode}`, type);
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error) => {
        this.handleFailure(url, error.message, type);
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        this.handleFailure(url, 'Timeout', type);
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  // Handle ping failures
  handleFailure(url, error, type) {
    this.stats.failedPings++;
    this.stats.lastFailure = new Date();
    this.stats.consecutiveFailures++;
    
    console.error(`❌ ${type.toUpperCase()} ${url} - ${error}`);
    
    // If too many consecutive failures, something might be wrong
    if (this.stats.consecutiveFailures >= 5) {
      console.error(`🚨 ${this.stats.consecutiveFailures} consecutive failures detected!`);
      console.error('   This might indicate:');
      console.error('   - M0 tier connection limit reached');
      console.error('   - App deployment issues');
      console.error('   - Network connectivity problems');
    }
  }

  // Process results and adapt behavior
  processResults(results) {
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`📊 Batch complete: ${successful} successful, ${failed} failed`);
    
    if (successful > 0) {
      this.stats.consecutiveFailures = 0;
    }
  }

  // Adapt interval based on performance
  adaptInterval() {
    if (!this.config.adaptToFailures) return;
    
    const failureRate = this.stats.totalPings > 0 ? 
      (this.stats.failedPings / this.stats.totalPings) * 100 : 0;
    
    if (failureRate > 30 && this.stats.consecutiveFailures > 2) {
      // High failure rate: back off
      this.stats.adaptedInterval = Math.min(
        this.stats.adaptedInterval * this.config.backoffMultiplier,
        this.config.maxBackoffInterval
      );
      console.log(`📈 Backing off due to failures: interval now ${this.stats.adaptedInterval / 1000}s`);
    } else if (failureRate < 10 && this.stats.consecutiveFailures === 0) {
      // Low failure rate: can be more aggressive
      this.stats.adaptedInterval = Math.max(
        this.stats.adaptedInterval / this.config.backoffMultiplier,
        this.config.healthCheckInterval
      );
    }
  }

  // Get current statistics
  getStats() {
    const successRate = this.stats.totalPings > 0 ? 
      ((this.stats.successfulPings / this.stats.totalPings) * 100).toFixed(1) : '0';
    
    return {
      ...this.stats,
      successRate: `${successRate}%`,
      isRunning: this.isRunning,
      monitoredUrls: this.config.urls.length,
      nextCheckIn: this.stats.adaptedInterval
    };
  }

  // Log comprehensive statistics
  logStats() {
    const stats = this.getStats();
    console.log('\n📊 M0 External Keep-Alive Statistics:');
    console.log(`   Status: ${stats.isRunning ? 'RUNNING' : 'STOPPED'}`);
    console.log(`   URLs Monitored: ${stats.monitoredUrls}`);
    console.log(`   Total Pings: ${stats.totalPings}`);
    console.log(`   Success Rate: ${stats.successRate}`);
    console.log(`   Current Interval: ${stats.adaptedInterval / 1000}s`);
    console.log(`   Consecutive Failures: ${stats.consecutiveFailures}`);
    console.log(`   Last Success: ${stats.lastSuccess || 'Never'}`);
    console.log(`   Last Failure: ${stats.lastFailure || 'Never'}\n`);
  }

  // Log final statistics when stopping
  logFinalStats() {
    console.log('\n🏁 Final M0 Keep-Alive Session Summary:');
    this.logStats();
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const keepAlive = new M0ExternalKeepAlive();
  
  // Handle command line arguments
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🚀 M0 Tier External Keep-Alive Service

Usage: node m0-external-keepalive.js [options]

Environment Variables:
  MAIN_APP_URL    - Your main app URL (e.g., https://myapp.vercel.app)
  API_URL         - Your API URL (e.g., https://myapi.herokuapp.com)

Options:
  --help, -h      - Show this help message
  --stats, -s     - Show stats every minute
  --quiet, -q     - Minimal logging

Example:
  MAIN_APP_URL=https://myapp.vercel.app node m0-external-keepalive.js

This service will:
  ✅ Keep your M0 tier MongoDB connection alive
  ✅ Prevent app hibernation on free hosting tiers
  ✅ Monitor connection health and adapt timing
  ✅ Provide detailed statistics and insights
    `);
    process.exit(0);
  }

  // Start the service
  keepAlive.start();

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    keepAlive.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    keepAlive.stop();
    process.exit(0);
  });

  // Log stats periodically if requested
  if (args.includes('--stats') || args.includes('-s')) {
    setInterval(() => {
      keepAlive.logStats();
    }, 60000); // Every minute
  }

  console.log('\n🎯 M0 Keep-Alive Service is running...');
  console.log('   Press Ctrl+C to stop');
  console.log('   Logs will show ping results and health status\n');
}

export default M0ExternalKeepAlive;
export { M0ExternalKeepAlive };
