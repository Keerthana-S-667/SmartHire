/**
 * JobSeekerProfile Model
 * Stores comprehensive candidate profiles including career history, education,
 * skills inventory, job preferences, and resume file metadata.
 */

const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, trim: true },
    degree: { type: String, trim: true },
    fieldOfStudy: { type: String, trim: true },
    startYear: { type: String },
    endYear: { type: String },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, trim: true },
    title: { type: String, trim: true },
    location: { type: String, trim: true },
    startDate: { type: String },
    endDate: { type: String },
    current: { type: Boolean, default: false },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    filePath: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const jobSeekerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      trim: true,
      required: [true, 'Full name is required'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    headline: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    experienceYears: {
      type: Number,
      min: 0,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    education: {
      type: [educationSchema],
      default: [],
    },
    experience: {
      type: [experienceSchema],
      default: [],
    },
    preferredRoles: {
      type: [String],
      default: [],
    },
    preferredLocations: {
      type: [String],
      default: [],
    },
    employmentTypes: {
      type: [String],
      default: ['Full-time'],
    },
    resume: {
      type: resumeSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const JobSeekerProfile = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);

module.exports = JobSeekerProfile;
