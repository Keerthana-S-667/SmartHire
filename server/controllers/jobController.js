/**
 * Job Controller
 * Handles job search, filtering, creation, updates, and lifecycle management.
 */

const Job = require('../models/Job');
const Company = require('../models/Company');
const { Application } = require('../models/Application');

/**
 * @route   GET /api/jobs
 * @desc    Search and filter published jobs with pagination
 * @access  Public
 */
const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      employmentType,
      workplaceMode,
      experienceLevel,
      salaryMin,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { status: 'published' };

    // Text / keyword search across title, skills, company name, location
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { skills: { $in: [searchRegex] } },
        { companyName: searchRegex },
        { location: searchRegex },
      ];
    }

    // Exact location filter
    if (location && location.trim()) {
      query.location = new RegExp(location.trim(), 'i');
    }

    // Employment type filter
    if (employmentType && employmentType !== 'all') {
      query.employmentType = employmentType;
    }

    // Workplace mode filter (On-site, Hybrid, Remote)
    if (workplaceMode && workplaceMode !== 'all') {
      query.workplaceMode = workplaceMode;
    }

    // Experience level filter
    if (experienceLevel && experienceLevel !== 'all') {
      query.experienceLevel = experienceLevel;
    }

    // Minimum salary threshold
    if (salaryMin && !isNaN(salaryMin)) {
      query.$or = [
        { salaryMax: { $gte: Number(salaryMin) } },
        { salaryMin: { $gte: Number(salaryMin) } },
      ];
    }

    // Sorting strategy
    let sortOptions = { createdAt: -1 }; // Newest first by default
    if (sort === 'salary_high') {
      sortOptions = { salaryMax: -1, createdAt: -1 };
    } else if (sort === 'salary_low') {
      sortOptions = { salaryMin: 1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [total, jobs] = await Promise.all([
      Job.countDocuments(query),
      Job.find(query)
        .populate('company', 'logoUrl industry companySize website')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/jobs/:id
 * @desc    Get detailed job posting by ID
 * @access  Public
 */
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'logoUrl industry companySize website location description')
      .populate('employer', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/jobs
 * @desc    Create a new job listing
 * @access  Private (Employer)
 */
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      responsibilities,
      qualifications,
      skills,
      location,
      workplaceMode,
      employmentType,
      experienceLevel,
      salaryMin,
      salaryMax,
      openings,
      deadline,
      status = 'published',
    } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and location are required fields',
      });
    }

    // Validate salary ranges if both are provided
    if (salaryMin !== undefined && salaryMax !== undefined && salaryMin !== null && salaryMax !== null) {
      if (Number(salaryMin) > Number(salaryMax)) {
        return res.status(400).json({
          success: false,
          message: 'Minimum salary cannot exceed maximum salary',
        });
      }
    }

    // Resolve employer's company
    let company = await Company.findOne({ user: req.user._id });
    const companyName = company ? company.companyName : (req.user.name || 'Hiring Organization');

    const job = await Job.create({
      employer: req.user._id,
      company: company ? company._id : null,
      companyName,
      title: title.trim(),
      description: description.trim(),
      responsibilities: Array.isArray(responsibilities) ? responsibilities.filter(Boolean) : [],
      qualifications: Array.isArray(qualifications) ? qualifications.filter(Boolean) : [],
      skills: Array.isArray(skills) ? skills.map((s) => String(s).trim()).filter(Boolean) : [],
      location: location.trim(),
      workplaceMode: workplaceMode || 'On-site',
      employmentType: employmentType || 'Full-time',
      experienceLevel: experienceLevel || 'Mid Level',
      salaryMin: salaryMin ? Number(salaryMin) : null,
      salaryMax: salaryMax ? Number(salaryMax) : null,
      openings: openings ? Math.max(1, parseInt(openings, 10)) : 1,
      deadline: deadline ? new Date(deadline) : null,
      status: ['published', 'draft'].includes(status) ? status : 'published',
    });

    return res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/jobs/:id
 * @desc    Update an existing job listing
 * @access  Private (Employer - Owner only)
 */
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    // Verify ownership
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit jobs created by your account',
      });
    }

    const {
      title,
      description,
      responsibilities,
      qualifications,
      skills,
      location,
      workplaceMode,
      employmentType,
      experienceLevel,
      salaryMin,
      salaryMax,
      openings,
      deadline,
      status,
    } = req.body;

    if (title !== undefined) job.title = title.trim();
    if (description !== undefined) job.description = description.trim();
    if (Array.isArray(responsibilities)) job.responsibilities = responsibilities.filter(Boolean);
    if (Array.isArray(qualifications)) job.qualifications = qualifications.filter(Boolean);
    if (Array.isArray(skills)) job.skills = skills.map((s) => String(s).trim()).filter(Boolean);
    if (location !== undefined) job.location = location.trim();
    if (workplaceMode !== undefined) job.workplaceMode = workplaceMode;
    if (employmentType !== undefined) job.employmentType = employmentType;
    if (experienceLevel !== undefined) job.experienceLevel = experienceLevel;

    if (salaryMin !== undefined) job.salaryMin = salaryMin ? Number(salaryMin) : null;
    if (salaryMax !== undefined) job.salaryMax = salaryMax ? Number(salaryMax) : null;

    if (job.salaryMin && job.salaryMax && job.salaryMin > job.salaryMax) {
      return res.status(400).json({
        success: false,
        message: 'Minimum salary cannot exceed maximum salary',
      });
    }

    if (openings !== undefined) job.openings = Math.max(1, parseInt(openings, 10));
    if (deadline !== undefined) job.deadline = deadline ? new Date(deadline) : null;
    if (status && ['published', 'draft', 'closed'].includes(status)) job.status = status;

    await job.save();

    return res.status(200).json({
      success: true,
      message: 'Job posting updated successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/jobs/:id/status
 * @desc    Change publication status (published, draft, closed)
 * @access  Private (Employer - Owner only, or Admin)
 */
const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['published', 'draft', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: published, draft, closed',
      });
    }

    const job = await Job.findById(req.params.id);

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
        message: 'Forbidden: You can only change status of jobs created by your account',
      });
    }

    job.status = status;
    await job.save();

    return res.status(200).json({
      success: true,
      message: `Job status updated to ${status}`,
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/jobs/employer/my-jobs
 * @desc    Get all jobs created by the authenticated employer
 * @access  Private (Employer)
 */
const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Attach up-to-date application counts directly from Application collection
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        return { ...job, applicationCount: count };
      })
    );

    return res.status(200).json({
      success: true,
      count: jobsWithCounts.length,
      jobs: jobsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  updateJobStatus,
  getMyJobs,
};
