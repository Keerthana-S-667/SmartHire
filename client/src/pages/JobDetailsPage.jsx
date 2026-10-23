/**
 * Job Details Page
 * Displays full job requirements, employer company overview, compensation details,
 * and handles application submission with resume validation and duplicate prevention.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService, applicationService, profileService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  FileText,
  Upload,
  Send,
  Loader2,
  Users,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Application Modal/Form State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [customResumeFile, setCustomResumeFile] = useState(null);
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appSuccess, setAppSuccess] = useState(false);
  const [appError, setAppError] = useState(null);

  // Load Job and User details
  const loadJobData = async () => {
    try {
      setLoading(true);
      setError(null);

      const jobRes = await jobService.getJob(id);
      if (jobRes && jobRes.job) {
        setJob(jobRes.job);
      } else {
        setError('Job posting not found.');
      }

      // If user is a Job Seeker, fetch profile and prior applications to check duplicate
      if (user && user.role === 'job_seeker') {
        const [profRes, appsRes] = await Promise.all([
          profileService.getProfile().catch(() => null),
          applicationService.getMyApplications().catch(() => ({ applications: [] })),
        ]);
        if (profRes && profRes.profile) {
          setProfile(profRes.profile);
          if (!profRes.profile.resume) {
            setUseProfileResume(false);
          }
        }
        if (appsRes && appsRes.applications) {
          setMyApplications(appsRes.applications);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load job details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobData();
  }, [id, user]);

  // Check if current seeker has already applied to this job
  const existingApplication = myApplications.find(
    (app) => (app.job?._id || app.job) === id
  );

  const isClosed = job?.status === 'closed';
  const isExpired = job?.deadline && new Date(job.deadline) < new Date();

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingApp(true);
      setAppError(null);

      let payload;
      if (useProfileResume && profile?.resume) {
        // Submit with JSON body using profile resume
        payload = {
          jobId: job._id,
          coverLetter,
        };
      } else {
        // Submit multipart with new resume file
        if (!customResumeFile) {
          setAppError('Please select a resume file (.pdf or .docx) to submit.');
          setSubmittingApp(false);
          return;
        }
        const formData = new FormData();
        formData.append('jobId', job._id);
        formData.append('coverLetter', coverLetter);
        formData.append('resume', customResumeFile);
        payload = formData;
      }

      const res = await applicationService.apply(payload);
      if (res.success) {
        setAppSuccess(true);
        // Refresh application state
        loadJobData();
      }
    } catch (err) {
      setAppError(err.message || 'Failed to submit application.');
    } finally {
      setSubmittingApp(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()} / year`;
    if (min) return `From ₹${min.toLocaleString()} / year`;
    return `Up to ₹${max.toLocaleString()} / year`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-bg">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-sm text-content-secondary">Loading job posting...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-bg">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-4 py-20 w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-status-error-bg text-status-error flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-content-primary">Job Not Found</h2>
          <p className="text-xs text-content-secondary">
            {error || 'This job listing may have been removed or is no longer available.'}
          </p>
          <Link to="/jobs" className="btn-primary !py-2 !px-4 text-xs inline-flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Search</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const salaryStr = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-secondary hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Openings</span>
          </Link>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Header Hero Card                                              */}
        {/* ------------------------------------------------------------- */}
        <div className="card-container p-6 sm:p-8 space-y-6 shadow-sm border border-brandBorder">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-100 text-blue-700 border border-blue-200">
                  {job.workplaceMode}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-surface-bg text-content-secondary border border-brandBorder">
                  {job.employmentType}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-surface-bg text-content-secondary border border-brandBorder">
                  {job.experienceLevel || 'Mid Level'}
                </span>
                {isClosed && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-status-error-bg text-status-error border border-status-error-border">
                    Closed Position
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700">{job.title}</h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-content-secondary">
                <span className="font-semibold text-content-primary flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>{job.companyName}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-content-secondary" />
                  <span>{job.location}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-content-secondary" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </span>
              </div>
            </div>

            {/* Application Action Button */}
            <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
              {existingApplication ? (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-left md:text-right space-y-1">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                    Application Status
                  </span>
                  <p className="text-sm font-bold text-blue-900">
                    {existingApplication.status}
                  </p>
                  <Link
                    to="/job-seeker/applications"
                    className="text-xs text-blue-600 hover:underline block"
                  >
                    View in My Applications →
                  </Link>
                </div>
              ) : isClosed || isExpired ? (
                <button
                  type="button"
                  disabled
                  className="btn-secondary !py-3 !px-6 text-sm opacity-60 cursor-not-allowed"
                >
                  Position Closed
                </button>
              ) : user && user.role === 'job_seeker' ? (
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(true)}
                  className="btn-primary !py-3 !px-8 text-sm font-semibold flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Apply Now</span>
                </button>
              ) : user ? (
                <div className="p-3 rounded-lg bg-surface-bg border border-brandBorder text-xs text-content-secondary max-w-xs text-left">
                  You are logged in as an <strong>{user.role}</strong>. Applications can only be submitted from candidate accounts.
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary !py-3 !px-8 text-sm font-semibold flex items-center gap-2"
                >
                  <span>Sign In to Apply</span>
                </Link>
              )}

              {job.deadline && (
                <span className="text-xs text-content-secondary flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-content-secondary/70" />
                  <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                </span>
              )}
            </div>

          </div>

          {/* Highlights Row */}
          {salaryStr && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Compensation: {salaryStr}</span>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Content Columns: Job Details & Company Info                   */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Job Body */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Description */}
            <div className="card-container space-y-3">
              <h2 className="text-base font-bold text-content-primary border-b border-brandBorder pb-2">
                About the Role
              </h2>
              <div className="text-sm text-content-secondary leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="card-container space-y-3">
                <h2 className="text-base font-bold text-content-primary border-b border-brandBorder pb-2">
                  Key Responsibilities
                </h2>
                <ul className="space-y-2 text-sm text-content-secondary list-disc pl-5">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qualifications */}
            {job.qualifications && job.qualifications.length > 0 && (
              <div className="card-container space-y-3">
                <h2 className="text-base font-bold text-content-primary border-b border-brandBorder pb-2">
                  Qualifications & Requirements
                </h2>
                <ul className="space-y-2 text-sm text-content-secondary list-disc pl-5">
                  {job.qualifications.map((qual, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {qual}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills Required */}
            {job.skills && job.skills.length > 0 && (
              <div className="card-container space-y-3">
                <h2 className="text-base font-bold text-content-primary border-b border-brandBorder pb-2">
                  Required Skills & Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-100/70 border border-blue-200 text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Organization Profile */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card-container space-y-4">
              <div className="flex items-center gap-3 border-b border-brandBorder pb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-content-primary">{job.companyName}</h3>
                  <p className="text-xs text-content-secondary">
                    {job.company?.industry || 'Technology & Services'}
                  </p>
                </div>
              </div>

              {job.company?.description && (
                <p className="text-xs text-content-secondary leading-relaxed">
                  {job.company.description}
                </p>
              )}

              <div className="space-y-2 text-xs text-content-secondary pt-2">
                {job.company?.companySize && (
                  <div className="flex items-center justify-between py-1 border-b border-brandBorder">
                    <span>Company Size</span>
                    <strong className="text-content-primary">{job.company.companySize} employees</strong>
                  </div>
                )}
                {job.company?.location && (
                  <div className="flex items-center justify-between py-1 border-b border-brandBorder">
                    <span>Headquarters</span>
                    <strong className="text-content-primary">{job.company.location}</strong>
                  </div>
                )}
                {job.company?.website && (
                  <div className="flex items-center justify-between py-1">
                    <span>Website</span>
                    <a
                      href={job.company.website.startsWith('http') ? job.company.website : `https://${job.company.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Portal Trust Banner */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                <Shield className="w-4 h-4" />
                <span>Verified Direct Application</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                Your application and resume document are transmitted directly to the hiring employer.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* Application Submission Modal                                   */}
      {/* ------------------------------------------------------------- */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-brandBorder relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brandBorder pb-3">
              <div>
                <h3 className="font-bold text-lg text-content-primary">Apply for Position</h3>
                <p className="text-xs text-content-secondary">
                  {job.title} at {job.companyName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="text-content-secondary hover:text-content-primary p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {appSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-status-success-bg text-status-success flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-content-primary">Application Submitted!</h4>
                  <p className="text-xs text-content-secondary">
                    Your application has been received and added to your tracking list.
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setApplyModalOpen(false);
                      setAppSuccess(false);
                    }}
                    className="btn-outline !py-2 !px-4 text-xs"
                  >
                    Close
                  </button>
                  <Link
                    to="/job-seeker/applications"
                    className="btn-primary !py-2 !px-4 text-xs"
                  >
                    View My Applications
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                {appError && (
                  <div className="p-3 rounded-lg bg-status-error-bg text-status-error-text text-xs flex items-center gap-2 border border-status-error-border">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{appError}</span>
                  </div>
                )}

                {/* Resume Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-content-primary">
                    Resume Document <span className="text-status-error">*</span>
                  </label>

                  {profile?.resume ? (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 p-3 rounded-lg border border-brandBorder bg-surface-bg cursor-pointer text-xs">
                        <input
                          type="radio"
                          name="resumeOption"
                          checked={useProfileResume}
                          onChange={() => setUseProfileResume(true)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-content-primary truncate">
                            Use Profile Resume: {profile.resume.originalName}
                          </p>
                          <p className="text-[11px] text-content-secondary">
                            {(profile.resume.size / 1024).toFixed(1)} KB • Active
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-3 rounded-lg border border-brandBorder bg-surface-bg cursor-pointer text-xs">
                        <input
                          type="radio"
                          name="resumeOption"
                          checked={!useProfileResume}
                          onChange={() => setUseProfileResume(false)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>Upload a tailored resume for this job</span>
                      </label>
                    </div>
                  ) : (
                    <p className="text-xs text-blue-700 bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                      You do not have a resume saved on your profile yet. Please choose a file below.
                    </p>
                  )}

                  {/* File Input when custom upload is selected or profile resume absent */}
                  {(!useProfileResume || !profile?.resume) && (
                    <div className="pt-2">
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        required={!profile?.resume}
                        onChange={(e) => setCustomResumeFile(e.target.files[0])}
                        className="input-field text-xs !py-2"
                      />
                      <p className="text-[11px] text-content-secondary mt-1">
                        Supported: .pdf, .docx up to 5MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Cover Letter */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-content-primary">
                    Cover Letter / Note to Employer (Optional)
                  </label>
                  <textarea
                    rows="4"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="input-field text-xs resize-none"
                    placeholder="Introduce yourself and explain why your experience makes you a strong fit for this role..."
                  ></textarea>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-brandBorder">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="btn-outline !py-2 !px-4 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingApp}
                    className="btn-primary !py-2 !px-5 text-xs flex items-center gap-2"
                  >
                    {submittingApp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirm & Submit</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default JobDetailsPage;
