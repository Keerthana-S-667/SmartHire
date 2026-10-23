/**
 * Job Seeker Dashboard
 * User-centered candidate workspace.
 * Displays real-time database-derived application metrics, profile completion,
 * recent application updates, and recommended job openings.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { profileService } from '../services/api';
import {
  User,
  Sparkles,
  FileText,
  Clock,
  CheckCircle2,
  Briefcase,
  ArrowRight,
  Shield,
  Loader2,
  Building2,
  MapPin,
  Search,
} from 'lucide-react';

const JobSeekerDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await profileService.getSeekerStats();
        if (res && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load seeker stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const profileCompletion = stats?.profileCompletion || 20;

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
      title={`Welcome back, ${user?.name || 'Candidate'}`}
      subtitle="Your Candidate Workspace — Track your profile, applications, and matched opportunities."
    >
      <div className="space-y-8">
        
        {/* Recommended Action Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Recommended Next Step
            </span>
            <h2 className="text-lg font-bold">
              {profileCompletion < 80 ? 'Complete Your Professional Profile' : 'Discover Matching Opportunities'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              {profileCompletion < 80
                ? 'Add your skills, work history, and upload your resume to improve visibility with recruiters.'
                : 'Your profile is well detailed. Browse open positions to submit applications.'}
            </p>
          </div>
          <Link
            to={profileCompletion < 80 ? '/job-seeker/profile' : '/jobs'}
            className="px-4 py-2.5 rounded-lg bg-white text-blue-700 font-semibold text-xs sm:text-sm hover:bg-blue-50 transition-colors shadow-sm shrink-0 flex items-center gap-2"
          >
            <span>{profileCompletion < 80 ? 'Update Profile' : 'Browse Jobs'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Real Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Profile Strength</span>
              <User className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-3xl font-extrabold text-blue-700">
              {loading ? '...' : `${profileCompletion}%`}
            </p>
            <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden mt-1">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
          </div>

          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Applications</span>
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-3xl font-extrabold text-blue-700">
              {loading ? '...' : stats?.totalApplications ?? 0}
            </p>
            <p className="text-xs text-content-secondary">Submitted applications</p>
          </div>

          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Under Review</span>
              <Clock className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-3xl font-extrabold text-indigo-700">
              {loading ? '...' : stats?.underReviewCount ?? 0}
            </p>
            <p className="text-xs text-content-secondary">Active employer reviews</p>
          </div>

          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Shortlisted</span>
              <Sparkles className="w-4 h-4 text-teal-500" />
            </div>
            <p className="text-3xl font-extrabold text-teal-700">
              {loading ? '...' : stats?.shortlistedCount ?? 0}
            </p>
            <p className="text-xs text-content-secondary">Advancing in process</p>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* Recent Applications Section                                   */}
        {/* ------------------------------------------------------------- */}
        <div className="card-container space-y-4">
          <div className="flex items-center justify-between border-b border-brandBorder pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-content-primary">Recent Applications</h3>
                <p className="text-xs text-content-secondary">Real-time status of your submissions</p>
              </div>
            </div>
            <Link
              to="/job-seeker/applications"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-content-secondary">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            </div>
          ) : !stats?.recentApplications || stats.recentApplications.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className="text-xs text-content-secondary">
                You haven&apos;t submitted any job applications yet.
              </p>
              <Link to="/jobs" className="btn-primary !py-2 !px-4 text-xs inline-flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>Search Jobs Now</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-brandBorder">
              {stats.recentApplications.map((app) => (
                <div
                  key={app._id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-sm text-content-primary">
                      {app.jobTitle}
                    </h4>
                    <p className="text-xs text-content-secondary flex items-center gap-2 mt-0.5">
                      <Building2 className="w-3 h-3 text-blue-600" />
                      <span>{app.companyName}</span>
                      <span>•</span>
                      <span>{app.location}</span>
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

        {/* ------------------------------------------------------------- */}
        {/* Recommended Jobs                                              */}
        {/* ------------------------------------------------------------- */}
        {stats?.recommendedJobs && stats.recommendedJobs.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-content-primary">Recently Posted Opportunities</h3>
                <p className="text-xs text-content-secondary">Latest open positions on SmartHire</p>
              </div>
              <Link
                to="/jobs"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.recommendedJobs.map((job) => (
                <div
                  key={job._id}
                  className="card-container p-4 hover:shadow-card transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {job.workplaceMode}
                      </span>
                      <span className="text-xs text-content-secondary">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-content-primary line-clamp-1">
                      {job.title}
                    </h4>
                    <p className="text-xs text-blue-700 font-semibold flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{job.companyName}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-brandBorder">
                    <span className="text-xs text-content-secondary flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                    </span>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="btn-outline !py-1 !px-2.5 text-xs inline-flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default JobSeekerDashboard;
