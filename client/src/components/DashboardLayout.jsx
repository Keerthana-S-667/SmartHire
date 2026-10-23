/**
 * Shared Dashboard Layout Component
 * Unified, professional dashboard shell with responsive sidebar navigation,
 * clear user account preview, and intuitive session controls.
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

  // Navigation items based on authenticated role
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
            label: 'Find Jobs',
            href: '/jobs',
            icon: Briefcase,
            active: location.pathname === '/jobs',
          },
          {
            label: 'My Applications',
            href: '/job-seeker/applications',
            icon: FileText,
            active: location.pathname === '/job-seeker/applications',
          },
          {
            label: 'Profile & Resume',
            href: '/job-seeker/profile',
            icon: User,
            active: location.pathname === '/job-seeker/profile',
          },
        ];
      case 'employer':
        return [
          {
            label: 'Overview',
            href: '/employer/dashboard',
            icon: LayoutDashboard,
            active: location.pathname === '/employer/dashboard',
          },
          {
            label: 'Job Postings',
            href: '/employer/jobs',
            icon: Building,
            active: location.pathname === '/employer/jobs',
          },
          {
            label: 'Post a New Job',
            href: '/employer/jobs/new',
            icon: Sparkles,
            active: location.pathname === '/employer/jobs/new',
          },
          {
            label: 'Company Profile',
            href: '/employer/company',
            icon: Briefcase,
            active: location.pathname === '/employer/company',
          },
        ];
      case 'admin':
        return [
          {
            label: 'Overview & Moderation',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
            active: location.pathname === '/admin/dashboard',
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
        return 'Employer';
      case 'job_seeker':
        return 'Job Seeker';
      default:
        return 'Member';
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
                  <span className="text-lg font-bold text-blue-700 tracking-tight leading-tight">
                    Smart<span className="text-blue-500">Hire</span>
                  </span>
                  <span className="text-[10px] text-content-secondary font-medium uppercase tracking-wider -mt-0.5">
                    Workspace
                  </span>
                </div>
              </Link>

              <span className="hidden sm:inline-flex items-center text-xs px-2.5 py-1 rounded-md bg-blue-100/70 border border-blue-200 text-blue-700 font-semibold">
                {getRoleLabel(user?.role)}
              </span>
            </div>

            {/* Right: User Profile & Quick Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface-bg border border-brandBorder">
                <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="text-left text-xs">
                  <p className="font-bold text-content-primary leading-tight">{user?.name}</p>
                  <p className="text-[11px] text-content-secondary truncate max-w-[160px]">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign out of account"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-content-secondary hover:text-status-error hover:bg-status-error-bg rounded-lg border border-brandBorder hover:border-status-error-border transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>

              {/* Mobile Sidebar Toggle Button */}
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="p-2 rounded-lg text-content-secondary hover:text-content-primary md:hidden"
                aria-label="Toggle navigation drawer"
              >
                {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6">
          <nav className="card-container p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-content-secondary uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return item.disabled ? (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-content-secondary/60 cursor-not-allowed select-none"
                  title="Coming soon in upcoming updates"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-content-secondary/40" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-surface-bg border border-brandBorder text-content-secondary">
                      {item.badge}
                    </span>
                  )}
                </div>
              ) : (
                <Link
                  key={idx}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-content-primary hover:bg-surface-bg hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.active ? 'text-blue-600' : 'text-content-secondary'}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Help & Support Card */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Need Help?</p>
            <p className="text-xs text-blue-800 leading-relaxed">
              Explore job discovery and skill matching tools in your SmartHire portal.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="md:hidden card-container p-4 space-y-3 mb-4">
            <p className="text-xs font-bold text-content-secondary uppercase tracking-wider">
              Navigation
            </p>
            <div className="space-y-1">
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    to={item.disabled ? '#' : item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                      item.active ? 'bg-blue-100 text-blue-700' : 'text-content-primary hover:bg-surface-bg'
                    } ${item.disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-surface-bg border border-brandBorder text-content-secondary">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 space-y-6 min-w-0">
          
          {/* Page Title & Context Header */}
          {(title || subtitle) && (
            <div className="space-y-1 pb-2 border-b border-brandBorder">
              {title && <h1 className="text-2xl font-bold text-blue-700">{title}</h1>}
              {subtitle && <p className="text-sm text-content-secondary">{subtitle}</p>}
            </div>
          )}

          {/* Children Components */}
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
