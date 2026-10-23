/**
 * Employer Dashboard
 * User-centered recruitment workspace for hiring managers and talent acquisition teams.
 * Displays real-time database-derived job opening counts, total applications received,
 * review queue counts, and recent applicant activity.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { applicationService, companyService } from '../services/api';
import {
  Building2,
  Briefcase,
  Users,
  PlusCircle,
  FileSearch,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  Clock,
  Loader2,
  XCircle,
} from 'lucide-react';

const EmployerDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, compRes] = await Promise.all([
          applicationService.getEmployerStats().catch(() => ({ stats: null })),
          companyService.getMyCompany().catch(() => ({ company: null })),
        ]);
        if (statsRes && statsRes.stats) {
          setStats(statsRes.stats);
        }
        if (compRes && compRes.company) {
          setCompany(compRes.company);
        }
      } catch (err) {
        console.error('Failed to load employer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Shortlisted':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Interview':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Hired':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <DashboardLayout
      title={`Welcome, ${user?.name || 'Recruiter'}`}
      subtitle="Employer Management Center — Manage job postings, review applicants, and source talent."
    >
      <div className="space-y-8">
        
        {/* Recommended Action Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Hiring Pipeline
            </span>
            <h2 className="text-lg font-bold">
              {stats?.activeJobs === 0
                ? 'Publish Your First Job Posting'
                : 'Manage Your Candidate Pipeline'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              {stats?.activeJobs === 0
                ? 'Create a detailed opening with role responsibilities and qualifications to attract qualified professionals.'
                : 'Review incoming applications, update candidate statuses, and download verified resumes.'}
            </p>
          </div>
          <Link
            to={stats?.activeJobs === 0 ? '/employer/jobs/new' : '/employer/jobs'}
            className="px-4 py-2.5 rounded-lg bg-blue-500 text-white font-semibold text-xs sm:text-sm hover:bg-blue-400 transition-colors shadow-sm shrink-0 flex items-center gap-2"
          >
            <span>{stats?.activeJobs === 0 ? 'Post a Job' : 'View Job Listings'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Real Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Openings</span>
              <Briefcase className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-3xl font-extrabold text-blue-700">
              {loading ? '...' : stats?.activeJobs ?? 0}
            </p>
            <p className="text-xs text-content-secondary">
              {stats?.closedJobs ? `${stats.closedJobs} closed` : 'Currently accepting applications'}
            </p>
          </div>

          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Applications</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-3xl font-extrabold text-blue-700">
              {loading ? '...' : stats?.totalApplications ?? 0}
            </p>
            <p className="text-xs text-content-secondary">Across all job postings</p>
          </div>

          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Review</span>
              <Clock className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-3xl font-extrabold text-indigo-700">
              {loading ? '...' : stats?.pendingApplications ?? 0}
            </p>
            <p className="text-xs text-content-secondary">Requiring recruiter evaluation</p>
          </div>

          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Created</span>
              <Layers className="w-4 h-4 text-teal-500" />
            </div>
            <p className="text-3xl font-extrabold text-teal-700">
              {loading ? '...' : stats?.totalJobs ?? 0}
            </p>
            <p className="text-xs text-content-secondary">All-time listings</p>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* Organization Account Summary Card                             */}
        {/* ------------------------------------------------------------- */}
        <div className="card-container space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brandBorder pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-content-primary">
                  {company?.companyName || 'My Organization'}
                </h3>
                <p className="text-xs text-content-secondary">
                  {company?.industry || 'Technology'} • {company?.location || 'Headquarters'}
                </p>
              </div>
            </div>

            <Link
              to="/employer/company"
              className="btn-outline !py-1.5 !px-3 text-xs self-start sm:self-auto"
            >
              Edit Company Profile
            </Link>
          </div>

          {company?.description && (
            <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
              {company.description}
            </p>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Recent Applicants Feed                                        */}
        {/* ------------------------------------------------------------- */}
        <div className="card-container space-y-4">
          <div className="flex items-center justify-between border-b border-brandBorder pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-content-primary">Recent Candidate Applications</h3>
                <p className="text-xs text-content-secondary">Real-time candidate submissions</p>
              </div>
            </div>
            <Link
              to="/employer/jobs"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All Postings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            </div>
          ) : !stats?.recentApplicants || stats.recentApplicants.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className="text-xs text-content-secondary">
                No applications received yet.
              </p>
              <Link
                to="/employer/jobs/new"
                className="btn-primary !py-2 !px-4 text-xs inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post an Opening</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-brandBorder">
              {stats.recentApplicants.map((app) => (
                <div
                  key={app._id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-sm text-content-primary">
                      {app.candidateName}
                    </h4>
                    <p className="text-xs text-content-secondary mt-0.5">
                      Applied for: <strong className="text-content-primary">{app.jobTitle}</strong> • {app.candidateEmail}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                    <span className="text-xs text-content-secondary">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
