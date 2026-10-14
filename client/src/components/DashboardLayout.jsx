/**
 * Shared Dashboard Layout Component
 * Provides a unified, professional dashboard shell with responsive navigation,
 * role badges, user account preview, and quick session termination.
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  User,
  LogOut,
  LayoutDashboard,
  FileText,
  Building,
  Users,
  Activity,
  Menu,
  X,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const DashboardLayout = ({ title, subtitle, children }) => {
  const { user, logout, getDashboardPath } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Determine navigation items based on authenticated role
  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'job_seeker':
        return [
          {
            label: 'Overview',
            href: '/job-seeker/dashboard',
            icon: LayoutDashboard,
            active: location.pathname === '/job-seeker/dashboard',
          },
          {
            label: 'Resume Matching',
            href: '#resume-match',
            icon: Sparkles,
            badge: 'Stage 2',
            disabled: true,
          },
          {
            label: 'My Applications',
            href: '#applications',
            icon: FileText,
            badge: 'Stage 2',
            disabled: true,
          },
        ];
      case 'employer':
        return [
          {
            label: 'Dashboard Overview',
            href: '/employer/dashboard',
            icon: LayoutDashboard,
            active: location.pathname === '/employer/dashboard',
          },
          {
            label: 'Job Postings',
            href: '#postings',
            icon: Building,
            badge: 'Stage 2',
            disabled: true,
          },
          {
            label: 'Candidate Pool',
            href: '#candidates',
            icon: Users,
            badge: 'Stage 2',
            disabled: true,
          },
        ];
      case 'admin':
        return [
          {
            label: 'Platform Overview',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
            active: location.pathname === '/admin/dashboard',
          },
          {
            label: 'User Directory',
            href: '#users-list',
            icon: Users,
            active: false,
          },
          {
            label: 'System Status',
            href: '#system-health',
            icon: Activity,
            active: false,
          },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'employer':
        return 'Employer Portal';
      case 'job_seeker':
        return 'Job Seeker Portal';
      default:
        return 'Portal';
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-brandBorder shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand & Portal Badge */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-blue-700 leading-tight">
                    Smart<span className="text-blue-500">Hire</span>
                  </span>
                  <span className="text-[10px] text-content-secondary font-medium tracking-wide">
                    {getRoleLabel(user?.role)}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    to={item.href}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-content-secondary hover:text-content-primary hover:bg-surface-bg'
                    } ${item.disabled ? 'cursor-default opacity-75' : ''}`}
                  >
                    <Icon className="w-4 h-4 text-blue-500" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: User Profile & Logout */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-surface-bg rounded-lg border border-brandBorder">
                <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-content-primary leading-tight">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-content-secondary capitalize">
                    {user?.role?.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <Link
                to="/"
                title="View Public Site"
                className="p-2 text-content-secondary hover:text-blue-600 hover:bg-blue-100/50 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-status-error hover:bg-status-error-bg border border-transparent hover:border-status-error-border rounded-lg transition-colors"
                title="Log out of session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="p-2 text-content-secondary hover:text-content-primary rounded-lg"
              >
                {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="sm:hidden border-t border-brandBorder bg-white p-4 space-y-3">
            <div className="p-3 bg-surface-bg rounded-lg border border-brandBorder mb-3">
              <p className="text-sm font-semibold text-content-primary">{user?.name}</p>
              <p className="text-xs text-content-secondary">{user?.email}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                {user?.role?.toUpperCase()}
              </span>
            </div>

            <nav className="flex flex-col space-y-1">
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    to={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                      item.active ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-content-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-blue-500" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-200">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-brandBorder flex gap-2">
              <Link
                to="/"
                onClick={() => setMobileSidebarOpen(false)}
                className="btn-outline flex-1 text-center text-xs !py-2"
              >
                Public Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 text-center text-xs py-2 px-3 text-status-error bg-status-error-bg rounded-lg border border-status-error-border"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base text-content-secondary mt-1">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Dashboard Child View */}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
