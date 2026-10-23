/**
 * Job Model
 * Stores job listings created by employers with search indexes, status states,
 * requirements, compensation ranges, and application deadlines.
 */

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    qualifications: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      index: true,
    },
    workplaceMode: {
      type: String,
      enum: ['On-site', 'Hybrid', 'Remote'],
      default: 'On-site',
      index: true,
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'],
      default: 'Full-time',
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Manager', 'Executive'],
      default: 'Mid Level',
      index: true,
    },
    salaryMin: {
      type: Number,
      min: 0,
      default: null,
    },
    salaryMax: {
      type: Number,
      min: 0,
      default: null,
    },
    openings: {
      type: Number,
      min: 1,
      default: 1,
    },
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'closed'],
      default: 'published',
      index: true,
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for powerful job search across title, skills, location, and description
jobSchema.index({
  title: 'text',
  skills: 'text',
  companyName: 'text',
  location: 'text',
  description: 'text',
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
