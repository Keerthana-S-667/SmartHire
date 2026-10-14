/**
 * Protected Route Component
 * Enforces client-side authentication and role-based access control.
 *
 * Behaviors:
 *  1. Shows a clean loading spinner while verifying session cookie.
 *  2. Redirects unauthenticated users to /login (preserving original URL for post-login return).
 *  3. Redirects users with mismatched roles to /unauthorized.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Session verification in progress
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-brandBorder shadow-subtle flex flex-col items-center gap-4 max-w-sm text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <div>
            <h3 className="text-base font-semibold text-content-primary">Verifying Session</h3>
            <p className="text-xs text-content-secondary mt-1">
              Checking authentication permissions with SmartHire server...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated -> Redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated but unauthorized role -> Redirect to unauthorized page
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Access authorized
  return children;
};

export default ProtectedRoute;
