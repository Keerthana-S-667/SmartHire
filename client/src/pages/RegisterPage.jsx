/**
 * SmartHire Registration Page
 * User-centered registration form with intuitive role selection, inline error handling,
 * and compact layout optimized for desktop and mobile viewports.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const RegisterPage = () => {
  const { register, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'job_seeker', // Default allowed public role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [clientErrors, setClientErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (clientErrors[name]) {
      setClientErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
    if (clientErrors.role) {
      setClientErrors((prev) => ({ ...prev, role: '' }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!['job_seeker', 'employer'].includes(formData.role)) {
      errors.role = 'Please select your account type';
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
      const newUser = await register(formData);
      setSuccessMessage('Account created successfully! Preparing your workspace...');

      setTimeout(() => {
        navigate(getDashboardPath(newUser.role), { replace: true });
      }, 600);
    } catch (err) {
      setServerError(
        err.message || 'Registration could not be completed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      
      {/* Header Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-1.5">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-blue-700">
            Smart<span className="text-blue-500">Hire</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-blue-700">Create your SmartHire account</h1>
        <p className="text-sm text-content-secondary">
          Join as a candidate to find opportunities or as an employer to hire talent.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="card-container shadow-card p-6 sm:p-8">
          
          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-4 p-3 rounded-lg bg-status-error-bg border border-status-error-border flex items-start gap-2.5 text-status-error text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-xs uppercase tracking-wide">Notice</p>
                <p className="text-xs mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-status-success-bg border border-status-success-border flex items-start gap-2.5 text-status-success text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-semibold text-xs">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Account Type Selector (Job Seeker vs Employer) */}
            <div>
              <label className="block text-xs font-semibold uppercase text-content-primary tracking-wider mb-2">
                I want to join as: <span className="text-status-error">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Option 1: Job Seeker */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('job_seeker')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    formData.role === 'job_seeker'
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 text-blue-700 shadow-sm'
                      : 'bg-white border-brandBorder text-content-secondary hover:border-blue-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    formData.role === 'job_seeker' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-content-primary leading-tight">Job Seeker</p>
                    <p className="text-[11px] text-content-secondary truncate">Looking for jobs</p>
                  </div>
                </button>

                {/* Option 2: Employer */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('employer')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    formData.role === 'employer'
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 text-blue-700 shadow-sm'
                      : 'bg-white border-brandBorder text-content-secondary hover:border-blue-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    formData.role === 'employer' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-content-primary leading-tight">Employer</p>
                    <p className="text-[11px] text-content-secondary truncate">Hiring talent</p>
                  </div>
                </button>

              </div>
              {clientErrors.role && (
                <p className="text-xs text-status-error mt-1">{clientErrors.role}</p>
              )}
            </div>

            {/* Full Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase text-content-primary tracking-wider mb-1"
              >
                Full Name <span className="text-status-error">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-content-secondary">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`form-input pl-10 ${
                    clientErrors.name ? 'border-status-error' : ''
                  }`}
                />
              </div>
              {clientErrors.name && (
                <p className="text-xs text-status-error mt-1">{clientErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase text-content-primary tracking-wider mb-1"
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
                  placeholder="alex@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`form-input pl-10 ${
                    clientErrors.email ? 'border-status-error' : ''
                  }`}
                />
              </div>
              {clientErrors.email && (
                <p className="text-xs text-status-error mt-1">{clientErrors.email}</p>
              )}
            </div>

            {/* Password and Confirm Password Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase text-content-primary tracking-wider mb-1"
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
                    autoComplete="new-password"
                    placeholder="Min. 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`form-input pl-10 pr-10 ${
                      clientErrors.password ? 'border-status-error' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-content-secondary hover:text-content-primary"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {clientErrors.password && (
                  <p className="text-xs text-status-error mt-1">
                    {clientErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase text-content-primary tracking-wider mb-1"
                >
                  Confirm Password <span className="text-status-error">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-content-secondary">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`form-input pl-10 ${
                      clientErrors.confirmPassword ? 'border-status-error' : ''
                    }`}
                  />
                </div>
                {clientErrors.confirmPassword && (
                  <p className="text-xs text-status-error mt-1">
                    {clientErrors.confirmPassword}
                  </p>
                )}
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full !py-3 flex items-center justify-center gap-2 text-base font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </div>

          </form>

          {/* Switch to Sign In */}
          <div className="mt-5 pt-4 border-t border-brandBorder text-center text-xs text-content-secondary">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
