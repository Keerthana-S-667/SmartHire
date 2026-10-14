/**
 * Unauthorized Access Page (403 Forbidden)
 * Rendered when an authenticated user attempts to access a protected route
 * that belongs to a different role (e.g., Job Seeker attempting to access Admin Console).
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LayoutDashboard, LogOut } from 'lucide-react';

const UnauthorizedPage = () => {
  const { user, logout, getDashboardPath } = useAuth();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="card-container max-w-lg w-full text-center space-y-6 p-8">
        
        <div className="w-16 h-16 rounded-2xl bg-status-warning-bg border border-status-warning-border text-status-warning flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-status-warning">
            403 • Role Access Restriction
          </span>
          <h1 className="text-2xl font-bold text-blue-700">Access Restricted</h1>
          <p className="text-sm text-content-secondary leading-relaxed">
            Your current account role does not have authorization to view this protected resource.
          </p>
        </div>

        {/* User Context Details */}
        {user && (
          <div className="p-3.5 bg-surface-bg rounded-xl border border-brandBorder text-xs text-left space-y-1">
            <div className="flex justify-between">
              <span className="text-content-secondary">Authenticated Account:</span>
              <span className="font-semibold text-content-primary">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-secondary">Assigned Database Role:</span>
              <span className="font-bold text-blue-600 uppercase">{user.role}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {user ? (
            <Link
              to={getDashboardPath(user.role)}
              className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Return to My Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
            >
              <span>Log In</span>
            </Link>
          )}

          <Link
            to="/"
            className="btn-outline flex-1 flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home Page</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default UnauthorizedPage;
