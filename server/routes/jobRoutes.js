/**
 * Job Routes
 * Handles public job searching and employer job management.
 */

const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  updateJobStatus,
  getMyJobs,
} = require('../controllers/jobController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

// Public job browsing
router.get('/', getJobs);

// Employer: Get owned jobs (must precede `/:id` route)
router.get('/employer/my-jobs', authenticateUser, authorizeRoles('employer'), getMyJobs);

// Public: Get single job details
router.get('/:id', getJobById);

// Employer operations
router.post('/', authenticateUser, authorizeRoles('employer'), createJob);
router.put('/:id', authenticateUser, authorizeRoles('employer'), updateJob);
router.patch('/:id/status', authenticateUser, authorizeRoles('employer', 'admin'), updateJobStatus);

module.exports = router;
