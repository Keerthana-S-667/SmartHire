/**
 * Application Controller
 * Manages candidate job applications, duplicate prevention, status transitions,
 * employer review, and authorized resume downloads.
 */

const fs = require('fs');
const path = require('path');
const { Application, ALLOWED_APPLICATION_STATUSES } = require('../models/Application');
const Job = require('../models/Job');
const JobSeekerProfile = require('../models/JobSeekerProfile');

/**
 * @route   POST /api/applications
 * @desc    Submit an application for an open job posting
 * @access  Private (Job Seeker)
 */
const applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required to apply',
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'The requested job posting does not exist',
      });
    }

    // Ensure job is open for applications
    if (job.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: `This position is currently ${job.status} and cannot accept new applications`,
      });
    }

    // Check if application deadline has passed
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'The application deadline for this position has passed',
      });
    }

    // Prevent duplicate applications
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: `You have already applied for this position. Your current application status is "${existingApplication.status}".`,
        existingStatus: existingApplication.status,
      });
    }

    // Handle resume selection
    let resumeData = null;

    if (req.file) {
      // Use newly uploaded file with this application
      resumeData = {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path,
      };
    } else {
      // Fallback to active resume from JobSeekerProfile
      const profile = await JobSeekerProfile.findOne({ user: req.user._id });
      if (profile && profile.resume && profile.resume.filePath && fs.existsSync(profile.resume.filePath)) {
        resumeData = {
          fileName: profile.resume.fileName,
          originalName: profile.resume.originalName,
          filePath: profile.resume.filePath,
        };
      }
    }

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Please attach a resume file or upload one to your profile before applying',
      });
    }

    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      employer: job.employer,
      resume: resumeData,
      coverLetter: coverLetter ? coverLetter.trim() : '',
      status: 'Applied',
      appliedAt: new Date(),
      statusHistory: [
        {
          status: 'Applied',
          changedAt: new Date(),
          notes: 'Application submitted by candidate',
        },
      ],
    });

    // Update job application counter
    await Job.findByIdAndUpdate(job._id, { $inc: { applicationCount: 1 } });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: {
        _id: application._id,
        job: application.job,
        status: application.status,
        appliedAt: application.appliedAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position',
      });
    }
    next(error);
  }
};

/**
 * @route   GET /api/applications/my-applications
 * @desc    Get all applications submitted by the authenticated Job Seeker
 * @access  Private (Job Seeker)
 */
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        select: 'title companyName location workplaceMode employmentType status salaryMin salaryMax deadline',
      })
      .sort({ appliedAt: -1 })
      .lean();

    // Redact internal disk paths
    const sanitized = applications.map((app) => {
      const copy = { ...app };
      if (copy.resume) {
        delete copy.resume.filePath;
      }
      return copy;
    });

    return res.status(200).json({
      success: true,
      count: sanitized.length,
      applications: sanitized,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/applications/:id/withdraw
 * @desc    Withdraw a pending application
 * @access  Private (Job Seeker - Owner only)
 */
const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Ownership check
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only withdraw your own applications',
      });
    }

    if (application.status === 'Withdrawn') {
      return res.status(400).json({
        success: false,
        message: 'Application is already withdrawn',
      });
    }

    if (['Hired', 'Rejected'].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw an application that has already reached the final status of "${application.status}"`,
      });
    }

    application.status = 'Withdrawn';
    application.statusHistory.push({
      status: 'Withdrawn',
      changedAt: new Date(),
      notes: 'Application withdrawn by candidate',
    });

    await application.save();

    return res.status(200).json({
      success: true,
      message: 'Application has been successfully withdrawn',
      status: application.status,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/applications/job/:jobId
 * @desc    Get all applicants for a specific job listing
 * @access  Private (Employer - Owner only)
 */
const getJobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    // Ownership check
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only view applicants for your own job listings',
      });
    }

    const applications = await Application.find({ job: job._id })
      .populate('applicant', 'name email')
      .sort({ appliedAt: -1 })
      .lean();

    // Attach candidate profile details (skills, headline, experience)
    const enrichedApplicants = await Promise.all(
      applications.map(async (app) => {
        let profile = null;
        if (app.applicant && app.applicant._id) {
          profile = await JobSeekerProfile.findOne({ user: app.applicant._id })
            .select('headline location experienceYears skills education experience')
            .lean();
        }

        const appCopy = { ...app };
        if (appCopy.resume) {
          delete appCopy.resume.filePath;
        }

        return {
          ...appCopy,
          profile: profile || {},
        };
      })
    );

    return res.status(200).json({
      success: true,
      job: {
        _id: job._id,
        title: job.title,
        status: job.status,
        companyName: job.companyName,
      },
      count: enrichedApplicants.length,
      applicants: enrichedApplicants,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/applications/:id/status
 * @desc    Update applicant review status
 * @access  Private (Employer - Job Owner only)
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const allowedEmployerStatuses = [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Interview',
      'Rejected',
      'Hired',
    ];

    if (!allowedEmployerStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Permitted statuses: ${allowedEmployerStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id).populate('job', 'employer title');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Verify employer ownership of the job
    const jobOwnerId = application.job ? application.job.employer.toString() : application.employer.toString();
    if (jobOwnerId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update applications submitted to your job listings',
      });
    }

    if (application.status === 'Withdrawn') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update status of a withdrawn application',
      });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      changedAt: new Date(),
      notes: notes ? notes.trim() : `Status updated to ${status}`,
    });

    await application.save();

    return res.status(200).json({
      success: true,
      message: `Applicant status updated to "${status}"`,
      application: {
        _id: application._id,
        status: application.status,
        statusHistory: application.statusHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/applications/:id/resume
 * @desc    Securely download applicant resume for authorized party
 * @access  Private (Applicant, Owning Employer, or Admin)
 */
const downloadApplicationResume = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Authorization check
    const isApplicant = application.applicant.toString() === req.user._id.toString();
    const isEmployer = application.employer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isApplicant && !isEmployer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to access this resume',
      });
    }

    if (!application.resume || !application.resume.filePath) {
      return res.status(404).json({
        success: false,
        message: 'Resume record not found for this application',
      });
    }

    if (!fs.existsSync(application.resume.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Resume file does not exist on storage',
      });
    }

    return res.download(application.resume.filePath, application.resume.originalName);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/applications/employer/dashboard-stats
 * @desc    Calculate real metrics for the Employer Dashboard
 * @access  Private (Employer)
 */
const getEmployerDashboardStats = async (req, res, next) => {
  try {
    const employerId = req.user._id;

    // Fetch jobs created by this employer
    const jobs = await Job.find({ employer: employerId }).select('_id status title createdAt');
    const jobIds = jobs.map((j) => j._id);

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === 'published').length;
    const closedJobs = jobs.filter((j) => j.status === 'closed').length;

    // Applications aggregate
    const [totalApplications, pendingApplications, recentApplicants] = await Promise.all([
      Application.countDocuments({ job: { $in: jobIds } }),
      Application.countDocuments({
        job: { $in: jobIds },
        status: { $in: ['Applied', 'Under Review'] },
      }),
      Application.find({ job: { $in: jobIds } })
        .populate('applicant', 'name email')
        .populate('job', 'title')
        .sort({ appliedAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplications,
        pendingApplications,
        recentApplicants: recentApplicants.map((app) => ({
          _id: app._id,
          candidateName: app.applicant?.name || 'Applicant',
          candidateEmail: app.applicant?.email || '',
          jobTitle: app.job?.title || 'Job Posting',
          status: app.status,
          appliedAt: app.appliedAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getJobApplicants,
  updateApplicationStatus,
  downloadApplicationResume,
  getEmployerDashboardStats,
};
