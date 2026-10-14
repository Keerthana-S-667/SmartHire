/**
 * SmartHire Registration Page
 * Allows new users to sign up as either a 'job_seeker' or 'employer'.
 *
 * Security Notice:
 * 'admin' is explicitly excluded from public registration in adherence to Section 7 requirements.
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
      errors.role = 'Please select a valid account role';
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
      setSuccessMessage('Account created successfully! Preparing your dashboard...');

      setTimeout(() => {
        navigate(getDashboardPath(newUser.role), { replace: true });
      }, 700);
    } catch (err) {
      setServerError(
        err.message || 'Registration could not be completed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Header Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-blue-700">
            Smart<span className="text-blue-500">Hire</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-blue-700">Create Your Account</h2>
        <p className="text-sm text-content-secondary">
          Join SmartHire to discover opportunities or connect with high-caliber talent.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="card-container">
          
          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-5 p-3.5 rounded-lg bg-status-error-bg border border-status-error-border flex items-start gap-3 text-status-error text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Registration Failed</p>
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
            
            {/* Role Selection Selector (Job Seeker vs Employer) */}
            <div>
              <label className="block text-xs font-semibold uppercase text-content-primary tracking-wider mb-2">
                I want to join as a:
              </label>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Option 1: Job Seeker */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('job_seeker')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    formData.role === 'job_seeker'
                      ? 'bg-blue-100/70 border-blue-500 ring-2 ring-blue-500/20 text-blue-700'
                      : 'bg-white border-brandBorder text-content-secondary hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <UserCheck className="w-5 h-5 text-blue-500" />
                    {formData.role === 'job_seeker' && (
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                  <span className="font-bold text-sm text-content-primary">Job Seeker</span>
                  <span className="text-[11px] text-content-secondary">
                    Looking for career roles & AI matching
                  </span>
                </button>

                {/* Option 2: Employer */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('employer')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    formData.role === 'employer'
                      ? 'bg-blue-100/70 border-blue-500 ring-2 ring-blue-500/20 text-blue-700'
                      : 'bg-white border-brandBorder text-content-secondary hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    {formData.role === 'employer' && (
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <span className="font-bold text-sm text-content-primary">Employer</span>
                  <span className="text-[11px] text-content-secondary">
                    Hiring talent & reviewing candidate pools
                  </span>
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
                className="block text-xs font-semibold uppercase text-content-primary tracking-wider mb-1.5"
              >
                Full Name
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
                  placeholder="alex@example.com"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Password */}
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
                    autoComplete="new-password"
                    placeholder="Min 6 chars"
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
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-content-secondary hover:text-content-primary"
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
                  className="block text-xs font-semibold uppercase text-content-primary tracking-wider mb-1.5"
                >
                  Confirm Password
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
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full !py-3 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Switch to Sign In */}
          <div className="mt-6 text-center text-xs text-content-secondary">
            Already registered on SmartHire?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              Sign In here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
