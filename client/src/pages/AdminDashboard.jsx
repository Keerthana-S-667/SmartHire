/**
 * Admin Dashboard
 * System supervision and management portal for platform administrators.
 * Displays real-time platform metrics, database connectivity status,
 * user management with account deactivation moderation, job moderation, and application oversight.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { adminService, healthService } from '../services/api';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Database,
  Activity,
  Server,
  RefreshCw,
  UserCheck,
  Building2,
  AlertCircle,
  Clock,
  Shield,
  Briefcase,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  Lock,
  Unlock,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [applicationsList, setApplicationsList] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Active Tab: 'users' | 'jobs' | 'applications' | 'system'
  const [activeTab, setActiveTab] = useState('users');
  const [actionInProgress, setActionInProgress] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all administrative datasets in parallel
      const [healthData, statsData, usersData, jobsData, appsData] = await Promise.all([
        healthService.checkHealth().catch(() => ({
          status: 'degraded',
          database: { connected: false, status: 'disconnected' },
        })),
        adminService.getStats().catch(() => null),
        adminService.getUsers().catch(() => ({ users: [] })),
        adminService.getJobs().catch(() => ({ jobs: [] })),
        adminService.getApplications().catch(() => ({ applications: [] })),
      ]);

      setHealth(healthData);
      if (statsData) setStats(statsData.stats);
      if (usersData && usersData.users) setUsersList(usersData.users);
      if (jobsData && jobsData.jobs) setJobsList(jobsData.jobs);
      if (appsData && appsData.applications) setApplicationsList(appsData.applications);
    } catch (err) {
      setError(err.message || 'Failed to load administrator metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Admin moderation: Toggle user active state
  const handleToggleUserStatus = async (userId, currentActive, name) => {
    const nextState = !currentActive;
    const actionLabel = nextState ? 'activate' : 'deactivate';

    if (
      !window.confirm(
        `Are you sure you want to ${actionLabel} the account for "${name}"?`
      )
    ) {
      return;
    }

    try {
      setActionInProgress(true);
      setFeedback(null);
      await adminService.toggleUserStatus(userId);
      setFeedback({
        type: 'success',
        message: `User account for "${name}" has been ${nextState ? 'activated' : 'deactivated'}.`,
      });
      fetchDashboardData();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to modify user status.',
      });
    } finally {
      setActionInProgress(false);
    }
  };

  // Admin moderation: Moderate job status
  const handleModerateJob = async (jobId, currentStatus, title) => {
    const nextStatus = currentStatus === 'published' ? 'closed' : 'published';
    const actionLabel = nextStatus === 'closed' ? 'close' : 'publish / reopen';

    if (
      !window.confirm(
        `Are you sure you want to ${actionLabel} the job listing "${title}"?`
      )
    ) {
      return;
    }

    try {
      setActionInProgress(true);
      setFeedback(null);
      await adminService.moderateJob(jobId, nextStatus);
      setFeedback({
        type: 'success',
        message: `Job listing "${title}" has been updated to ${nextStatus}.`,
      });
      fetchDashboardData();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to update job status.',
      });
    } finally {
      setActionInProgress(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-700 text-white';
      case 'employer':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'job_seeker':
        return 'bg-surface-bg text-content-primary border border-brandBorder';
      default:
        return 'bg-surface-bg text-content-secondary';
    }
  };

  const isDBConnected = health?.database?.connected;

  return (
    <DashboardLayout
      title="System Administration & Moderation"
      subtitle="Supervise platform metrics, user accounts, job postings, and database connectivity."
    >
      <div className="space-y-8">
        
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

        {/* Top Platform Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="card-container p-4 space-y-1">
            <span className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
              Total Users
            </span>
            <p className="text-2xl font-extrabold text-blue-700">
              {loading ? '...' : stats?.totalUsers ?? 0}
            </p>
          </div>

          <div className="card-container p-4 space-y-1">
            <span className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
              Job Seekers
            </span>
            <p className="text-2xl font-extrabold text-blue-700">
              {loading ? '...' : stats?.jobSeekerCount ?? 0}
            </p>
          </div>

          <div className="card-container p-4 space-y-1">
            <span className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
              Employers
            </span>
            <p className="text-2xl font-extrabold text-blue-700">
              {loading ? '...' : stats?.employerCount ?? 0}
            </p>
          </div>

          <div className="card-container p-4 space-y-1">
            <span className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
              Total Jobs
            </span>
            <p className="text-2xl font-extrabold text-teal-700">
              {loading ? '...' : stats?.totalJobs ?? 0}
            </p>
          </div>

          <div className="card-container p-4 space-y-1">
            <span className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
              Active Jobs
            </span>
            <p className="text-2xl font-extrabold text-emerald-700">
              {loading ? '...' : stats?.activeJobs ?? 0}
            </p>
          </div>

          <div className="card-container p-4 space-y-1">
            <span className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
              Applications
            </span>
            <p className="text-2xl font-extrabold text-indigo-700">
              {loading ? '...' : stats?.totalApplications ?? 0}
            </p>
          </div>

        </div>

        {/* Database Status Strip */}
        <div className="card-container p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-bg border border-brandBorder">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                isDBConnected
                  ? 'bg-status-success-bg text-status-success'
                  : 'bg-status-error-bg text-status-error'
              }`}
            >
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-content-primary flex items-center gap-2">
                <span>Platform Database Server</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isDBConnected
                      ? 'bg-status-success-bg text-status-success-text border border-status-success-border'
                      : 'bg-status-error-bg text-status-error-text border border-status-error-border'
                  }`}
                >
                  {isDBConnected ? 'Connected & Healthy' : 'Disconnected'}
                </span>
              </p>
              <p className="text-[11px] text-content-secondary">
                Database Name: <strong>smarthire</strong> • Local Port: <strong>27017</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={fetchDashboardData}
            className="btn-outline !py-1.5 !px-3 text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh All Data</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Navigation Tabs                                               */}
        {/* ------------------------------------------------------------- */}
        <div className="border-b border-brandBorder flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-content-secondary hover:text-content-primary'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Accounts ({usersList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'jobs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-content-secondary hover:text-content-primary'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Job Listings ({jobsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'applications'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-content-secondary hover:text-content-primary'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Applications ({applicationsList.length})</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: User Accounts Management                               */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'users' && (
          <div className="card-container p-0 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-brandBorder bg-surface-bg/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-content-primary">Registered User Registry</h3>
                <p className="text-xs text-content-secondary">
                  Audit accounts, inspect roles, and manage active access status.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-bg text-content-secondary uppercase font-semibold border-b border-brandBorder">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brandBorder">
                  {usersList.map((u) => {
                    const isSelf = u._id === user?._id;
                    const isActive = u.isActive !== false;

                    return (
                      <tr key={u._id} className="hover:bg-surface-bg/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-content-primary flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                            {u.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <span>{u.name}</span>
                          {isSelf && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-semibold">
                              You
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-content-secondary">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${getRoleBadgeClass(
                              u.role
                            )}`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              isActive
                                ? 'bg-status-success-bg text-status-success-text border border-status-success-border'
                                : 'bg-status-error-bg text-status-error-text border border-status-error-border'
                            }`}
                          >
                            {isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-content-secondary">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {!isSelf && (
                            <button
                              type="button"
                              disabled={actionInProgress}
                              onClick={() => handleToggleUserStatus(u._id, isActive, u.name)}
                              className={`btn-secondary !py-1 !px-2.5 text-xs inline-flex items-center gap-1 ${
                                isActive
                                  ? 'text-rose-700 hover:bg-rose-50'
                                  : 'text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              {isActive ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                              <span>{isActive ? 'Deactivate' : 'Activate'}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: Job Listings Moderation                                */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'jobs' && (
          <div className="card-container p-0 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-brandBorder bg-surface-bg/50">
              <h3 className="font-bold text-sm text-content-primary">Platform Job Postings</h3>
              <p className="text-xs text-content-secondary">
                Inspect all jobs across the platform and close inappropriate or expired openings.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-bg text-content-secondary uppercase font-semibold border-b border-brandBorder">
                  <tr>
                    <th className="py-3 px-4">Job Title</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brandBorder">
                  {jobsList.map((job) => (
                    <tr key={job._id} className="hover:bg-surface-bg/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-content-primary">
                        {job.title}
                      </td>
                      <td className="py-3 px-4 text-content-secondary font-medium">
                        {job.companyName}
                      </td>
                      <td className="py-3 px-4 text-content-secondary">
                        {job.location} ({job.workplaceMode})
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                            job.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-content-secondary">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          disabled={actionInProgress}
                          onClick={() => handleModerateJob(job._id, job.status, job.title)}
                          className={`btn-secondary !py-1 !px-2.5 text-xs inline-flex items-center gap-1 ${
                            job.status === 'published'
                              ? 'text-rose-700 hover:bg-rose-50'
                              : 'text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {job.status === 'published' ? 'Close Job' : 'Reopen Job'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: Applications Overview                                  */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'applications' && (
          <div className="card-container p-0 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-brandBorder bg-surface-bg/50">
              <h3 className="font-bold text-sm text-content-primary">Platform Applications Audit</h3>
              <p className="text-xs text-content-secondary">
                Review submissions and candidate progress across the portal.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-bg text-content-secondary uppercase font-semibold border-b border-brandBorder">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Job Title</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Applied Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brandBorder">
                  {applicationsList.map((app) => (
                    <tr key={app._id} className="hover:bg-surface-bg/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-content-primary">
                        {app.applicant?.name || 'Candidate'}
                        <span className="block text-[11px] text-content-secondary font-normal">
                          {app.applicant?.email}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-blue-700">
                        {app.job?.title || 'Position'}
                      </td>
                      <td className="py-3 px-4 text-content-secondary font-medium">
                        {app.job?.companyName || 'Company'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-content-secondary">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {applicationsList.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-content-secondary">
                        No applications recorded in the database yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
