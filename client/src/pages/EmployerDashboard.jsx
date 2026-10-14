/**
 * Employer Dashboard
 * Dedicated portal view for hiring managers and recruiters.
 * Stage 1 establishes company profile foundation, with candidate scoring and job publishing arriving in Stage 2.
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import {
  Building2,
  Briefcase,
  Users,
  PlusCircle,
  FileSearch,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

const EmployerDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout
      title={`Welcome, ${user?.name || 'Recruiter'}`}
      subtitle="Employer Management Center • Stage 1 Foundation Setup"
    >
      <div className="space-y-8">
        
        {/* Banner: Foundation Notice */}
        <div className="p-4 rounded-xl bg-blue-100/70 border border-blue-200 text-blue-800 flex items-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold">Employer Workspace Active: </span>
            Authenticated securely under role <span className="font-semibold underline ml-1">employer</span>.
            Job listing creation, applicant pipeline management, and candidate resume evaluation will arrive in Stage 2.
          </div>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Openings</span>
              <Briefcase className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-content-primary">0</p>
            <p className="text-xs text-content-secondary">Job creation starts in Stage 2</p>
          </div>

          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Received Applicants</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-content-primary">0</p>
            <p className="text-xs text-content-secondary">Applicant pipeline starts in Stage 2</p>
          </div>

          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Matched Candidates</span>
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-content-primary">--</p>
            <p className="text-xs text-content-secondary">AI Resume matching starts in Stage 2</p>
          </div>

        </div>

        {/* Company Profile Placeholder */}
        <div className="card-container space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brandBorder pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-content-primary">Organization Profile</h3>
                <p className="text-xs text-content-secondary">Corporate Identity & Verification</p>
              </div>
            </div>
            <span className="badge-roadmap self-start sm:self-auto">Foundation State</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-surface-bg rounded-lg border border-brandBorder space-y-1">
              <span className="text-xs font-semibold text-content-secondary uppercase">Account Contact</span>
              <p className="font-bold text-content-primary">{user?.name}</p>
              <p className="text-xs text-content-secondary">{user?.email}</p>
            </div>
            <div className="p-4 bg-surface-bg rounded-lg border border-brandBorder space-y-1">
              <span className="text-xs font-semibold text-content-secondary uppercase">Access Role</span>
              <p className="font-bold text-blue-700 capitalize">{user?.role?.replace('_', ' ')}</p>
              <p className="text-xs text-status-success flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Session Authenticated via HTTP-Only Cookie
              </p>
            </div>
          </div>
        </div>

        {/* Job Postings & Pipeline Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Postings Placeholder */}
          <div className="card-container space-y-4">
            <div className="flex items-center justify-between border-b border-brandBorder pb-3">
              <h3 className="font-bold text-content-primary flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-500" />
                <span>Job Postings Management</span>
              </h3>
              <span className="badge-roadmap">Stage 2</span>
            </div>

            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-blue-400">
                <PlusCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-content-primary">
                Job Posting Engine Inactive in Stage 1
              </p>
              <p className="text-xs text-content-secondary max-w-sm mx-auto leading-relaxed">
                In Stage 2, employers will be able to publish detailed role criteria, minimum skill thresholds, and salary bands.
              </p>
            </div>
          </div>

          {/* Applicants Summary Placeholder */}
          <div className="card-container space-y-4">
            <div className="flex items-center justify-between border-b border-brandBorder pb-3">
              <h3 className="font-bold text-content-primary flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-blue-500" />
                <span>Applicant Screening Pipeline</span>
              </h3>
              <span className="badge-roadmap">Stage 2</span>
            </div>

            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-blue-400">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-content-primary">
                Candidate Pipeline Awaiting Stage 2
              </p>
              <p className="text-xs text-content-secondary max-w-sm mx-auto leading-relaxed">
                Once job postings are online, applicants will appear here with ranked compatibility scores and parsed resume profiles.
              </p>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
