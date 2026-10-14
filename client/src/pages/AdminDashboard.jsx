/**
 * Admin Dashboard
 * System supervision portal for authenticated administrators.
 * Fetches and displays platform statistics, MongoDB health status, and user registry.
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
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch system health
      const healthData = await healthService.checkHealth().catch((err) => ({
        status: 'degraded',
        database: { connected: false, status: 'error' },
      }));
      setHealth(healthData);

      // 2. Fetch admin platform stats
      const statsData = await adminService.getStats().catch((err) => {
        console.warn('Stats fetch warning:', err.message);
        return null;
      });
      if (statsData) {
        setStats(statsData.stats);
      }

      // 3. Fetch registered users list
      const usersData = await adminService.getUsers().catch((err) => {
        console.warn('Users fetch warning:', err.message);
        return { users: [] };
      });
      if (usersData && usersData.users) {
        setUsersList(usersData.users);
      }
    } catch (err) {
      setError(err.message || 'Failed to load administrator metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-700 text-white';
      case 'employer':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'job_seeker':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      default:
        return 'bg-surface-bg text-content-secondary';
    }
  };

  return (
    <DashboardLayout
      title="Platform Administration Console"
      subtitle="SmartHire System Supervision, User Directory & Infrastructure Health"
    >
      <div className="space-y-8">
        
        {/* Top Header & Refresh Control */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-blue-700 text-white shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Administrator Session: {user?.name}</p>
              <p className="text-xs text-blue-200">
                Authorized via RBAC role <span className="font-mono font-bold">admin</span>
              </p>
            </div>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Error Alert if any */}
        {error && (
          <div className="p-4 rounded-xl bg-status-error-bg border border-status-error-border text-status-error flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Administration Notice</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Metrics Row: User Counts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Metric 1: Total Users */}
          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Registered</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-3xl font-extrabold text-blue-700">
              {stats ? stats.totalUsers : usersList.length}
            </p>
            <p className="text-xs text-content-secondary">Active accounts in MongoDB</p>
          </div>

          {/* Metric 2: Job Seekers */}
          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Job Seekers</span>
              <UserCheck className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-3xl font-extrabold text-blue-600">
              {stats ? stats.jobSeekerCount : usersList.filter((u) => u.role === 'job_seeker').length}
            </p>
            <p className="text-xs text-content-secondary">Candidate profiles</p>
          </div>

          {/* Metric 3: Employers */}
          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Employers</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-3xl font-extrabold text-blue-700">
              {stats ? stats.employerCount : usersList.filter((u) => u.role === 'employer').length}
            </p>
            <p className="text-xs text-content-secondary">Hiring organizations</p>
          </div>

          {/* Metric 4: Platform Status */}
          <div className="card-container space-y-2">
            <div className="flex items-center justify-between text-content-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Database Status</span>
              <Database className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  health?.database?.connected ? 'bg-status-success' : 'bg-status-warning'
                }`}
              ></span>
              <p className="text-lg font-bold text-content-primary capitalize">
                {health?.database?.status || 'Unknown'}
              </p>
            </div>
            <p className="text-xs text-content-secondary">
              {health?.database?.connected
                ? 'MongoDB connected & responding'
                : 'MongoDB connection offline'}
            </p>
          </div>

        </div>

        {/* Section: Platform Infrastructure & Health */}
        <div id="system-health" className="card-container space-y-4">
          <div className="flex items-center justify-between border-b border-brandBorder pb-3">
            <h3 className="font-bold text-lg text-content-primary flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span>Platform Health & Security Status</span>
            </h3>
            <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md">
              Stage 1 Foundation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            <div className="p-3.5 bg-surface-bg rounded-lg border border-brandBorder space-y-1">
              <div className="flex items-center gap-2 font-semibold text-content-primary">
                <Server className="w-4 h-4 text-blue-500" />
                <span>Express API Server</span>
              </div>
              <p className="text-content-secondary">Port 5000 • CORS with Credentials</p>
              <p className="text-status-success font-medium">● Online and accepting requests</p>
            </div>

            <div className="p-3.5 bg-surface-bg rounded-lg border border-brandBorder space-y-1">
              <div className="flex items-center gap-2 font-semibold text-content-primary">
                <Database className="w-4 h-4 text-blue-500" />
                <span>MongoDB Database</span>
              </div>
              <p className="text-content-secondary">Mongoose ODM 8.x • Unique Email Index</p>
              <p
                className={`font-medium ${
                  health?.database?.connected ? 'text-status-success' : 'text-status-warning'
                }`}
              >
                ● {health?.database?.connected ? 'Connection Established' : 'Awaiting Local/Atlas Instance'}
              </p>
            </div>

            <div className="p-3.5 bg-surface-bg rounded-lg border border-brandBorder space-y-1">
              <div className="flex items-center gap-2 font-semibold text-content-primary">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Security Engine</span>
              </div>
              <p className="text-content-secondary">Bcrypt Salt 10 • JWT in HTTP-Only Cookies</p>
              <p className="text-status-success font-medium">● RBAC Middleware Active</p>
            </div>

          </div>
        </div>

        {/* Section: User Management Directory */}
        <div id="users-list" className="card-container space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brandBorder pb-3">
            <div>
              <h3 className="font-bold text-lg text-content-primary flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span>Registered Users Directory</span>
              </h3>
              <p className="text-xs text-content-secondary">
                Audit view of accounts registered in MongoDB (passwords safely omitted).
              </p>
            </div>
            <span className="text-xs text-content-secondary">
              Showing {usersList.length} accounts
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-content-secondary text-sm">
              Loading registered users...
            </div>
          ) : usersList.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <Users className="w-8 h-8 text-content-secondary/50 mx-auto" />
              <p className="text-sm font-medium text-content-primary">No registered users found</p>
              <p className="text-xs text-content-secondary max-w-sm mx-auto">
                Once users register via /register or the admin seed script is run, they will appear in this administrative ledger.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brandBorder text-content-secondary uppercase tracking-wider bg-surface-bg/50">
                    <th className="py-2.5 px-3 font-semibold">User</th>
                    <th className="py-2.5 px-3 font-semibold">Email</th>
                    <th className="py-2.5 px-3 font-semibold">Role</th>
                    <th className="py-2.5 px-3 font-semibold">Registered At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brandBorder">
                  {usersList.map((usr) => (
                    <tr key={usr._id || usr.email} className="hover:bg-surface-bg/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[11px]">
                            {usr.name ? usr.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span className="font-semibold text-content-primary">{usr.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-content-secondary">{usr.email}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${getRoleBadgeClass(
                            usr.role
                          )}`}
                        >
                          {usr.role?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-content-secondary">
                        {usr.createdAt
                          ? new Date(usr.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
