/**
 * Profile Routes
 * Handles Job Seeker profile management and resume file operations.
 */

const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  uploadResume,
  deleteResume,
  downloadMyResume,
  getSeekerDashboardStats,
} = require('../controllers/profileController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');
const { uploadResume: uploadMiddleware } = require('../middleware/uploadMiddleware');

// All profile endpoints require authentication and 'job_seeker' role
router.use(authenticateUser);
router.use(authorizeRoles('job_seeker'));

router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);
router.get('/dashboard-stats', getSeekerDashboardStats);
router.post('/resume', uploadMiddleware.single('resume'), uploadResume);
router.delete('/resume', deleteResume);
router.get('/resume/download', downloadMyResume);

module.exports = router;
