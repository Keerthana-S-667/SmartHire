/**
 * SmartHire Login Page
 * Features client-side validation, loading indicators, server error messaging,
 * password visibility toggle, and automatic role-based redirection upon success.
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Info,
  ShieldCheck,
} from 'lucide-react';

const LoginPage = () => {
  const { login, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [clientErrors, setClientErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick fill helper for review/testing
  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@smarthire.local',
        password: 'Admin@12345',
      });
    } else if (role === 'employer') {
      setFormData({
        email: 'employer@techcorp.com',
        password: 'Password@123',
      });
    } else {
      setFormData({
        email: 'seeker@example.com',
        password: 'Password@123',
      });
    }
    setClientErrors({});
    setServerError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (clientErrors[name]) {
      setClientErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const loggedInUser = await login(formData);
      setSuccessMessage('Login successful! Redirecting to your dashboard...');

      // Redirect after brief visual feedback
      setTimeout(() => {
        // Redirect to originating URL if available, or role dashboard
        const redirectPath =
          location.state?.from?.pathname || getDashboardPath(loggedInUser.role);
        navigate(redirectPath, { replace: true });
      }, 700);
    } catch (err) {
      setServerError(
        err.message || 'Authentication failed. Please verify your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Header Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-blue-700">
            Smart<span className="text-blue-500">Hire</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-blue-700">Welcome Back</h2>
        <p className="text-sm text-content-secondary">
          Enter your credentials to access your personalized workspace.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card-container">
          
          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-5 p-3.5 rounded-lg bg-status-error-bg border border-status-error-border flex items-start gap-3 text-status-error text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Sign In Failed</p>
                <p className="text-xs mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-lg bg-status-success-bg border border-status-success-border flex items-start gap-3 text-status-success text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="font-semibold">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase text-content-primary tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-content-secondary">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`form-input pl-10 ${
                    clientErrors.email
                      ? 'border-status-error focus:border-status-error focus:ring-status-error-bg'
                      : ''
                  }`}
                />
              </div>
              {clientErrors.email && (
                <p className="text-xs text-status-error mt-1">{clientErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase text-content-primary tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-content-secondary">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`form-input pl-10 pr-10 ${
                    clientErrors.password
                      ? 'border-status-error focus:border-status-error focus:ring-status-error-bg'
                      : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-content-secondary hover:text-content-primary focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {clientErrors.password && (
                <p className="text-xs text-status-error mt-1">
                  {clientErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full !py-3 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>

          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-brandBorder">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-content-secondary uppercase tracking-wider mb-2.5">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              <span>Academic Demo Helper</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemoCredentials('seeker')}
                className="px-2 py-1.5 bg-blue-100/60 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 font-medium transition-colors"
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('employer')}
                className="px-2 py-1.5 bg-blue-100/60 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 font-medium transition-colors"
              >
                Employer
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="px-2 py-1.5 bg-blue-100/60 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 font-medium transition-colors"
              >
                Admin
              </button>
            </div>
            <p className="text-[11px] text-content-secondary mt-2">
              Click any button above to populate sample credentials into the form.
            </p>
          </div>

          {/* Switch to Register */}
          <div className="mt-6 text-center text-xs text-content-secondary">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
