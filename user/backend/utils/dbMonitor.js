import {
  reconnectDB,
  setupEventListeners
} from '../lib/db.js';
import mongoose from 'mongoose';

class DBMonitor {
  constructor() {
    this.reconnectAttempts = 0;
    this.maxAttempts = 10;
    this.reconnectDelay = 3000; // 3 seconds
    this.reconnecting = false;
  }

  start() {
    setupEventListeners();
    this.monitor();
  }

  monitor() {
    mongoose.connection.on('disconnected', () => {
      this.handleDisconnection();
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error detected in monitor:', err);
    });

    mongoose.connection.on('connected', () => {
      // Reset reconnection attempts on successful connection
      this.reconnectAttempts = 0;
      this.reconnecting = false;
    });

    mongoose.connection.on('reconnected', () => {
      // Reset reconnection attempts on successful reconnection
      this.reconnectAttempts = 0;
      this.reconnecting = false;
    });
  }

  async handleDisconnection() {
    if (this.reconnecting) return;
    this.reconnecting = true;

    while (this.reconnectAttempts < this.maxAttempts) {
      try {
        console.log(`🔁 Attempting MongoDB reconnection... (${this.reconnectAttempts + 1})`);
        await reconnectDB();
        console.log('✅ MongoDB reconnected successfully');
        this.reconnectAttempts = 0;
        break;
      } catch (err) {
        this.reconnectAttempts++;
        console.error(`❌ Reconnection attempt ${this.reconnectAttempts} failed`);
        await new Promise(res => setTimeout(res, this.reconnectDelay));
      }
    }

    if (this.reconnectAttempts >= this.maxAttempts) {
      console.error('💥 Max MongoDB reconnection attempts reached. Manual intervention required.');
    }

    this.reconnecting = false;
  }

  getStatus() {
    return {
      isConnected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      reconnectAttempts: this.reconnectAttempts,
      reconnecting: this.reconnecting,
      maxAttempts: this.maxAttempts,
      timestamp: new Date().toISOString()
    };
  }
}

export default new DBMonitor();
