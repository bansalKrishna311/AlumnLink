// external-keepalive.js - External Keep-Alive Script for Free Hosting Tiers
// This script can be run separately or scheduled as a cron job to keep your app alive

import https from 'https';
import http from 'http';

class ExternalKeepAlive {
  constructor(config = {}) {
    this.urls = config.urls || [];
    this.interval = config.interval || 14 * 60 * 1000; // 14 minutes default
    this.timeout = config.timeout || 10000; // 10 seconds timeout
    this.isRunning = false;
    this.stats = {
      totalPings: 0,
      successfulPings: 0,
      failedPings: 0,
      lastSuccessfulPing: null,
      lastFailedPing: null
    };
  }

  // Add URL to keep alive
  addUrl(url) {
    if (!this.urls.includes(url)) {
      this.urls.push(url);
      console.log(`Added URL to keep-alive list: ${url}`);
    }
  }

  // Remove URL from keep alive
  removeUrl(url) {
    const index = this.urls.indexOf(url);
    if (index > -1) {
      this.urls.splice(index, 1);
      console.log(`Removed URL from keep-alive list: ${url}`);
    }
  }

  // Start the keep-alive service
  start() {
    if (this.isRunning) {
      console.log('External keep-alive is already running');
      return;
    }

    if (this.urls.length === 0) {
      console.error('No URLs configured for keep-alive');
      return;
    }

    this.isRunning = true;
    console.log(`Starting external keep-alive for ${this.urls.length} URLs...`);
    console.log(`Ping interval: ${this.interval / 1000} seconds`);

    // Initial ping
    setTimeout(() => this.pingAllUrls(), 5000);

    // Set up interval
    this.intervalId = setInterval(() => {
      this.pingAllUrls();
    }, this.interval);
  }

  // Stop the keep-alive service
  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('External keep-alive stopped');
  }

  // Ping all configured URLs
  async pingAllUrls() {
    if (!this.isRunning) {
      return;
    }

    console.log(`🏓 Pinging ${this.urls.length} URLs...`);
    
    const promises = this.urls.map(url => this.pingUrl(url));
    const results = await Promise.allSettled(promises);
    
    let successful = 0;
    let failed = 0;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful++;
      } else {
        failed++;
        console.error(`❌ Failed to ping ${this.urls[index]}:`, result.reason);
      }
    });

    this.stats.totalPings += this.urls.length;
    this.stats.successfulPings += successful;
    this.stats.failedPings += failed;

    if (successful > 0) {
      this.stats.lastSuccessfulPing = new Date();
    }
    if (failed > 0) {
      this.stats.lastFailedPing = new Date();
    }

    console.log(`✅ Keep-alive complete: ${successful} successful, ${failed} failed`);
    this.logStats();
  }

  // Ping a single URL
  pingUrl(url) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: this.timeout,
        headers: {
          'User-Agent': 'AlumnLink-KeepAlive/1.0',
          'Accept': 'application/json, text/plain, */*'
        }
      };

      const startTime = Date.now();

      const req = protocol.request(options, (res) => {
        const duration = Date.now() - startTime;
        
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ ${url} - ${res.statusCode} (${duration}ms)`);
            resolve({ url, statusCode: res.statusCode, duration, data });
          } else {
            console.log(`⚠️ ${url} - ${res.statusCode} (${duration}ms)`);
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error) => {
        const duration = Date.now() - startTime;
        console.log(`❌ ${url} - Error (${duration}ms): ${error.message}`);
        reject(error);
      });

      req.on('timeout', () => {
        const duration = Date.now() - startTime;
        console.log(`⏰ ${url} - Timeout (${duration}ms)`);
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  // Get statistics
  getStats() {
    const successRate = this.stats.totalPings > 0 
      ? Math.round((this.stats.successfulPings / this.stats.totalPings) * 100)
      : 0;

    return {
      ...this.stats,
      successRate,
      isRunning: this.isRunning,
      urlCount: this.urls.length,
      interval: this.interval
    };
  }

  // Log statistics
  logStats() {
    const stats = this.getStats();
    
    if (stats.totalPings % 10 === 0 && stats.totalPings > 0) {
      console.log(`
📊 External Keep-Alive Stats:
   URLs: ${stats.urlCount}
   Total Pings: ${stats.totalPings}
   Success Rate: ${stats.successRate}%
   Last Success: ${stats.lastSuccessfulPing || 'Never'}
   Last Failure: ${stats.lastFailedPing || 'Never'}
      `);
    }
  }
}

// Configuration for your AlumnLink deployment
const keepAlive = new ExternalKeepAlive({
  interval: 14 * 60 * 1000, // 14 minutes (free tiers usually sleep after 15 minutes)
  timeout: 15000 // 15 seconds timeout
});

// Add your deployment URLs here
const DEPLOYMENT_URLS = [
  // Add your production URLs here
  // 'https://your-app.vercel.app/health',
  // 'https://your-app.herokuapp.com/health',
  // 'https://your-app.railway.app/health'
];

// If URLs are provided via environment variables
if (process.env.KEEP_ALIVE_URLS) {
  const urls = process.env.KEEP_ALIVE_URLS.split(',');
  urls.forEach(url => keepAlive.addUrl(url.trim()));
}

// Add default URLs if configured
DEPLOYMENT_URLS.forEach(url => keepAlive.addUrl(url));

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down external keep-alive...');
  keepAlive.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  keepAlive.stop();
  process.exit(0);
});

// Export for use as module
export default ExternalKeepAlive;
export { keepAlive };

// If run directly, start the service
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Starting external keep-alive service...');
  
  if (keepAlive.urls.length === 0) {
    console.error('❌ No URLs configured. Please set KEEP_ALIVE_URLS environment variable or modify DEPLOYMENT_URLS in the script.');
    console.log('Example: KEEP_ALIVE_URLS="https://your-app.vercel.app/health,https://your-api.herokuapp.com/health"');
    process.exit(1);
  }
  
  keepAlive.start();
}
