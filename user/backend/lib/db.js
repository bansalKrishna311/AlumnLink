// db.js
import mongoose from 'mongoose';

// Cache the database connection
let cachedConnection = null;
let isConnecting = false;

const connectDB = async () => {
  // If we have a cached connection, use it
  if (cachedConnection) {
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
    // Set strict connection timeout for Vercel
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      // These settings help with Vercel serverless functions
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000
    };

    // Start connecting
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    // Cache the connection
    cachedConnection = conn;
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Add event listeners for reconnection
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      cachedConnection = null;
    });
    
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
      cachedConnection = null;
    });
    
    return conn;
  } catch (error) {
    // Reset cached connection on error
    cachedConnection = null;
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

export default connectDB;
