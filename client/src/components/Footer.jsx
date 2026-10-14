/**
 * SmartHire Application Footer
 * Provides branding, architectural metadata, quick navigation, and academic project context.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Shield, Layers, Code, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-brandBorder text-content-secondary mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Overview */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-blue-700 tracking-tight">
                Smart<span className="text-blue-500">Hire</span>
              </span>
            </div>
            <p className="text-sm text-content-secondary max-w-md leading-relaxed">
              SmartHire is an intelligent job portal platform featuring role-based dashboards,
              secure HTTP-only cookie authentication, and planned AI-powered resume matching capabilities.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-100/70 border border-blue-200 px-3 py-1.5 rounded-lg w-fit font-medium">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Stage 1: Foundation Setup & RBAC Active</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-content-primary uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-blue-600 transition-colors">
                  Features Roadmap
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#audience" className="hover:text-blue-600 transition-colors">
                  Audience Benefits
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech Stack & Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-content-primary uppercase tracking-wider">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Tailwind CSS', 'Vite', 'JWT / RBAC'].map(
                (tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-1 rounded-md bg-surface-bg border border-brandBorder text-content-primary font-medium"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-content-secondary pt-2">
              Clean MERN architecture designed for educational clarity and modular extension into Stage 2.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-brandBorder flex flex-col sm:flex-row items-center justify-between text-xs text-content-secondary gap-4">
          <p>© {new Date().getFullYear()} SmartHire. Academic Capstone Project.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Code className="w-3.5 h-3.5 text-blue-500" />
              <span>Full-Stack MERN Foundation</span>
            </span>
            <span>•</span>
            <span className="text-blue-600 font-medium">Stage 1 Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
