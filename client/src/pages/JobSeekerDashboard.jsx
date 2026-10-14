/**
 * Job Seeker Dashboard
 * Dedicated portal view for registered job applicants.
 * Clearly articulates current foundation state vs. planned Stage 2 AI features.
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import {
  User,
  Sparkles,
  FileText,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';

const JobSeekerDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.name || 'Candidate'}`}
      subtitle="Your SmartHire Job Seeker Workspace • Stage 1 Foundation Setup"
    >
      <div className="space-y-8">
        
        {/* Banner: Foundation Notice */}
        <div className="p-4 rounded-xl bg-blue-100/70 border border-blue-200 text-blue-800 flex items-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold">Stage 1 Foundation Active: </span>
            Your account is authenticated via secure HTTP-only cookies with verified database role 
            <span className="font-semibold underline ml-1">job_seeker</span>.
            Resume parsing, algorithmic scoring, and job applications are planned for Stage 2.
          </div>
        </div>

        {/* Grid: Profile Completion & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Profile Progress Placeholder */}
          <div className="card-container md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-content-primary">Candidate Profile Setup</h3>
                  <p className="text-xs text-content-secondary">Core Account Registered</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                Step 1 of 3 Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-content-secondary">
                <span>Registration Complete</span>
                <span>35%</span>
              </div>
              <div className="w-full bg-blue-100/80 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-500 h-2.5 rounded-full w-[35%]"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-surface-bg rounded-lg border border-brandBorder flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span className="text-content-primary font-medium">Email Verified & Active</span>
              </div>
              <div className="p-3 bg-surface-bg rounded-lg border border-brandBorder flex items-center gap-2 text-content-secondary">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Resume Upload (Stage 2)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Applications Tracker Placeholder */}
          <div className="card-container space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-content-primary">Applications</h3>
              </div>
              <span className="badge-roadmap">Stage 2</span>
            </div>

            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-blue-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-content-primary">No Active Applications</p>
              <p className="text-xs text-content-secondary max-w-xs mx-auto">
                Application submissions and live progress tracking pipelines will be activated in Stage 2.
              </p>
            </div>
          </div>

        </div>

        {/* Section: Skills & Competencies Placeholder */}
        <div className="card-container space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brandBorder pb-4">
            <div>
              <h3 className="font-bold text-lg text-content-primary flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500" />
                <span>Extracted Skills Inventory</span>
              </h3>
              <p className="text-xs text-content-secondary">
                Skills extracted from your future resume will be categorized and cross-referenced with employer openings.
              </p>
            </div>
            <span className="badge-roadmap self-start sm:self-auto">Planned Feature</span>
          </div>

          <div className="p-6 bg-surface-bg rounded-xl border border-dashed border-brandBorder text-center space-y-3">
            <Sparkles className="w-8 h-8 text-blue-400 mx-auto" />
            <p className="text-sm font-medium text-content-primary">
              AI Skill Extraction Engine arriving in Stage 2
            </p>
            <p className="text-xs text-content-secondary max-w-md mx-auto">
              Once enabled, you will be able to upload PDF or DOCX resumes. SmartHire will extract hard and soft skills, generate candidate embeddings, and compute match fidelity.
            </p>
          </div>
        </div>

        {/* Section: Recommended Opportunities Placeholder */}
        <div className="card-container space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brandBorder pb-4">
            <div>
              <h3 className="font-bold text-lg text-content-primary flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-500" />
                <span>Recommended Job Openings</span>
              </h3>
              <p className="text-xs text-content-secondary">
                Personalized opportunities matched deterministically against your experience.
              </p>
            </div>
            <span className="badge-roadmap self-start sm:self-auto">Coming Soon</span>
          </div>

          {/* Placeholders clearly communicating future functionality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Full-Stack JavaScript Engineer',
                company: 'TechCorp Solutions',
                type: 'Stage 2 Preview',
                desc: 'Candidate matching algorithm will score your compatibility based on React, Node.js and MongoDB.',
              },
              {
                title: 'Frontend UI/UX Developer',
                company: 'Innovate Digital',
                type: 'Stage 2 Preview',
                desc: 'Tailwind CSS and component design evaluation matched against your verified portfolio.',
              },
            ].map((mock, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-surface-bg border border-brandBorder flex flex-col justify-between space-y-3 opacity-80"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                      {mock.type}
                    </span>
                    <span className="text-xs text-content-secondary">Matching Inactive</span>
                  </div>
                  <h4 className="font-bold text-content-primary text-sm pt-1">{mock.title}</h4>
                  <p className="text-xs text-blue-700 font-medium">{mock.company}</p>
                  <p className="text-xs text-content-secondary pt-1">{mock.desc}</p>
                </div>
                <div className="pt-2 border-t border-brandBorder text-[11px] text-content-secondary italic">
                  Live job recommendations will populate once employer postings are integrated.
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default JobSeekerDashboard;
