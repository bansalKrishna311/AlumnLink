// db.js - OPTIMIZED FOR MEMORY AND PERFORMANCE
import mongoose from 'mongoose';

// Cache the database connection
let cachedConnection = null;
let isConnecting = false;
let lastActivity = Date.now();

// Simplified connection health tracking
let connectionHealth = {
  isHealthy: true,
  lastPing: Date.now(),
  consecutiveFailures: 0
};

const connectDB = async () => {
  // If we have a cached connection and it's healthy, use it
  if (cachedConnection && connectionHealth.isHealthy && mongoose.connection.readyState === 1) {
    updateLastActivity();
    return cachedConnection;
  }

  // If already connecting, wait for that connection
  if (isConnecting) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Reduced wait time
    return connectDB();
  }

  // Set connecting flag
  isConnecting = true;

  try {
    // Highly optimized settings for production performance
    const options = {
      // Connection timeouts - optimized for speed
      serverSelectionTimeoutMS: 8000, // Reduced from 12000
      socketTimeoutMS: 30000, // Reduced from 60000
      connectTimeoutMS: 8000, // Reduced from 15000
      
      // Connection pool settings - optimized for memory
      maxPoolSize: 2, // Reduced from 3 for better memory usage
      minPoolSize: 1, 
      maxIdleTimeMS: 30000, // Reduced from 60000 to free connections faster
      
      // Keep-alive settings - less aggressive
      heartbeatFrequencyMS: 20000, // Increased from 10000
      
      // Index and collection management
      autoIndex: false, // Disabled for production performance
      autoCreate: false, 
      
      // Network settings
      family: 4, 
      
      // Retry settings - more conservative
      retryWrites: true,
      retryReads: false, // Disabled to reduce overhead
    };

    // Set Mongoose-specific options for memory optimization
    mongoose.set('bufferCommands', false);
    mongoose.set('maxTimeMS', 10000); // Add query timeout

    // Start connecting
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    // Cache the connection
    cachedConnection = conn;
    connectionHealth.isHealthy = true;
    connectionHealth.consecutiveFailures = 0;
    updateLastActivity();
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Set up simplified connection event listeners
    setupConnectionEventListeners();
    
    return conn;
  } catch (error) {
    // Reset cached connection on error
    cachedConnection = null;
    connectionHealth.isHealthy = false;
    connectionHealth.consecutiveFailures++;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    throw error;
  } finally {
    isConnecting = false;
  }
};

// Simplified connection event listeners
const setupConnectionEventListeners = () => {
  // Remove any existing listeners to prevent memory leaks
  mongoose.connection.removeAllListeners('connected');
  mongoose.connection.removeAllListeners('disconnected');
  mongoose.connection.removeAllListeners('error');
  mongoose.connection.removeAllListeners('reconnected');

  mongoose.connection.on('connected', () => {
    console.log('🔗 MongoDB connected successfully');
    connectionHealth.isHealthy = true;
    connectionHealth.consecutiveFailures = 0;
    updateLastActivity();
  });

  mongoose.connection.on('disconnected', () => {
    console.log('🔌 MongoDB disconnected');
    cachedConnection = null;
    connectionHealth.isHealthy = false;
  });
  
  mongoose.connection.on('error', err => {
    console.error('🚨 MongoDB connection error:', err.message);
    cachedConnection = null;
    connectionHealth.isHealthy = false;
    connectionHealth.consecutiveFailures++;
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
    connectionHealth.isHealthy = true;
    connectionHealth.consecutiveFailures = 0;
    updateLastActivity();
  });
};

// Update last activity timestamp
const updateLastActivity = () => {
  lastActivity = Date.now();
};

// Simplified connection health check
const isConnectionHealthy = () => {
  return connectionHealth.isHealthy && 
         mongoose.connection.readyState === 1 &&
         (Date.now() - lastActivity) < 300000; // 5 minutes
};

// Optimized graceful shutdown
const gracefulShutdown = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('🛑 MongoDB connection closed gracefully');
    }
    cachedConnection = null;
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
  }
};

// Handle process termination
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export default connectDB;
export { isConnectionHealthy, gracefulShutdown, updateLastActivity };
