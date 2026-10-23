/**
 * Application Routes
 * Handles job applications, status updates, withdrawals, and resume downloads.
 */

const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getJobApplicants,
  updateApplicationStatus,
  downloadApplicationResume,
  getEmployerDashboardStats,
} = require('../controllers/applicationController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');
const { uploadResume: uploadMiddleware } = require('../middleware/uploadMiddleware');

// All application routes require authentication
router.use(authenticateUser);

// Job Seeker routes
router.post('/', authorizeRoles('job_seeker'), uploadMiddleware.single('resume'), applyForJob);
router.get('/my-applications', authorizeRoles('job_seeker'), getMyApplications);
router.patch('/:id/withdraw', authorizeRoles('job_seeker'), withdrawApplication);

// Employer routes
router.get('/employer/dashboard-stats', authorizeRoles('employer'), getEmployerDashboardStats);
router.get('/job/:jobId', authorizeRoles('employer', 'admin'), getJobApplicants);
router.patch('/:id/status', authorizeRoles('employer', 'admin'), updateApplicationStatus);

// Authorized resume download (Applicant, Job Employer, Admin)
router.get('/:id/resume', downloadApplicationResume);

module.exports = router;
