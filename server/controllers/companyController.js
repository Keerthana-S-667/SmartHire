/**
 * Company Controller
 * Manages Employer organizational profiles and public company details.
 */

const Company = require('../models/Company');

/**
 * @route   GET /api/companies/me
 * @desc    Get authenticated employer's company profile (initializes if absent)
 * @access  Private (Employer)
 */
const getMyCompany = async (req, res, next) => {
  try {
    let company = await Company.findOne({ user: req.user._id });

    if (!company) {
      // Create initial company record using user's name
      company = await Company.create({
        user: req.user._id,
        companyName: req.user.name ? `${req.user.name}'s Organization` : 'My Company',
        contactEmail: req.user.email,
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/companies/me
 * @desc    Update employer's company profile
 * @access  Private (Employer)
 */
const updateMyCompany = async (req, res, next) => {
  try {
    const {
      companyName,
      description,
      industry,
      website,
      location,
      companySize,
      contactEmail,
      contactPhone,
      logoUrl,
    } = req.body;

    if (!companyName || !companyName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required',
      });
    }

    let company = await Company.findOne({ user: req.user._id });

    if (!company) {
      company = new Company({ user: req.user._id });
    }

    company.companyName = companyName.trim();
    if (description !== undefined) company.description = description.trim();
    if (industry !== undefined) company.industry = industry.trim();
    if (website !== undefined) company.website = website.trim();
    if (location !== undefined) company.location = location.trim();
    if (companySize !== undefined) company.companySize = companySize;
    if (contactEmail !== undefined) company.contactEmail = contactEmail.trim().toLowerCase();
    if (contactPhone !== undefined) company.contactPhone = contactPhone.trim();
    if (logoUrl !== undefined) company.logoUrl = logoUrl.trim();

    await company.save();

    return res.status(200).json({
      success: true,
      message: 'Company profile updated successfully',
      company,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/companies/:id
 * @desc    Get public company details by ID
 * @access  Public
 */
const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).select('-user');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCompany,
  updateMyCompany,
  getCompanyById,
};
