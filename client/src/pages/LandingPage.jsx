/**
 * SmartHire Public Landing Page
 * User-centered recruitment marketplace homepage.
 * Communicates core benefits for Job Seekers and Employers without developer technical jargon.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileCheck,
  Sparkles,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Building2,
  Shield,
  Layers,
  Search,
  Target,
  Clock,
  Compass,
  Briefcase,
  Users,
} from 'lucide-react';

const LandingPage = () => {
  const { user, getDashboardPath } = useAuth();

  return (
    <div className="space-y-24 pb-20">
      
      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION                                                  */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-10 sm:pt-16 md:pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Skill-Based Career Matching</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-700 tracking-tight leading-tight">
                Find the Right Job. <br className="hidden sm:inline" />
                <span className="text-blue-500">Build Your Future.</span>
              </h1>

              <p className="text-base sm:text-lg text-content-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                SmartHire connects ambitious professionals with forward-thinking employers through
                intelligent skill alignment, transparent career insights, and modern recruitment tools.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                {user ? (
                  <Link
                    to={getDashboardPath(user.role)}
                    className="btn-primary w-full sm:w-auto text-base !py-3 !px-6 flex items-center justify-center gap-2"
                  >
                    <span>Go to My Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn-primary w-full sm:w-auto text-base !py-3 !px-6 flex items-center justify-center gap-2"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/jobs"
                      className="btn-secondary w-full sm:w-auto text-base !py-3 !px-6 flex items-center justify-center gap-2"
                    >
                      <span>Explore Open Jobs</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Customer Value Indicators */}
              <div className="pt-6 border-t border-brandBorder flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-content-secondary">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Verified Employers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Skill-Based Compatibility</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Private & Confidential</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Matching Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl border border-brandBorder shadow-card p-6 space-y-4">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-brandBorder pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-content-primary">Candidate Compatibility Insight</p>
                      <p className="text-[11px] text-content-secondary">Skill Alignment Summary</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    94% Match
                  </span>
                </div>

                {/* Candidate Profile Snippet */}
                <div className="bg-surface-bg p-3.5 rounded-xl border border-brandBorder flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      AM
                    </div>
                    <div>
                      <p className="text-xs font-bold text-content-primary">Alex Morgan</p>
                      <p className="text-[11px] text-content-secondary">Senior Solutions Engineer</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-status-success bg-status-success-bg px-2 py-0.5 rounded border border-status-success-border">
                    Strong Fit
                  </span>
                </div>

                {/* Matched Competencies */}
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
                    Core Competencies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Cloud Architecture', 'Distributed Systems', 'API Integration', 'UI/UX Design', 'Technical Leadership'].map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-200"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Target Role Snippet */}
                <div className="bg-surface-bg p-3.5 rounded-xl border border-brandBorder flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-sm">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-content-primary">Cloud Solutions Architect</p>
                      <p className="text-[11px] text-content-secondary">Apex Global Technologies</p>
                    </div>
                  </div>
                  <span className="text-xs text-blue-600 font-semibold">Active Opening</span>
                </div>

                {/* Status Indicator */}
                <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs text-blue-800">
                  <span className="font-medium">Application Status</span>
                  <span className="font-semibold text-blue-600">Under Review • Interview Stage</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FEATURES SECTION                                              */}
      {/* ------------------------------------------------------------- */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-700">
            Intelligent Tools for Candidates & Employers
          </h2>
          <p className="text-content-secondary text-base leading-relaxed">
            SmartHire is purpose-built to eliminate recruitment friction with transparent skill evaluation and reliable workflow management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1 */}
          <div className="card-container hover:shadow-card transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-blue-600">
              Personalized Job Discovery
            </h3>
            <p className="text-sm text-content-secondary leading-relaxed">
              Find positions that align with your background and goals, cutting through irrelevant listings to discover opportunities that truly match.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card-container hover:shadow-card transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-blue-600">
              Skill Compatibility Insights
            </h3>
            <p className="text-sm text-content-secondary leading-relaxed">
              Understand how your experience stacks up against job requirements with clear, explainable feedback on matching criteria.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card-container hover:shadow-card transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-blue-600">
              Resume & Profile Management
            </h3>
            <p className="text-sm text-content-secondary leading-relaxed">
              Maintain a comprehensive professional profile with your verified credentials, past roles, and core capabilities in one secure place.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card-container hover:shadow-card transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-blue-600">
              Application Progress Tracking
            </h3>
            <p className="text-sm text-content-secondary leading-relaxed">
              Stay informed through every stage of your candidacy, from initial submission to interview scheduling and offer decisions.
            </p>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* HOW IT WORKS SECTION                                          */}
      {/* ------------------------------------------------------------- */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white rounded-2xl border border-brandBorder shadow-subtle p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Simple 3-Step Workflow
            </span>
            <h2 className="text-3xl font-bold text-blue-700">
              How SmartHire Works
            </h2>
            <p className="text-sm sm:text-base text-content-secondary">
              A streamlined recruitment process designed to save time and deliver quality matches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-blue-600">Create Your Profile</h3>
              <p className="text-sm text-content-secondary leading-relaxed">
                Sign up as a Job Seeker or Employer to set up your dedicated workspace and highlight key requirements.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-blue-600">Discover Opportunities</h3>
              <p className="text-sm text-content-secondary leading-relaxed">
                Explore curated job roles or candidate pools mapped directly against specific skills and experience levels.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-xl font-bold shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-blue-600">Apply and Track</h3>
              <p className="text-sm text-content-secondary leading-relaxed">
                Submit applications, monitor progress in real time, and coordinate interviews smoothly through your dashboard.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* AUDIENCE SECTION: FOR JOB SEEKERS & EMPLOYERS                */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Tailored Experiences
          </span>
          <h2 className="text-3xl font-bold text-blue-700">
            Designed for Both Sides of Hiring
          </h2>
          <p className="text-content-secondary text-base">
            Whether advancing your career or scaling your team, SmartHire provides the tools you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* For Job Seekers */}
          <div id="for-seekers" className="card-container border-t-4 border-t-blue-500 space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-700">For Job Seekers</h3>
                <p className="text-xs text-content-secondary">Accelerate your professional trajectory</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-content-secondary">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span>Personalized workspace with profile and application tracking.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span>Skill compatibility insights to identify your best-matched positions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span>Clear visibility into required qualifications and employer criteria.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span>Direct access to verified opportunities from active hiring teams.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/register"
                className="btn-primary w-full text-center flex items-center justify-center gap-2"
              >
                <span>Find Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* For Employers */}
          <div id="for-employers" className="card-container border-t-4 border-t-blue-600 space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-700">For Employers</h3>
                <p className="text-xs text-content-secondary">Discover and hire qualified candidates faster</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-content-secondary">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>Dedicated employer management portal for job openings and applicants.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>Skill-based candidate screening to surface relevant talent quickly.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>Structured pipelines to manage applicants from review to hiring decision.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>Secure account management protecting company postings and candidate data.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/register"
                className="btn-outline w-full text-center flex items-center justify-center gap-2"
              >
                <span>Hire Talent</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* CALL TO ACTION BANNER                                         */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-3xl p-8 sm:p-12 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Discover Your Next Opportunity?
            </h2>
            <p className="text-blue-200 text-sm sm:text-base max-w-xl">
              Create your SmartHire account today and explore intelligent career matching.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/register"
              className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-400 font-semibold text-white text-center transition-colors shadow-sm"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 font-semibold text-white text-center transition-colors border border-white/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
