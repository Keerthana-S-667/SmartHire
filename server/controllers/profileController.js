/**
 * Profile Controller
 * Manages Job Seeker professional profiles, competencies, and secure resume assets.
 */

const fs = require('fs');
const path = require('path');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const { User } = require('../models/User');
const Job = require('../models/Job');
const { Application } = require('../models/Application');

/**
 * @route   GET /api/profiles/me
 * @desc    Retrieve the authenticated Job Seeker's profile (creates initial if absent)
 * @access  Private (Job Seeker)
 */
const getMyProfile = async (req, res, next) => {
  try {
    let profile = await JobSeekerProfile.findOne({ user: req.user._id });

    if (!profile) {
      // Initialize a clean starting profile using account details
      profile = await JobSeekerProfile.create({
        user: req.user._id,
        fullName: req.user.name,
      });
    }

    // Attach current user email for seamless UI display
    const profileObj = profile.toObject();
    profileObj.email = req.user.email;

    // Redact internal server disk path from resume object
    if (profileObj.resume) {
      delete profileObj.resume.filePath;
    }

    return res.status(200).json({
      success: true,
      profile: profileObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/profiles/me
 * @desc    Update Job Seeker profile fields
 * @access  Private (Job Seeker)
 */
const updateMyProfile = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      location,
      headline,
      bio,
      experienceYears,
      skills,
      education,
      experience,
      preferredRoles,
      preferredLocations,
      employmentTypes,
    } = req.body;

    let profile = await JobSeekerProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new JobSeekerProfile({ user: req.user._id, fullName: req.user.name });
    }

    // Update safe allowed profile fields
    if (fullName !== undefined) {
      profile.fullName = fullName.trim();
      // Keep User account name in sync
      await User.findByIdAndUpdate(req.user._id, { name: fullName.trim() });
    }
    if (phone !== undefined) profile.phone = phone.trim();
    if (location !== undefined) profile.location = location.trim();
    if (headline !== undefined) profile.headline = headline.trim();
    if (bio !== undefined) profile.bio = bio.trim();
    if (experienceYears !== undefined) profile.experienceYears = Number(experienceYears) || 0;
    if (Array.isArray(skills)) {
      profile.skills = skills.map((s) => String(s).trim()).filter(Boolean);
    }
    if (Array.isArray(education)) profile.education = education;
    if (Array.isArray(experience)) profile.experience = experience;
    if (Array.isArray(preferredRoles)) profile.preferredRoles = preferredRoles;
    if (Array.isArray(preferredLocations)) profile.preferredLocations = preferredLocations;
    if (Array.isArray(employmentTypes)) profile.employmentTypes = employmentTypes;

    await profile.save();

    const profileObj = profile.toObject();
    profileObj.email = req.user.email;
    if (profileObj.resume) delete profileObj.resume.filePath;

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: profileObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/profiles/resume
 * @desc    Upload or replace candidate resume document
 * @access  Private (Job Seeker)
 */
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid resume file (.pdf or .docx up to 5MB)',
      });
    }

    let profile = await JobSeekerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new JobSeekerProfile({ user: req.user._id, fullName: req.user.name });
    }

    // Clean up old resume file if one already exists
    if (profile.resume && profile.resume.filePath) {
      try {
        if (fs.existsSync(profile.resume.filePath)) {
          fs.unlinkSync(profile.resume.filePath);
        }
      } catch (err) {
        console.warn('Could not remove old resume file:', err.message);
      }
    }

    profile.resume = {
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      filePath: req.file.path,
      uploadedAt: new Date(),
    };

    await profile.save();

    return res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: {
        fileName: profile.resume.fileName,
        originalName: profile.resume.originalName,
        size: profile.resume.size,
        uploadedAt: profile.resume.uploadedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/profiles/resume
 * @desc    Remove candidate resume document
 * @access  Private (Job Seeker)
 */
const deleteResume = async (req, res, next) => {
  try {
    const profile = await JobSeekerProfile.findOne({ user: req.user._id });

    if (!profile || !profile.resume) {
      return res.status(404).json({
        success: false,
        message: 'No active resume found to remove',
      });
    }

    if (profile.resume.filePath && fs.existsSync(profile.resume.filePath)) {
      try {
        fs.unlinkSync(profile.resume.filePath);
      } catch (err) {
        console.warn('Could not remove resume file on disk:', err.message);
      }
    }

    profile.resume = null;
    await profile.save();

    return res.status(200).json({
      success: true,
      message: 'Resume removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/profiles/resume/download
 * @desc    Secure download of the authenticated Job Seeker's own resume
 * @access  Private (Job Seeker)
 */
const downloadMyResume = async (req, res, next) => {
  try {
    const profile = await JobSeekerProfile.findOne({ user: req.user._id });

    if (!profile || !profile.resume || !profile.resume.filePath) {
      return res.status(404).json({
        success: false,
        message: 'No resume document found for this account',
      });
    }

    if (!fs.existsSync(profile.resume.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Resume file no longer exists on server storage',
      });
    }

    return res.download(profile.resume.filePath, profile.resume.originalName);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/profiles/dashboard-stats
 * @desc    Get Job Seeker dashboard metrics and profile completion
 * @access  Private (Job Seeker)
 */
const getSeekerDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch candidate profile
    const profile = await JobSeekerProfile.findOne({ user: userId });

    // Calculate real profile completion percentage
    let completionPercentage = 0;
    if (profile) {
      if (profile.fullName) completionPercentage += 15;
      if (profile.headline) completionPercentage += 15;
      if (profile.location && profile.phone) completionPercentage += 15;
      if (profile.bio) completionPercentage += 15;
      if (profile.skills && profile.skills.length > 0) completionPercentage += 20;
      if (profile.resume && profile.resume.fileName) completionPercentage += 20;
    } else {
      completionPercentage = 20; // Basic account info exists
    }

    // Application counts
    const [totalApplications, underReviewCount, shortlistedCount, recentApplications, recommendedJobs] =
      await Promise.all([
        Application.countDocuments({ applicant: userId }),
        Application.countDocuments({ applicant: userId, status: 'Under Review' }),
        Application.countDocuments({
          applicant: userId,
          status: { $in: ['Shortlisted', 'Interview'] },
        }),
        Application.find({ applicant: userId })
          .populate('job', 'title companyName location workplaceMode employmentType status')
          .sort({ appliedAt: -1 })
          .limit(5)
          .lean(),
        Job.find({ status: 'published' })
          .sort({ createdAt: -1 })
          .limit(4)
          .lean(),
      ]);

    return res.status(200).json({
      success: true,
      stats: {
        profileCompletion: Math.min(100, completionPercentage),
        totalApplications,
        underReviewCount,
        shortlistedCount,
        recentApplications: recentApplications.map((app) => ({
          _id: app._id,
          jobId: app.job?._id,
          jobTitle: app.job?.title || 'Job Posting',
          companyName: app.job?.companyName || 'Company',
          location: app.job?.location || 'Remote',
          status: app.status,
          appliedAt: app.appliedAt,
        })),
        recommendedJobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadResume,
  deleteResume,
  downloadMyResume,
  getSeekerDashboardStats,
};

