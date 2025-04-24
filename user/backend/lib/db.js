// db.js
import mongoose from 'mongoose';

// Track the connection state
let isConnected = false;

const connectDB = async () => {
	if (isConnected) {
		console.log('Using existing database connection');
		return;
	}

	try {
		// Set mongoose options optimized for serverless environments
		const options = {
			serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
			socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
		};

		// Connect to MongoDB
		const conn = await mongoose.connect(process.env.MONGO_URI, options);
		
		isConnected = true;
		console.log(`MongoDB Connected: ${conn.connection.host}`);
		
		// Handle connection errors after initial connection
		mongoose.connection.on('error', (err) => {
			console.log('MongoDB connection error:', err);
			isConnected = false;
		});
		
		return conn;
	} catch (error) {
		console.error(`MongoDB Connection Error: ${error.message}`);
		// Don't exit process in serverless environment
		isConnected = false;
		throw error;
	}
};

export default connectDB;
