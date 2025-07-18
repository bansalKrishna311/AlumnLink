// Test script for database connection
import dotenv from 'dotenv';
import connectDB, { isDbConnected } from '../lib/db.js';
import dbMonitor from '../utils/dbMonitor.js';

dotenv.config();

async function testConnection() {
  console.log('Starting database connection test...');
  
  try {
    // Test initial connection
    await connectDB();
    console.log('✅ Initial connection successful');
    
    // Check connection status
    const connected = isDbConnected();
    console.log(`✅ Connection status: ${connected ? 'Connected' : 'Disconnected'}`);
    
    // Start monitoring
    dbMonitor.startMonitoring();
    console.log('✅ Database monitoring started');
    
    // Get detailed status
    const status = dbMonitor.getStatus();
    console.log('✅ Database status:', JSON.stringify(status, null, 2));
    
    // Wait for a few seconds to see if connection stays stable
    console.log('Waiting 10 seconds to test connection stability...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    const finalStatus = dbMonitor.getStatus();
    console.log('✅ Final status:', JSON.stringify(finalStatus, null, 2));
    
    console.log('✅ Database connection test completed successfully');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
  } finally {
    dbMonitor.stopMonitoring();
    process.exit(0);
  }
}

// Run the test
testConnection();
