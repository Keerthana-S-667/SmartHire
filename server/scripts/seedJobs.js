/**
 * Seed Initial Real Job Listings
 * Safely inserts initial open opportunities if none exist, without altering user accounts.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { User } = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');

const seedJobs = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smarthire';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // 1. Find or create an active employer
    let employer = await User.findOne({ role: 'employer' });

    if (!employer) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Password@123', salt);
      employer = await User.create({
        name: 'Alex Rivera',
        email: 'recruiter@acme-technologies.com',
        passwordHash,
        role: 'employer',
      });
      console.log('[Seed] Created employer account:', employer.email);
    }

    // 2. Ensure company profile exists
    let company = await Company.findOne({ user: employer._id });
    if (!company) {
      company = await Company.create({
        user: employer._id,
        companyName: 'Acme Enterprise Technologies',
        description: 'Pioneering intelligent enterprise platforms and developer productivity software.',
        industry: 'Technology',
        website: 'https://acme.example.com',
        location: 'Bengaluru, India',
        companySize: '51-200',
        contactEmail: employer.email,
        contactPhone: '+91 80 4123 4567',
      });
      console.log('[Seed] Created company profile:', company.companyName);
    }

    // 3. Define initial open jobs
    const initialJobs = [
      {
        employer: employer._id,
        company: company._id,
        companyName: company.companyName,
        title: 'Senior React & Frontend Engineer',
        description:
          'We are seeking an experienced Frontend Engineer with deep expertise in modern React architectures, state management, and accessible UI component systems to lead key user-facing features on our flagship enterprise application.',
        responsibilities: [
          'Design and maintain responsive, high-performance web components using modern React and Tailwind CSS',
          'Collaborate with product designers and backend engineers to define RESTful and real-time APIs',
          'Conduct code reviews, mentor junior developers, and uphold frontend testing standards',
          'Optimize web performance, client caching, and accessibility standards across devices',
        ],
        qualifications: [
          '4+ years of professional web development with React and JavaScript/TypeScript',
          'Strong command of modern CSS systems, responsive layout patterns, and browser performance profiling',
          'Experience with state management, client routing, and secure cookie/JWT authentication flows',
          'Bachelor’s degree in Computer Science, Software Engineering, or equivalent practical experience',
        ],
        skills: ['React', 'JavaScript', 'Tailwind CSS', 'REST APIs', 'Git', 'Vite'],
        location: 'Bengaluru, Karnataka',
        workplaceMode: 'Hybrid',
        employmentType: 'Full-time',
        experienceLevel: 'Senior Level',
        salaryMin: 1200000,
        salaryMax: 1800000,
        openings: 2,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'published',
      },
      {
        employer: employer._id,
        company: company._id,
        companyName: company.companyName,
        title: 'Backend Node.js & API Architect',
        description:
          'Join our core backend engineering team building scalable REST APIs, microservices, and asynchronous event processors. You will drive database architecture, security standards, and high-throughput application logic.',
        responsibilities: [
          'Develop resilient RESTful services and asynchronous processing workers using Node.js and Express',
          'Model and optimize MongoDB schemas, indexes, and aggregation pipelines for enterprise datasets',
          'Implement role-based authorization, rate limiting, and defensive input validation across all endpoints',
          'Manage integration testing suites, health checks, and server diagnostic logs',
        ],
        qualifications: [
          '3+ years building production backend applications with Node.js, Express, and MongoDB/Mongoose',
          'Strong understanding of asynchronous JavaScript, event loops, and database indexing strategies',
          'Demonstrated expertise in REST API security, HTTP-only cookies, and session lifecycle management',
        ],
        skills: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'REST APIs', 'Bcrypt', 'JWT'],
        location: 'Bengaluru, Karnataka',
        workplaceMode: 'Remote',
        employmentType: 'Full-time',
        experienceLevel: 'Mid Level',
        salaryMin: 900000,
        salaryMax: 1500000,
        openings: 3,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'published',
      },
      {
        employer: employer._id,
        company: company._id,
        companyName: company.companyName,
        title: 'Full Stack MERN Developer',
        description:
          'We are looking for a versatile Full Stack Developer comfortable moving across the entire stack—from developing responsive React interfaces to implementing Express controllers and MongoDB models.',
        responsibilities: [
          'Build end-to-end features integrating React user interfaces with Express and MongoDB services',
          'Implement interactive search filters, candidate application forms, and real-time dashboard widgets',
          'Participate in daily standups, sprint reviews, and technical refinement sessions',
        ],
        qualifications: [
          '2+ years working across the full MERN development stack',
          'Familiarity with clean code practices, component modularity, and Git version control',
          'Eagerness to take ownership of customer-facing features and deliver clean user experiences',
        ],
        skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Tailwind CSS'],
        location: 'Hyderabad, Telangana',
        workplaceMode: 'On-site',
        employmentType: 'Full-time',
        experienceLevel: 'Mid Level',
        salaryMin: 700000,
        salaryMax: 1200000,
        openings: 1,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'published',
      },
    ];

    for (const jobData of initialJobs) {
      const existing = await Job.findOne({ title: jobData.title, employer: employer._id });
      if (!existing) {
        await Job.create(jobData);
        console.log(`[Seed] Published job: "${jobData.title}"`);
      } else {
        existing.status = 'published';
        await existing.save();
        console.log(`[Seed] Ensured published: "${jobData.title}"`);
      }
    }

    console.log('[Seed] Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  }
};

seedJobs();
