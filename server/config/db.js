/**
 * Database Configuration
 * Manages Mongoose connection to MongoDB with detailed lifecycle diagnostics,
 * connection pooling, reconnection handling, and status inspection.
 */

const mongoose = require('mongoose');

let isConnected = false;
let listenersAttached = false;

/**
 * Attach Mongoose connection event listeners once.
 */
const attachListeners = () => {
  if (listenersAttached) return;

  mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log(`[MongoDB] Connection established with database: ${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[MongoDB] Connection runtime error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[MongoDB] Connection disconnected. Mongoose will attempt to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('[MongoDB] Connection re-established successfully.');
  });

  listenersAttached = true;
};

/**
 * Connect to MongoDB using the URI from environment variables.
 * Safe against duplicate connections and handles errors without crashing Express.
 */
const connectDB = async () => {
  // If already connected, avoid re-initiating connection
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose.connection;
  }

  attachListeners();

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smarthire';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[MongoDB] Successfully connected to database: ${conn.connection.name} at ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.error('\n============================================================');
    console.error('[MongoDB Error] Could NOT connect to MongoDB!');
    console.error(`Target URI: ${uri}`);
    console.error(`Reason: ${error.message}`);
    console.error('Troubleshooting Tips:');
    console.error(' 1. Verify that MongoDB Community Server is installed & running.');
    console.error(' 2. Verify port 27017 is active (e.g. net start MongoDB).');
    console.error('============================================================\n');
  }
};

/**
 * Helper to inspect the current database connection state.
 * Returns human-readable status for the /api/health endpoint.
 */
const getDBStatus = () => {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const readyState = mongoose.connection.readyState;
  return {
    state: stateMap[readyState] || 'unknown',
    isConnected: readyState === 1,
    database: mongoose.connection.name || null,
    host: mongoose.connection.host || null,
  };
};

module.exports = { connectDB, getDBStatus };
