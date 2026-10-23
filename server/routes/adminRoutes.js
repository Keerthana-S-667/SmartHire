/**
 * Admin Routes
 * Protected endpoints restricted to authenticated users with the 'admin' role.
 */

const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getAllUsers,
  toggleUserStatus,
  getAllJobs,
  moderateJobStatus,
  getAllApplications,
} = require('../controllers/adminController');
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// All admin routes require a valid session AND the 'admin' role
router.use(authenticateUser);
router.use(authorizeRoles('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.get('/jobs', getAllJobs);
router.patch('/jobs/:id/status', moderateJobStatus);
router.get('/applications', getAllApplications);

module.exports = router;
