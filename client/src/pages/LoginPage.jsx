/**
 * SmartHire Login Page
 * User-centered login screen with clear error feedback, accessible field labels,
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
      setSuccessMessage('Signed in successfully! Taking you to your dashboard...');

      // Redirect after brief visual feedback
      setTimeout(() => {
        const redirectPath =
          location.state?.from?.pathname || getDashboardPath(loggedInUser.role);
        navigate(redirectPath, { replace: true });
      }, 600);
    } catch (err) {
      setServerError(
        err.message || 'Unable to sign in. Please check your email and password.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      
      {/* Header Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-blue-700">
            Smart<span className="text-blue-500">Hire</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-blue-700">Welcome Back</h1>
        <p className="text-sm text-content-secondary">
          Enter your email and password to access your account.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card-container shadow-card p-6 sm:p-8">
          
          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-5 p-3.5 rounded-lg bg-status-error-bg border border-status-error-border flex items-start gap-3 text-status-error text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Sign In Notice</p>
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
                Email Address <span className="text-status-error">*</span>
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
                  placeholder="you@company.com"
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
                <p className="text-xs text-status-error mt-1.5">{clientErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase text-content-primary tracking-wider mb-1.5"
              >
                Password <span className="text-status-error">*</span>
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
                <p className="text-xs text-status-error mt-1.5">
                  {clientErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full !py-3 flex items-center justify-center gap-2 text-base font-semibold"
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

          {/* Switch to Register */}
          <div className="mt-6 pt-5 border-t border-brandBorder text-center text-xs text-content-secondary">
            Don't have a SmartHire account yet?{' '}
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
