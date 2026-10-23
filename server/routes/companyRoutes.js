/**
 * Company Routes
 * Handles employer organizational profiles and public company views.
 */

const express = require('express');
const router = express.Router();
const {
  getMyCompany,
  updateMyCompany,
  getCompanyById,
} = require('../controllers/companyController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

// Public route to view company details
router.get('/:id', getCompanyById);

// Employer-only routes
router.use(authenticateUser);
router.use(authorizeRoles('employer'));

router.get('/me', getMyCompany);
router.put('/me', updateMyCompany);

module.exports = router;
