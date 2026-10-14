/**
 * Admin Controller
 * Provides platform metrics and user management exclusively for administrators.
 * Security: Protected by authenticateUser and authorizeRoles('admin').
 */

const { User } = require('../models/User');
const { getDBStatus } = require('../config/db');

/**
 * @route   GET /api/admin/stats
 * @desc    Get aggregate platform metrics (user counts by role, DB status)
 * @access  Private (Admin only)
 */
const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const jobSeekerCount = await User.countDocuments({ role: 'job_seeker' });
    const employerCount = await User.countDocuments({ role: 'employer' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    const dbStatus = getDBStatus();

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        jobSeekerCount,
        employerCount,
        adminCount,
      },
      system: {
        database: dbStatus,
        nodeVersion: process.version,
        uptimeSeconds: Math.floor(process.uptime()),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Retrieve list of registered users for administrative audit
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    // Fetch users sorted newest first, excluding password hashes
    const users = await User.find({})
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
};
