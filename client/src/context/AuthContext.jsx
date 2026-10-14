/**
 * SmartHire Authentication Context
 * Manages global authentication state, session check on application mount,
 * and user login/logout/registration actions.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /**
   * Helper to resolve the correct dashboard URL based on user role
   */
  const getDashboardPath = (role) => {
    switch (role) {
      case 'job_seeker':
        return '/job-seeker/dashboard';
      case 'employer':
        return '/employer/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  /**
   * Check existing session on application start.
   * Sends request to /api/auth/me using credentials: 'include'.
   */
  const checkSession = async () => {
    try {
      setLoading(true);
      const data = await authService.getMe();
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      // 401 simply means no active session cookie exists; don't treat as a crash
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  /**
   * User login action
   */
  const login = async (credentials) => {
    setAuthError(null);
    const data = await authService.login(credentials);
    setUser(data.user);
    return data.user;
  };

  /**
   * User registration action
   */
  const register = async (userData) => {
    setAuthError(null);
    const data = await authService.register(userData);
    setUser(data.user);
    return data.user;
  };

  /**
   * User logout action
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API warning:', err.message);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    authError,
    setAuthError,
    login,
    register,
    logout,
    checkSession,
    getDashboardPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook for consuming auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
