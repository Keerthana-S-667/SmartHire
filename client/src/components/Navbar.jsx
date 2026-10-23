/**
 * SmartHire Navigation Bar
 * Responsive, clean header with branding, intuitive navigation,
 * and dynamic state for authenticated users.
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Menu, X, User, LogOut, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const { user, logout, getDashboardPath } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  /**
   * Smoothly scrolls to section on home page or navigates there from other pages.
   */
  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'employer':
        return 'Employer';
      case 'job_seeker':
        return 'Job Seeker';
      default:
        return 'Member';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brandBorder shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-blue-700 tracking-tight flex items-center gap-1">
                Smart<span className="text-blue-500">Hire</span>
              </span>
              <span className="text-[10px] text-content-secondary font-medium tracking-wider uppercase -mt-1">
                Job Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' && !location.hash
                  ? 'text-blue-600 font-semibold'
                  : 'text-content-primary hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/jobs')
                  ? 'text-blue-600 font-semibold'
                  : 'text-content-primary hover:text-blue-600'
              }`}
            >
              Find Jobs
            </Link>
            <button
              onClick={() => handleNavClick('features')}
              className="text-sm font-medium text-content-secondary hover:text-blue-600 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-sm font-medium text-content-secondary hover:text-blue-600 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('for-seekers')}
              className="text-sm font-medium text-content-secondary hover:text-blue-600 transition-colors"
            >
              For Candidates
            </button>
            <button
              onClick={() => handleNavClick('for-employers')}
              className="text-sm font-medium text-content-secondary hover:text-blue-600 transition-colors"
            >
              For Employers
            </button>
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath(user.role)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100/70 border border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span>{user.name}</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-600 text-white font-semibold">
                    {getRoleBadge(user.role)}
                  </span>
                </Link>

                <Link
                  to={getDashboardPath(user.role)}
                  className="btn-primary text-sm !py-2 !px-4"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-content-secondary hover:text-status-error hover:bg-status-error-bg rounded-lg border border-transparent hover:border-status-error-border transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-content-primary hover:text-blue-600 rounded-lg hover:bg-blue-100/50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm !py-2 !px-4 flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-blue-100/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-content-primary" />
              ) : (
                <Menu className="w-6 h-6 text-content-primary" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brandBorder bg-white px-4 pt-3 pb-6 shadow-card space-y-3">
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-content-primary hover:bg-blue-100/50 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-content-primary hover:bg-blue-100/50 hover:text-blue-600"
            >
              Find Jobs
            </Link>
            <button
              onClick={() => handleNavClick('features')}
              className="text-left px-3 py-2 rounded-md text-base font-medium text-content-secondary hover:bg-blue-100/50 hover:text-blue-600"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-left px-3 py-2 rounded-md text-base font-medium text-content-secondary hover:bg-blue-100/50 hover:text-blue-600"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('for-seekers')}
              className="text-left px-3 py-2 rounded-md text-base font-medium text-content-secondary hover:bg-blue-100/50 hover:text-blue-600"
            >
              For Candidates
            </button>
            <button
              onClick={() => handleNavClick('for-employers')}
              className="text-left px-3 py-2 rounded-md text-base font-medium text-content-secondary hover:bg-blue-100/50 hover:text-blue-600"
            >
              For Employers
            </button>
          </div>

          <div className="pt-3 border-t border-brandBorder">
            {user ? (
              <div className="space-y-3">
                <div className="px-3 py-2 bg-blue-100/60 rounded-lg">
                  <p className="text-sm font-semibold text-content-primary">{user.name}</p>
                  <p className="text-xs text-content-secondary">{user.email}</p>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-blue-700 bg-blue-200 px-2 py-0.5 rounded">
                    {getRoleBadge(user.role)}
                  </span>
                </div>
                <Link
                  to={getDashboardPath(user.role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 px-3 text-sm text-status-error hover:bg-status-error-bg rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full btn-outline text-center block"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full btn-primary text-center block"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
