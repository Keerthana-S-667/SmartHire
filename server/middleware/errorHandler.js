/**
 * Centralized Error Handling Middleware
 * Catches errors passed via next(err) or thrown during request handling,
 * formatting them into predictable, user-friendly JSON responses.
 */

const errorHandler = (err, req, res, next) => {
  // Default status code and message
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // 1. Mongoose Duplicate Key Error (e.g. duplicate email, error code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account with this ${field} already exists. Please choose another or log in.`;
  }

  // 2. Mongoose Validation Errors (e.g. required field missing, regex fail)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join('. ');
  }

  // 3. Invalid Mongoose ObjectId format (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with specified ID: ${err.value}`;
  }

  // 4. JWT Verification Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired. Please log in again.';
  }

  // Log error for backend debugging (omitted in production response)
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error] ${statusCode} - ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
