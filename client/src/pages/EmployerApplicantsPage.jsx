/**
 * Employer Job Applicants Review Page
 * Allows hiring managers to review candidates who applied for their job postings,
 * access authorized candidate resumes, inspect qualifications, and transition candidate status.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { applicationService, jobService } from '../services/api';
import {
  Users,
  Briefcase,
  FileText,
  Download,
  Calendar,
  Mail,
  MapPin,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Filter,
} from 'lucide-react';

const EmployerApplicantsPage = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedback, setFeedback] = useState(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await applicationService.getJobApplicants(jobId);
      if (res && res.applicants) {
        setApplicants(res.applicants);
        setJob(res.job);
      }
    } catch (err) {
      setError(err.message || 'Failed to load job applicants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus, candidateName) => {
    try {
      setUpdatingId(applicationId);
      setFeedback(null);

      await applicationService.updateStatus(applicationId, newStatus);
      setFeedback({
        type: 'success',
        message: `Updated ${candidateName}'s application status to "${newStatus}".`,
      });

      // Update state in-place
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to update status.',
      });
    } finally {
      setUpdatingId(null);
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

  const filteredApplicants =
    statusFilter === 'all'
      ? applicants
      : applicants.filter((app) => app.status === statusFilter);

  if (loading) {
    return (
      <DashboardLayout
        title="Applicant Review"
        subtitle="Review candidate profiles and resumes."
      >
        <div className="card-container p-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-sm text-content-secondary">Loading candidate submissions...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={job ? `Applicants for: ${job.title}` : 'Applicant Review'}
      subtitle={`Review candidate submissions, inspect qualifications, and advance talent.`}
    >
      <div className="space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/employer/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-secondary hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Job Postings</span>
          </Link>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-status-success-bg text-status-success-text border border-status-success-border'
                : 'bg-status-error-bg text-status-error-text border border-status-error-border'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Top Control Bar with Status Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-container p-4">
          <div className="flex items-center gap-3 text-xs text-content-secondary">
            <span>
              Total Candidates: <strong className="text-content-primary">{applicants.length}</strong>
            </span>
            <span>•</span>
            <span>
              Showing: <strong className="text-content-primary">{filteredApplicants.length}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-content-secondary" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field text-xs !py-1.5"
            >
              <option value="all">All Statuses ({applicants.length})</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>

        {/* Applicants List */}
        {filteredApplicants.length === 0 ? (
          <div className="card-container p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-content-primary">
                {statusFilter === 'all' ? 'No Applications Yet' : `No Applicants in "${statusFilter}"`}
              </h3>
              <p className="text-xs text-content-secondary">
                {statusFilter === 'all'
                  ? 'Candidate applications for this job posting will appear here as soon as they are submitted.'
                  : 'Try selecting "All Statuses" to view candidates in other stages.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map((app) => {
              const candidate = app.applicant || {};
              const profile = app.profile || {};
              const isUpdating = updatingId === app._id;
              const isWithdrawn = app.status === 'Withdrawn';

              return (
                <div
                  key={app._id}
                  className="card-container p-5 hover:shadow-card transition-all flex flex-col md:flex-row md:items-start justify-between gap-5 border border-brandBorder"
                >
                  <div className="space-y-3 flex-1">
                    {/* Header: Candidate Name, Current Status, Applied Date */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        {candidate.name?.charAt(0)?.toUpperCase() || 'C'}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-content-primary leading-tight">
                          {candidate.name || 'Candidate'}
                        </h4>
                        <p className="text-xs text-content-secondary flex items-center gap-1">
                          <Mail className="w-3 h-3 text-content-secondary" />
                          <span>{candidate.email}</span>
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded border ml-auto sm:ml-2 ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {/* Headline & Experience */}
                    {(profile.headline || profile.experienceYears !== undefined) && (
                      <div className="text-xs text-content-secondary flex flex-wrap items-center gap-2">
                        {profile.headline && (
                          <span className="font-semibold text-content-primary">
                            {profile.headline}
                          </span>
                        )}
                        {profile.experienceYears !== undefined && (
                          <>
                            <span>•</span>
                            <span>{profile.experienceYears} Years Experience</span>
                          </>
                        )}
                        {profile.location && (
                          <>
                            <span>•</span>
                            <span>{profile.location}</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Skills Chips */}
                    {profile.skills && profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {profile.skills.slice(0, 6).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Cover Letter */}
                    {app.coverLetter && (
                      <div className="p-3 rounded-lg bg-surface-bg border border-brandBorder text-xs text-content-secondary space-y-1">
                        <span className="font-semibold text-content-primary block">
                          Cover Note:
                        </span>
                        <p className="italic leading-relaxed whitespace-pre-line">
                          {app.coverLetter}
                        </p>
                      </div>
                    )}

                    <p className="text-[11px] text-content-secondary">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions: Resume Download & Status Transition */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 self-start md:self-auto w-full sm:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-brandBorder">
                    {/* Authorized Resume Download Button */}
                    <a
                      href={applicationService.getApplicationResumeUrl(app._id)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline !py-2 !px-3 text-xs flex items-center justify-center gap-1.5"
                      title="Download verified resume file"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" />
                      <span>Download Resume</span>
                    </a>

                    {/* Status Transition Control */}
                    {!isWithdrawn ? (
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-content-secondary">
                          Update Status:
                        </label>
                        <select
                          disabled={isUpdating}
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app._id, e.target.value, candidate.name)
                          }
                          className="input-field text-xs !py-1.5 font-semibold text-content-primary"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    ) : (
                      <span className="text-xs text-content-secondary italic">
                        Withdrawn by candidate
                      </span>
                    )}
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

export default EmployerApplicantsPage;
