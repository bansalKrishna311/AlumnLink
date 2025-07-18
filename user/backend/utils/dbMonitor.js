// Database monitoring utility
import mongoose from 'mongoose';
import { isDbConnected, reconnectDB } from '../lib/db.js';

class DatabaseMonitor {
  constructor() {
    this.isMonitoring = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3; // Reduced from 5 to 3
    this.reconnectDelay = 5000; // Start with 5 seconds instead of 1
    this.maxReconnectDelay = 60000; // Max 1 minute instead of 30 seconds
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('Database monitoring started');
    
    // Monitor connection every 2 minutes instead of 30 seconds
    this.monitorInterval = setInterval(() => {
      this.checkConnection();
    }, 120000);
    
    // Set up mongoose event listeners
    this.setupEventListeners();
  }

  stopMonitoring() {
    this.isMonitoring = false;
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
    console.log('Database monitoring stopped');
  }

  setupEventListeners() {
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected - attempting to reconnect...');
      this.handleDisconnection();
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB error:', err);
      this.handleDisconnection();
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000; // Reset delay
    });
  }

  async checkConnection() {
    if (!isDbConnected()) {
      console.log('Connection check failed - attempting reconnection');
      await this.handleDisconnection();
    }
  }

  async handleDisconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached. Manual intervention required.');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

    try {
      // Wait before attempting reconnection
      await new Promise(resolve => setTimeout(resolve, this.reconnectDelay));
      
      await reconnectDB();
      console.log('Database reconnection successful');
      
      // Reset attempts on successful reconnection
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      
    } catch (error) {
      console.error(`Reconnection attempt ${this.reconnectAttempts} failed:`, error.message);
      
      // Exponential backoff with jitter
      this.reconnectDelay = Math.min(
        this.reconnectDelay * 2 + Math.random() * 1000,
        this.maxReconnectDelay
      );
    }
  }

  getStatus() {
    return {
      isConnected: isDbConnected(),
      reconnectAttempts: this.reconnectAttempts,
      isMonitoring: this.isMonitoring,
      connectionState: mongoose.connection.readyState,
      connectionStates: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }
    };
  }
}

// Create singleton instance
const dbMonitor = new DatabaseMonitor();

export default dbMonitor;
