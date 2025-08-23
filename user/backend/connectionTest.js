// connectionTest.js - Test the new Smart Connection Manager
import dotenv from 'dotenv';
import connectionManager from './lib/smartConnectionManager.js';

dotenv.config();

async function testConnection() {
  console.log('🧪 Testing Smart Connection Manager...\n');
  
  try {
    // Test 1: Initial Connection
    console.log('Test 1: Initial Connection');
    const conn1 = await connectionManager.connect();
    console.log(`✅ Connected successfully`);
    console.log(`Stats:`, connectionManager.getStats());
    console.log('');
    
    // Test 2: Reuse Connection
    console.log('Test 2: Connection Reuse');
    const conn2 = await connectionManager.connect();
    console.log(`✅ Connection reused: ${conn1 === conn2}`);
    console.log('');
    
    // Test 3: Health Check
    console.log('Test 3: Health Check');
    console.log(`Is Healthy: ${connectionManager.isHealthy()}`);
    console.log('');
    
    // Test 4: Activity Tracking
    console.log('Test 4: Activity Tracking');
    connectionManager.updateActivity();
    const stats = connectionManager.getStats();
    console.log(`Last Activity: ${new Date(stats.activity.lastActivity).toISOString()}`);
    console.log('');
    
    // Test 5: Force Reconnect
    console.log('Test 5: Force Reconnect');
    await connectionManager.forceReconnect();
    console.log('✅ Force reconnect successful');
    console.log('');
    
    // Monitor for 30 seconds
    console.log('🔍 Monitoring for 30 seconds...');
    const startTime = Date.now();
    
    const monitorInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const stats = connectionManager.getStats();
      
      console.log(`[${Math.floor(elapsed/1000)}s] Health: ${connectionManager.isHealthy()}, State: ${stats.connection.stateName}, Pings: ${stats.health.successfulPings}/${stats.health.totalPings}`);
      
      if (elapsed > 30000) {
        clearInterval(monitorInterval);
        shutdown();
      }
    }, 5000);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

async function shutdown() {
  console.log('\n🛑 Shutting down test...');
  await connectionManager.shutdown();
  console.log('✅ Test completed successfully');
  process.exit(0);
}

// Handle process termination
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Run test
testConnection();
