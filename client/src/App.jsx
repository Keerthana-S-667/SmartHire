/**
 * SmartHire Application Root Router
 * Configures client routes, authentication context, and role-based guards.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// Job Seeker Pages
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import JobSeekerProfilePage from './pages/JobSeekerProfilePage';
import JobSeekerApplicationsPage from './pages/JobSeekerApplicationsPage';

// Employer Pages
import EmployerDashboard from './pages/EmployerDashboard';
import EmployerProfilePage from './pages/EmployerProfilePage';
import EmployerJobsPage from './pages/EmployerJobsPage';
import EmployerJobFormPage from './pages/EmployerJobFormPage';
import EmployerApplicantsPage from './pages/EmployerApplicantsPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';

// Layout wrapper for public pages with standard Navbar & Footer
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-surface-bg">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <LandingPage />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <LoginPage />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout>
                <RegisterPage />
              </PublicLayout>
            }
          />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route
            path="/unauthorized"
            element={
              <PublicLayout>
                <UnauthorizedPage />
              </PublicLayout>
            }
          />

          {/* Job Seeker Protected Routes */}
          <Route
            path="/job-seeker/dashboard"
            element={
              <ProtectedRoute allowedRoles={['job_seeker']}>
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-seeker/profile"
            element={
              <ProtectedRoute allowedRoles={['job_seeker']}>
                <JobSeekerProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-seeker/applications"
            element={
              <ProtectedRoute allowedRoles={['job_seeker']}>
                <JobSeekerApplicationsPage />
              </ProtectedRoute>
            }
          />

          {/* Employer Protected Routes */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/company"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/jobs"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/jobs/new"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerJobFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/jobs/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerJobFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/jobs/:jobId/applicants"
            element={
              <ProtectedRoute allowedRoles={['employer', 'admin']}>
                <EmployerApplicantsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback Route */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <NotFoundPage />
              </PublicLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
