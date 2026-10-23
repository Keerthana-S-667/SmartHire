/**
 * Job Seeker Applications Tracking Page
 * Displays comprehensive application history, real status progression,
 * and allows candidate application withdrawal where permissible.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { applicationService } from '../services/api';
import {
  FileText,
  Building2,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  XCircle,
  Briefcase,
  Search,
} from 'lucide-react';

const JobSeekerApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [withdrawingId, setWithdrawingId] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await applicationService.getMyApplications();
      if (res && res.applications) {
        setApplications(res.applications);
      }
    } catch (err) {
      setError(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId, jobTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to withdraw your application for "${jobTitle}"? This will notify the employer.`
      )
    ) {
      return;
    }

    try {
      setWithdrawingId(applicationId);
      setActionFeedback(null);
      await applicationService.withdraw(applicationId);
      setActionFeedback({
        type: 'success',
        message: `Application for "${jobTitle}" was withdrawn successfully.`,
      });
      fetchApplications();
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Failed to withdraw application.',
      });
    } finally {
      setWithdrawingId(null);
    }
  };

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
      case 'Withdrawn':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-surface-bg text-content-secondary border-brandBorder';
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="My Applications"
        subtitle="Track the status of your submitted job applications."
      >
        <div className="card-container p-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-sm text-content-secondary">Loading your submitted applications...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="My Applications"
      subtitle="Track the status of your submitted job applications and candidate reviews."
    >
      <div className="space-y-6">
        
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

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card-container p-4 space-y-1">
            <span className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
              Total Applications
            </span>
            <p className="text-2xl font-extrabold text-blue-700">{applications.length}</p>
          </div>
          <div className="card-container p-4 space-y-1">
            <span className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
              Under Review
            </span>
            <p className="text-2xl font-extrabold text-indigo-700">
              {applications.filter((a) => a.status === 'Under Review' || a.status === 'Applied').length}
            </p>
          </div>
          <div className="card-container p-4 space-y-1">
            <span className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
              Shortlisted / Interview
            </span>
            <p className="text-2xl font-extrabold text-teal-700">
              {applications.filter((a) => ['Shortlisted', 'Interview'].includes(a.status)).length}
            </p>
          </div>
          <div className="card-container p-4 space-y-1">
            <span className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
              Hired Offers
            </span>
            <p className="text-2xl font-extrabold text-emerald-700">
              {applications.filter((a) => a.status === 'Hired').length}
            </p>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="card-container p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-content-primary">No Applications Yet</h3>
              <p className="text-xs text-content-secondary">
                You have not applied for any jobs yet. Browse open listings to discover positions matching your skills.
              </p>
            </div>
            <Link
              to="/jobs"
              className="btn-primary !py-2.5 !px-5 text-xs inline-flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Browse Open Positions</span>
            </Link>
          </div>
        ) : (
          <div className="card-container p-0 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-brandBorder bg-surface-bg/50 flex items-center justify-between">
              <h2 className="font-bold text-sm text-content-primary">
                Application History ({applications.length})
              </h2>
              <Link
                to="/jobs"
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Find More Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-brandBorder">
              {applications.map((app) => {
                const jobTitle = app.job?.title || 'Position';
                const canWithdraw = !['Hired', 'Rejected', 'Withdrawn'].includes(app.status);

                return (
                  <div
                    key={app._id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-bg/40 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {app.job ? (
                          <Link
                            to={`/jobs/${app.job._id}`}
                            className="font-bold text-base text-blue-700 hover:underline"
                          >
                            {app.job.title}
                          </Link>
                        ) : (
                          <span className="font-bold text-base text-content-primary">
                            Position No Longer Available
                          </span>
                        )}

                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-content-secondary">
                        <span className="flex items-center gap-1 font-semibold text-content-primary">
                          <Building2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>{app.job?.companyName || 'Employer'}</span>
                        </span>
                        {app.job?.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-content-secondary" />
                              <span>{app.job.location}</span>
                            </span>
                          </>
                        )}
                        {app.job?.workplaceMode && (
                          <>
                            <span>•</span>
                            <span>{app.job.workplaceMode}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-content-secondary" />
                          <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                        </span>
                      </div>

                      {app.coverLetter && (
                        <p className="text-xs text-content-secondary italic line-clamp-1 max-w-2xl bg-surface-bg p-2 rounded border border-brandBorder">
                          &quot;{app.coverLetter}&quot;
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                      {app.job && (
                        <Link
                          to={`/jobs/${app.job._id}`}
                          className="btn-outline !py-1.5 !px-3 text-xs"
                        >
                          View Posting
                        </Link>
                      )}

                      {canWithdraw && (
                        <button
                          type="button"
                          disabled={withdrawingId === app._id}
                          onClick={() => handleWithdraw(app._id, jobTitle)}
                          className="btn-secondary !py-1.5 !px-3 text-xs text-status-error hover:bg-status-error-bg border border-transparent hover:border-status-error-border transition-colors flex items-center gap-1"
                        >
                          {withdrawingId === app._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          <span>Withdraw</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default JobSeekerApplicationsPage;
