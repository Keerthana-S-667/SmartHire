/**
 * Authentication and Role-Based Access Control (RBAC) Middleware
 *
 * Beginners Note:
 * Middleware functions in Express run BEFORE route controllers.
 * 1. authenticateUser: Verifies the JWT cookie and attaches the user object to req.user.
 * 2. authorizeRoles: Checks if the logged-in user possesses the required role(s).
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

/**
 * Verifies JWT token from HTTP-only cookie (or optional Authorization header).
 * Populates req.user with the active user record from MongoDB.
 */
const authenticateUser = async (req, res, next) => {
  try {
    let token = null;

    // 1. Primary authentication mechanism: HTTP-only cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Fallback: Bearer token in Authorization header (useful for API testing tools)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to access this resource.',
      });
    }

    // Verify token using server JWT secret
    const secret = process.env.JWT_SECRET || 'smarthire_super_secret_jwt_key_2026_academic_demo';
    const decoded = jwt.verify(token, secret);

    // Fetch user from database to ensure account still exists and role is current
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User session is no longer valid. Please log in again.',
      });
    }

    // Attach validated user to the request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token. Please log in again.',
    });
  }
};

/**
 * Role-Based Access Control (RBAC) guard.
 * Ensures the authenticated user has one of the specified allowed roles.
 * Never trusts role claims from client requests.
 *
 * @param  {...string} allowedRoles - e.g. 'admin', 'employer', 'job_seeker'
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking permissions.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of the following roles: [${allowedRoles.join(', ')}]. Your current role is "${req.user.role}".`,
      });
    }

    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
