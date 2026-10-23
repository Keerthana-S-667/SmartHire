/**
 * Admin Controller
 * Provides platform metrics, moderation, and user/job oversight.
 * Exclusively for verified administrators.
 */

const { User } = require('../models/User');
const Job = require('../models/Job');
const { Application } = require('../models/Application');
const Company = require('../models/Company');
const { getDBStatus } = require('../config/db');

/**
 * @route   GET /api/admin/stats
 * @desc    Get aggregate platform metrics (users, jobs, applications, DB status)
 * @access  Private (Admin only)
 */
const getPlatformStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      jobSeekerCount,
      employerCount,
      adminCount,
      totalJobs,
      activeJobs,
      totalApplications,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'job_seeker' }),
      User.countDocuments({ role: 'employer' }),
      User.countDocuments({ role: 'admin' }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'published' }),
      Application.countDocuments(),
    ]);

    const dbStatus = getDBStatus();

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        jobSeekerCount,
        employerCount,
        adminCount,
        totalJobs,
        activeJobs,
        totalApplications,
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
 * @desc    Retrieve registered users list for administrative audit
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res, next) => {
  try {
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

/**
 * @route   PATCH /api/admin/users/:id/status
 * @desc    Toggle user active/deactivated state
 * @access  Private (Admin only)
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found',
      });
    }

    // Guard: Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Administrators cannot deactivate their own account',
      });
    }

    // Toggle active state
    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/jobs
 * @desc    List all job listings across platform for moderation
 * @access  Private (Admin only)
 */
const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({})
      .populate('employer', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/admin/jobs/:id/status
 * @desc    Moderate job posting status (e.g. close inappropriate job)
 * @access  Private (Admin only)
 */
const moderateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['published', 'closed', 'draft'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: published, closed, draft',
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    job.status = status;
    await job.save();

    return res.status(200).json({
      success: true,
      message: `Job listing status updated to ${status}`,
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/applications
 * @desc    List recent platform applications
 * @access  Private (Admin only)
 */
const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({})
      .populate('applicant', 'name email')
      .populate('job', 'title companyName')
      .sort({ appliedAt: -1 })
      .limit(100)
      .lean();

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  toggleUserStatus,
  getAllJobs,
  moderateJobStatus,
  getAllApplications,
};
