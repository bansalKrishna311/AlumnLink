// Quick health check script for the running server
import fetch from 'node-fetch';

const SERVER_URL = process.env.BACKEND_URL || 'http://localhost:4000';

async function checkHealth() {
  try {
    console.log(`Checking server health at ${SERVER_URL}...`);
    
    // Check basic health endpoint
    const healthResponse = await fetch(`${SERVER_URL}/health`);
    const healthData = await healthResponse.json();
    
    console.log('✅ Health Check Results:');
    console.log(JSON.stringify(healthData, null, 2));
    
    // Check database status
    const dbResponse = await fetch(`${SERVER_URL}/api/db-status`);
    const dbData = await dbResponse.json();
    
    console.log('\n📊 Database Status:');
    console.log(JSON.stringify(dbData, null, 2));
    
    // Connection status summary
    if (dbData.isConnected) {
      console.log('\n✅ Everything looks good! Database is connected and stable.');
    } else {
      console.log('\n⚠️ Database connection issues detected.');
    }
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

// Run the health check
checkHealth();
