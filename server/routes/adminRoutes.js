/**
 * Admin Routes
 * Protected endpoints restricted to users with the 'admin' role.
 */

const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getAllUsers,
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

module.exports = router;
