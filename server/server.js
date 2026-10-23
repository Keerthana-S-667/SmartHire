/**
 * SmartHire Backend Server Entry Point
 * Technology Stack: Node.js + Express.js + Mongoose + JWT (HTTP-only cookies)
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables before importing modules that rely on them
dotenv.config();

const { connectDB, getDBStatus } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// -------------------------------------------------------------
// Core Middleware Configuration
// -------------------------------------------------------------

// 1. Cross-Origin Resource Sharing (CORS) configured for cookie and token exchange
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true, // Crucial: allows browser to send and receive HTTP-only cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 2. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookie parser for reading incoming HTTP-only cookies
app.use(cookieParser());

// -------------------------------------------------------------
// Health Check Endpoint
// -------------------------------------------------------------
/**
 * @route   GET /api/health
 * @desc    Inspect server and database status without exposing secrets
 * @access  Public
 */
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  const isHealthy = dbStatus.isConnected;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    server: 'SmartHire API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus.state,
      connected: dbStatus.isConnected,
    },
  });
});

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

// -------------------------------------------------------------
// 404 Handler for Undefined Endpoints
// -------------------------------------------------------------
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
  });
});

// -------------------------------------------------------------
// Centralized Error Handler Middleware
// -------------------------------------------------------------
app.use(errorHandler);

// -------------------------------------------------------------
// Server Initialization
// -------------------------------------------------------------
const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Start Express listener
  app.listen(PORT, () => {
    console.log(`\n============================================================`);
    console.log(`SmartHire API running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`Server URL:   http://localhost:${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log(`Client URL:   ${CLIENT_URL}`);
    console.log(`============================================================\n`);
  });
};

startServer();

module.exports = app;
