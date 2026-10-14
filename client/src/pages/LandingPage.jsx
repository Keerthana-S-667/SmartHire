/**
 * SmartHire Public Landing Page
 * Implements "Infographic and Strategic Light" design direction with exact blue palette.
 * Highlights planned resume matching capabilities, 3-step workflow, and audience benefits.
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
  Cpu,
  Target,
  Clock,
  Compass,
} from 'lucide-react';

const LandingPage = () => {
  const { user, getDashboardPath } = useAuth();

  return (
    <div className="space-y-20 pb-16">
      
      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION                                                  */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Next-Gen MERN Job Portal • Stage 1 Foundation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-700 tracking-tight leading-tight">
                Find the Right Job. <br className="hidden sm:inline" />
                <span className="text-blue-500">Build Your Future.</span>
              </h1>

              <p className="text-base sm:text-lg text-content-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                SmartHire bridges ambitious talent and forward-thinking employers through a modern,
                transparent marketplace designed for intelligent, explainable skill matching and seamless career progression.
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
                      <span>Get Started Free</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <a
                      href="#how-it-works"
                      className="btn-secondary w-full sm:w-auto text-base !py-3 !px-6 flex items-center justify-center gap-2"
                    >
                      <span>Explore How It Works</span>
                    </a>
                  </>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-brandBorder flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-content-secondary">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Secure JWT HTTP-Only Cookies</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Granular Role-Based Access Control</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>MongoDB Schemas with Bcrypt</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Infographic Visual (Candidate - Skill - Job Matrix) */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl border border-brandBorder shadow-card p-6 space-y-5">
                
                {/* Header of infographic */}
                <div className="flex items-center justify-between border-b border-brandBorder pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-content-primary">Intelligent Matching Matrix</p>
                      <p className="text-[11px] text-content-secondary">Planned Stage 2 AI Capability</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                    Preview
                  </span>
                </div>

                {/* Candidate Node */}
                <div className="bg-surface-bg p-3.5 rounded-xl border border-blue-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                      JS
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-content-primary">Software Engineer Profile</p>
                      <p className="text-[11px] text-content-secondary">Resume & Experience Vector</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">94% Fit</span>
                </div>

                {/* Connector Graphic */}
                <div className="flex items-center justify-center py-1">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-200 text-blue-700 text-[11px] font-medium">
                    <Target className="w-3.5 h-3.5 text-blue-500" />
                    <span>Semantic Skill Analysis</span>
                  </div>
                </div>

                {/* Skills tags preview */}
                <div className="bg-white p-3.5 rounded-xl border border-brandBorder space-y-2">
                  <p className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
                    Extracted Competencies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['React.js', 'Node.js', 'MongoDB', 'REST APIs', 'Tailwind CSS'].map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2.5 py-1 rounded-md bg-blue-100/70 text-blue-700 font-medium border border-blue-200"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Target Job Node */}
                <div className="bg-surface-bg p-3.5 rounded-xl border border-blue-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-content-primary">Full-Stack MERN Developer</p>
                      <p className="text-[11px] text-content-secondary">TechCorp Enterprise</p>
                    </div>
                  </div>
                  <span className="text-xs text-status-success font-semibold">Matched</span>
                </div>

                <div className="text-[11px] text-center text-content-secondary pt-1 italic">
                  Deterministic & explainable recommendations coming in Stage 2.
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
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span>Product Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-700">
            Intelligent Platform Capabilities
          </h2>
          <p className="text-content-secondary text-base leading-relaxed">
            SmartHire is structured to evolve into an AI-augmented talent ecosystem.
            The foundation in Stage 1 lays the bedrock for these upcoming core innovations:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1 */}
          <div className="card-container hover:shadow-card transition-shadow space-y-4 relative group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="badge-roadmap">Stage 2</span>
            </div>
            <h3 className="text-lg font-bold text-blue-600">
              Resume-Based Matching
            </h3>
            <p className="text-sm text-content-secondary leading-relaxed">
              Automated document parsing extracts key technical competencies, education, and career milestones to match candidate profiles with precision.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card-container hover:shadow-card transition-shadow space-y-4 relative group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="badge-roadmap">Stage 2</span>
            </div>
            <h3 className="text-lg font-bold text-blue-600">
              Personalized Recommendations
            </h3>
            <p className="text-sm text-content-secondary leading-relaxed">
              Tailored job opportunity feeds continuously align candidate aspirations with real-time employer demand, filtering out irrelevant noise.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card-container hover:shadow-card transition-shadow space-y-4 relative group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="badge-roadmap">Stage 2</span>
            </div>
            <h3 className="text-lg font-bold text-blue-600">
              Explainable Compatibility
            </h3>
            <p className="text-sm text-content-secondary leading-relaxed">
              No black-box algorithms. Candidates and recruiters receive transparent score breakdowns highlighting strengths and skill gap suggestions.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card-container hover:shadow-card transition-shadow space-y-4 relative group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Clock className="w-6 h-6" />
              </div>
              <span className="badge-roadmap">Stage 2</span>
            </div>
            <h3 className="text-lg font-bold text-blue-600">
              Application Tracking
            </h3>
            <p className="text-sm text-content-secondary leading-relaxed">
              Live status pipelines keep applicants informed through submission, review, interview scheduling, and offer decision stages.
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
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-bold text-blue-700">
              How SmartHire Operates
            </h2>
            <p className="text-sm sm:text-base text-content-secondary">
              A streamlined, modern experience built for speed, transparency, and high placement fidelity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 p-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-blue-600">Create Your Profile</h3>
              <p className="text-sm text-content-secondary leading-relaxed">
                Register securely as a Job Seeker or Employer. Our role-based portal instantly establishes your dedicated dashboard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 p-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-blue-600">Discover Opportunities</h3>
              <p className="text-sm text-content-secondary leading-relaxed">
                Explore curated job roles or applicant pipelines mapped directly against technical skill requirements and job descriptions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 p-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-xl font-bold shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-blue-600">Apply and Track</h3>
              <p className="text-sm text-content-secondary leading-relaxed">
                Submit applications with a single click, monitor recruitment stages in real time, and receive direct recruiter feedback.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* AUDIENCE SECTION                                              */}
      {/* ------------------------------------------------------------- */}
      <section id="audience" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl font-bold text-blue-700">
            Tailored Experiences for Both Sides of Hiring
          </h2>
          <p className="text-content-secondary text-base">
            SmartHire delivers customized workspaces tailored to individual career seekers and hiring managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Job Seeker Benefits */}
          <div className="card-container border-t-4 border-t-blue-500 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-700">For Job Seekers</h3>
                <p className="text-xs text-content-secondary">Accelerate your career trajectory</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-content-secondary">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span>Dedicated personal dashboard with profile progress tracking.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span>Future AI resume analyzer that surfaces optimal job matches.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span>Full visibility into required skills and candidate compatibility scores.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span>Zero spam: Direct connections with vetted, authenticated employers.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/register"
                className="btn-outline w-full text-center flex items-center justify-center gap-2"
              >
                <span>Register as Job Seeker</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Employer Benefits */}
          <div className="card-container border-t-4 border-t-blue-600 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-700">For Employers</h3>
                <p className="text-xs text-content-secondary">Source and hire vetted candidates faster</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-content-secondary">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>Centralized hiring dashboard to supervise active openings and applicant counts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>Candidate matching engine that ranks applicants by verified skills.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>Streamlined candidate filtering reducing time-to-interview significantly.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>Secure corporate credentials protected by HTTP-only cookie authentication.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/register"
                className="btn-outline w-full text-center flex items-center justify-center gap-2"
              >
                <span>Register as Employer</span>
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
              Ready to Experience Smart Hiring?
            </h2>
            <p className="text-blue-200 text-sm sm:text-base max-w-xl">
              Create your account today and explore the foundation of next-generation recruitment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/register"
              className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-400 font-semibold text-white text-center transition-colors shadow-sm"
            >
              Sign Up Now
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
