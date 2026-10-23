/**
 * Employer Job Listings Management Page
 * Displays all jobs created by the employer with publication controls,
 * real applicant counters, and links to applicant review.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { jobService } from '../services/api';
import {
  Briefcase,
  Plus,
  Users,
  Edit3,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Eye,
  Building2,
} from 'lucide-react';

const EmployerJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await jobService.getMyJobs();
      if (res && res.jobs) {
        setJobs(res.jobs);
      }
    } catch (err) {
      setError(err.message || 'Failed to load job listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (jobId, currentStatus, title) => {
    const nextStatus = currentStatus === 'published' ? 'closed' : 'published';
    const actionLabel = nextStatus === 'closed' ? 'close' : 'reopen / publish';

    if (
      !window.confirm(
        `Are you sure you want to ${actionLabel} the job listing "${title}"?`
      )
    ) {
      return;
    }

    try {
      setStatusUpdatingId(jobId);
      setActionFeedback(null);
      await jobService.updateJobStatus(jobId, nextStatus);
      setActionFeedback({
        type: 'success',
        message: `Job "${title}" is now ${nextStatus}.`,
      });
      fetchJobs();
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Failed to update job status.',
      });
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'closed':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'draft':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="My Job Postings"
        subtitle="Manage your created openings and candidate pipelines."
      >
        <div className="card-container p-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-sm text-content-secondary">Loading your job postings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="My Job Postings"
      subtitle="Create, edit, and track the status of your openings and review applicant submissions."
    >
      <div className="space-y-6">
        
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-content-secondary">
              Total Created: <strong className="text-content-primary">{jobs.length}</strong>
            </span>
            <span className="text-xs text-content-secondary">•</span>
            <span className="text-sm text-content-secondary">
              Active: <strong className="text-emerald-700">{jobs.filter((j) => j.status === 'published').length}</strong>
            </span>
          </div>

          <Link
            to="/employer/jobs/new"
            className="btn-primary !py-2.5 !px-5 text-xs flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post a New Job</span>
          </Link>
        </div>

        {/* Feedback Alert */}
        {actionFeedback && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              actionFeedback.type === 'success'
                ? 'bg-status-success-bg text-status-success-text border border-status-success-border'
                : 'bg-status-error-bg text-status-error-text border border-status-error-border'
            }`}
          >
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
        )}

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div className="card-container p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-content-primary">No Job Postings Yet</h3>
              <p className="text-xs text-content-secondary">
                You haven&apos;t created any job listings. Publish your first opening to start receiving qualified candidates.
              </p>
            </div>
            <Link
              to="/employer/jobs/new"
              className="btn-primary !py-2.5 !px-5 text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Job</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const isUpdating = statusUpdatingId === job._id;

              return (
                <div
                  key={job._id}
                  className="card-container p-5 hover:shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 border border-brandBorder"
                >
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-content-primary">
                        {job.title}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded border capitalize ${getStatusBadge(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-content-secondary">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{job.location}</span>
                      </span>
                      <span>•</span>
                      <span>{job.workplaceMode}</span>
                      <span>•</span>
                      <span>{job.employmentType}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Created {new Date(job.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>

                    {/* Skills Chips */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills.slice(0, 4).map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-surface-bg border border-brandBorder text-content-secondary"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Applicant Counter */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-brandBorder shrink-0">
                    {/* Applicants Badge Link */}
                    <Link
                      to={`/employer/jobs/${job._id}/applicants`}
                      className="px-3.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold flex items-center justify-between sm:justify-start gap-2 transition-colors"
                      title="View all applicants for this job"
                    >
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>{job.applicationCount || 0} Applicants</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>

                    {/* Edit Job Link */}
                    <Link
                      to={`/employer/jobs/${job._id}/edit`}
                      className="btn-outline !py-2 !px-3 text-xs flex items-center justify-center gap-1.5"
                      title="Edit job description and requirements"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    {/* Status Toggle Button */}
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleToggleStatus(job._id, job.status, job.title)}
                      className={`btn-secondary !py-2 !px-3 text-xs flex items-center justify-center gap-1.5 ${
                        job.status === 'published'
                          ? 'text-rose-700 hover:bg-rose-50 border-rose-200'
                          : 'text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      {isUpdating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : job.status === 'published' ? (
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span>{job.status === 'published' ? 'Close Job' : 'Reopen Job'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default EmployerJobsPage;
