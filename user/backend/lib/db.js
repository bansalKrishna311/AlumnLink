import mongoose from 'mongoose';
let isConnectedBefore = false;
let listenersAttached = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Initial MongoDB connection established.');
  } catch (err) {
    console.error('❌ MongoDB initial connection error:', err);
    throw err;
  }
};

const setupEventListeners = () => {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('connected', () => {
    isConnectedBefore = true;
    console.log('✅ MongoDB connected');
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
  });
};

const isDbConnected = () => mongoose.connection.readyState === 1;

const reconnectDB = async () => {
  try {
    await mongoose.disconnect(); // clear any stale connections
    await connectDB();
  } catch (err) {
    console.error('❌ Reconnection failed:', err);
  }
};

export {
  connectDB as default,
  reconnectDB,
  setupEventListeners,
  isDbConnected
};
