// db.js
import mongoose from 'mongoose';
import dbLogger from '../utils/dbLogger.js';

// Global connection state
let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If there's already a connection attempt in progress, wait for it
  if (connectionPromise) {
    try {
      await connectionPromise;
      return mongoose.connection;
    } catch (error) {
      // If the previous attempt failed, reset and try again
      connectionPromise = null;
    }
  }

  // Create new connection promise
  connectionPromise = createConnection();
  
  try {
    await connectionPromise;
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
};

const createConnection = async () => {
  try {
    // Optimized connection options for stability
    const options = {
      // Connection timeout settings
      serverSelectionTimeoutMS: 30000, // Increased to 30 seconds
      socketTimeoutMS: 60000, // Increased to 60 seconds
      connectTimeoutMS: 30000,
      
      // Connection pool settings
      maxPoolSize: 5, // Reduced pool size for serverless
      minPoolSize: 1, // Reduced minimum
      maxIdleTimeMS: 60000, // Increased idle time
      
      // Buffering and retry settings
      bufferCommands: false,
      
      // Heartbeat settings - less frequent to reduce load
      heartbeatFrequencyMS: 10000, // Every 10 seconds instead of 2
      
      // Auto reconnection
      retryWrites: true,
      retryReads: true,
    };

    // Disconnect any existing connection first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    console.log('Connecting to MongoDB...');
    dbLogger.info('Attempting MongoDB connection', { 
      mongoUri: process.env.MONGO_URI ? 'Present' : 'Missing',
      nodeEnv: process.env.NODE_ENV 
    });
    
    await mongoose.connect(process.env.MONGO_URI, options);
    
    isConnected = true;
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    dbLogger.info('MongoDB connection successful', {
      host: mongoose.connection.host,
      database: mongoose.connection.name
    });
    
    // Set up event listeners
    setupEventListeners();
    
  } catch (error) {
    isConnected = false;
    console.error(`MongoDB Connection Error: ${error.message}`);
    dbLogger.error('MongoDB connection failed', {
      error: error.message,
      code: error.code,
      mongoUri: process.env.MONGO_URI ? 'Present' : 'Missing'
    });
    throw error;
  }
};

const setupEventListeners = () => {
  // Remove existing listeners to prevent duplicates
  mongoose.connection.removeAllListeners();
  
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
    dbLogger.info('MongoDB connected event triggered');
    isConnected = true;
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    dbLogger.warn('MongoDB disconnected event triggered');
    isConnected = false;
    connectionPromise = null;
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    dbLogger.error('MongoDB error event triggered', { error: err.message });
    isConnected = false;
    connectionPromise = null;
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
    dbLogger.info('MongoDB reconnected event triggered');
    isConnected = true;
  });

  // Handle process termination
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
};

// Utility function to check connection health
export const isDbConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

// Utility function to force reconnect
export const reconnectDB = async () => {
  isConnected = false;
  connectionPromise = null;
  return await connectDB();
};

export default connectDB;
