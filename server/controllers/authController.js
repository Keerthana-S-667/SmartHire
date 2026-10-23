/**
 * Authentication Controller
 * Handles user registration, login, session inspection (getMe), and logout.
 * Uses HTTP-only cookies to store JWT tokens securely.
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

/**
 * Helper: Signs a JWT token containing user ID and role.
 */
const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || 'smarthire_super_secret_jwt_key_2026_academic_demo';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ userId, role }, secret, { expiresIn });
};

/**
 * Helper: Attaches JWT token as an HTTP-only cookie to the response.
 */
const sendAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  // 7 days in milliseconds
  const maxAge = 7 * 24 * 60 * 60 * 1000;

  res.cookie('token', token, {
    httpOnly: true, // Prevents client-side JavaScript from reading the cookie (protects against XSS)
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'none' : 'lax', // CSRF protection
    maxAge,
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account (Job Seeker or Employer only)
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // 1. Validation: Required fields
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, confirmPassword, and role.',
      });
    }

    // 2. Validation: Role restriction (Admin accounts can NEVER be created via public registration)
    let normalizedRole = role.toLowerCase().trim().replace('-', '_');
    if (normalizedRole === 'jobseeker') normalizedRole = 'job_seeker';

    if (normalizedRole === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Security policy: Administrator accounts cannot be created via public registration.',
      });
    }

    if (!['job_seeker', 'employer'].includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role selected. Allowed public roles are "job_seeker" or "employer".',
      });
    }

    // 3. Validation: Password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match. Please re-enter your password.',
      });
    }

    // 4. Validation: Password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long for security.',
      });
    }

    // 5. Validation: Duplicate email check
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.',
      });
    }

    // 6. Password hashing using bcrypt
    const passwordHash = await User.hashPassword(password);

    // 7. Create user in MongoDB
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: normalizedRole,
    });

    // 8. Generate JWT and issue HTTP-only cookie
    const token = generateToken(newUser._id, newUser.role);
    sendAuthCookie(res, token);

    // 9. Respond with clean user profile (passwordHash omitted automatically)
    return res.status(201).json({
      success: true,
      message: 'Account registered successfully! Welcome to SmartHire.',
      token,
      user: newUser.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user credentials and issue HTTP-only session cookie
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validation: Required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // 2. Find user in database by normalized email
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Intentionally generic message to prevent account enumeration
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      });
    }

    // 3. Compare password with stored bcrypt hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      });
    }

    // 4. Generate JWT and issue HTTP-only cookie
    const token = generateToken(user._id, user.role);
    sendAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully! Welcome back.',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Retrieve the currently authenticated user's profile
 * @access  Protected (Requires valid JWT cookie)
 */
const getMe = async (req, res, next) => {
  try {
    // req.user was populated by authenticateUser middleware
    return res.status(200).json({
      success: true,
      user: req.user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Clear session cookie to log the user out
 * @access  Public / Protected
 */
const logout = async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully. Have a great day!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
