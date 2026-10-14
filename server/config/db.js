/**
 * Database Configuration
 * Manages Mongoose connection to MongoDB with detailed error diagnostics.
 * Beginners Note: Mongoose is an ODM (Object Data Modeling) library for MongoDB
 * that makes it easy to define schemas, validate data, and run queries.
 */

const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connect to MongoDB using the connection string from environment variables.
 * If connection fails, logs clear instructions without crashing the Express server.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smarthire';

  try {
    // Attempt database connection with a 5-second server selection timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[MongoDB] Successfully connected to database: ${conn.connection.name} at ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.error('\n============================================================');
    console.error('[MongoDB Error] Could NOT connect to MongoDB!');
    console.error(`Target URI: ${uri}`);
    console.error(`Reason: ${error.message}`);
    console.error('Troubleshooting Tips:');
    console.error(' 1. Verify that MongoDB Community Server is installed.');
    console.error(' 2. Run "net start MongoDB" or "mongod" in a separate terminal.');
    console.error(' 3. Or configure a remote MongoDB Atlas URI in server/.env.');
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
