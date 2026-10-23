/**
 * Application Model
 * Represents a job application submitted by a Job Seeker for a specific Job posting.
 * Enforces compound uniqueness to prevent duplicate applications and maintains audit history.
 */

const mongoose = require('mongoose');

const ALLOWED_APPLICATION_STATUSES = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Rejected',
  'Hired',
  'Withdrawn',
];

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ALLOWED_APPLICATION_STATUSES,
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resume: {
      fileName: { type: String, required: true },
      originalName: { type: String, required: true },
      filePath: { type: String, required: true },
    },
    coverLetter: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ALLOWED_APPLICATION_STATUSES,
      default: 'Applied',
      index: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: () => [{ status: 'Applied', changedAt: new Date(), notes: 'Application submitted' }],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: prevents duplicate applications for the same job by the same user
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = { Application, ALLOWED_APPLICATION_STATUSES };
