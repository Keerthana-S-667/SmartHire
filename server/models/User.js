/**
 * User Model
 * Defines schema, validation, and security rules for SmartHire users.
 * Roles supported:
 *  - 'job_seeker': Looking for jobs, resumes & matching (Stage 2)
 *  - 'employer': Posting jobs & evaluating talent (Stage 2)
 *  - 'admin': Platform monitoring & administration
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Allowed roles enumeration
const ALLOWED_ROLES = ['job_seeker', 'employer', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true, // Normalizes email to lowercase
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address format',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      minlength: 6,
    },
    role: {
      type: String,
      required: [true, 'User role is required'],
      enum: {
        values: ALLOWED_ROLES,
        message: 'Role must be one of: job_seeker, employer, admin',
      },
      default: 'job_seeker',
    },
  },
  {
    timestamps: true, // Automatically provides createdAt and updatedAt
  }
);

/**
 * Mongoose toJSON transform:
 * Ensures the passwordHash is NEVER exposed in API responses or serialized JSON.
 */
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

/**
 * Helper instance method:
 * Compares a plain-text candidate password with the stored bcrypt hash.
 * @param {string} candidatePassword - Plain text password provided during login
 * @returns {Promise<boolean>} True if match, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Static helper to hash a plain password before storing.
 * @param {string} plainPassword
 * @returns {Promise<string>} Salted bcrypt hash
 */
userSchema.statics.hashPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
};

const User = mongoose.model('User', userSchema);

module.exports = { User, ALLOWED_ROLES };
