// db.js
import mongoose from 'mongoose';

// Cache the database connection
let cachedConnection = null;
let isConnecting = false;
let keepAliveInterval = null;
let lastActivity = Date.now();

// Keep track of connection health
let connectionHealth = {
  isHealthy: true,
  lastPing: Date.now(),
  consecutiveFailures: 0
};

const connectDB = async () => {
  // If we have a cached connection and it's healthy, use it
  if (cachedConnection && connectionHealth.isHealthy) {
    updateLastActivity();
    return cachedConnection;
  }

  // If already connecting, wait for that connection
  if (isConnecting) {
    // Wait for the existing connection attempt to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    return connectDB();
  }

  // Set connecting flag
  isConnecting = true;

  try {
    // Optimized settings for MongoDB Atlas M0 free tier
    const options = {
      // Connection timeouts - tuned for M0 shared infrastructure
      serverSelectionTimeoutMS: 12000, // Increased for shared tier response
      socketTimeoutMS: 60000, // Extended for network variability
      connectTimeoutMS: 15000, // More time for initial connection
      
      // Connection pool settings optimized for M0 tier (100 connection limit)
      maxPoolSize: 3, // Conservative for free tier to avoid exhaustion
      minPoolSize: 1, // Always keep one connection ready
      maxIdleTimeMS: 60000, // Keep connections alive longer (1 minute)
      
      // Keep-alive settings - crucial for M0 tier
      heartbeatFrequencyMS: 10000, // Ping every 10 seconds (less aggressive)
      
      // Index and collection management
      autoIndex: process.env.NODE_ENV !== 'production', // Only in development
      autoCreate: false, // Don't create collections automatically
      
      // Network stability settings for shared infrastructure
      family: 4, // Use IPv4, skip trying IPv6
      
      // Retry and error handling
      retryWrites: true, // Enable retry for write operations
      retryReads: true, // Enable retry for read operations
    };

    // Set Mongoose-specific options separately
    mongoose.set('bufferCommands', false);

    // Start connecting
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    // Cache the connection
    cachedConnection = conn;
    connectionHealth.isHealthy = true;
    connectionHealth.consecutiveFailures = 0;
    updateLastActivity();
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up connection event listeners
    setupConnectionEventListeners();
    
    // Start keep-alive mechanism
    startKeepAlive();
    
    return conn;
  } catch (error) {
    // Reset cached connection on error
    cachedConnection = null;
    connectionHealth.isHealthy = false;
    connectionHealth.consecutiveFailures++;
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    // Don't throw in production to prevent function crashes
    if (process.env.NODE_ENV === 'production') {
      console.error('Failed to connect to MongoDB, but continuing execution');
      return null;
    } else {
      throw error;
    }
  } finally {
    isConnecting = false;
  }
};

// Setup connection event listeners
const setupConnectionEventListeners = () => {
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
    connectionHealth.isHealthy = true;
    connectionHealth.consecutiveFailures = 0;
    updateLastActivity();
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    cachedConnection = null;
    connectionHealth.isHealthy = false;
    
    // Attempt reconnection after a delay
    setTimeout(() => {
      if (!cachedConnection) {
        console.log('Attempting to reconnect to MongoDB...');
        connectDB().catch(err => {
          console.error('Reconnection attempt failed:', err);
        });
      }
    }, 5000);
  });
  
  mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
    cachedConnection = null;
    connectionHealth.isHealthy = false;
    connectionHealth.consecutiveFailures++;
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
    connectionHealth.isHealthy = true;
    connectionHealth.consecutiveFailures = 0;
    updateLastActivity();
  });
};

// Update last activity timestamp
const updateLastActivity = () => {
  lastActivity = Date.now();
};

// Keep-alive mechanism to prevent connection timeouts on M0 tier
const startKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }

  keepAliveInterval = setInterval(async () => {
    try {
      // Check if connection is still valid
      if (mongoose.connection.readyState !== 1) {
        console.log('Connection not ready for keep-alive ping');
        return;
      }

      // Only ping if there's been recent activity (within last 10 minutes) or if it's been too long since last ping
      const timeSinceLastActivity = Date.now() - lastActivity;
      const timeSinceLastPing = Date.now() - (connectionHealth.lastPing || 0);
      const tenMinutes = 10 * 60 * 1000;
      const fiveMinutes = 5 * 60 * 1000;
      
      // Ping if there's recent activity OR if it's been more than 5 minutes since last ping
      if (timeSinceLastActivity < tenMinutes || timeSinceLastPing > fiveMinutes) {
        // Use the most lightweight operation possible
        const startTime = Date.now();
        await mongoose.connection.db.command({ ping: 1 });
        const pingTime = Date.now() - startTime;
        
        connectionHealth.lastPing = Date.now();
        connectionHealth.isHealthy = true;
        connectionHealth.consecutiveFailures = 0;
        updateLastActivity();
        
        console.log(`MongoDB keep-alive ping successful (${pingTime}ms)`);
        
        // If ping is consistently slow, warn about potential issues
        if (pingTime > 5000) {
          console.warn(`Slow ping detected (${pingTime}ms) - M0 tier may be under load`);
        }
      }
    } catch (error) {
      console.error('Keep-alive ping failed:', error.message);
      connectionHealth.isHealthy = false;
      connectionHealth.consecutiveFailures++;
      
      // Progressive backoff for M0 tier stability
      if (connectionHealth.consecutiveFailures >= 3) {
        console.log(`${connectionHealth.consecutiveFailures} consecutive failures, attempting connection reset`);
        cachedConnection = null;
        
        // Exponential backoff for reconnection attempts
        const backoffDelay = Math.min(connectionHealth.consecutiveFailures * 2000, 30000);
        setTimeout(async () => {
          try {
            console.log('Attempting to reconnect after backoff...');
            await connectDB();
          } catch (reconnectError) {
            console.error('Reconnection failed:', reconnectError.message);
          }
        }, backoffDelay);
      }
    }
  }, 45000); // Ping every 45 seconds (less aggressive for M0 tier)
};

// Function to check connection health
const isConnectionHealthy = () => {
  return connectionHealth.isHealthy && 
         mongoose.connection.readyState === 1 &&
         (Date.now() - connectionHealth.lastPing) < 60000; // Healthy if pinged within last minute
};

// Function to force reconnection
const forceReconnect = async () => {
  try {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    cachedConnection = null;
    connectionHealth.isHealthy = false;
    
    return await connectDB();
  } catch (error) {
    console.error('Force reconnection failed:', error);
    throw error;
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('MongoDB connection closed gracefully');
    }
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
  }
};

// Handle process termination
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // For nodemon restarts

export default connectDB;
export { isConnectionHealthy, forceReconnect, gracefulShutdown, updateLastActivity };
