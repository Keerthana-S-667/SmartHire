/**
 * SmartHire Application Footer
 * User-centered footer providing platform navigation, company info, and helpful resources.
 * Designed for real recruitment SaaS users without internal developer metadata.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-brandBorder text-content-secondary mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Overview */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-blue-700 tracking-tight">
                Smart<span className="text-blue-500">Hire</span>
              </span>
            </Link>
            <p className="text-sm text-content-secondary max-w-md leading-relaxed">
              SmartHire connects skilled job seekers with forward-thinking employers through
              intelligent skill alignment, transparent career insights, and modern recruitment tools.
            </p>
            <div className="pt-1 text-xs text-content-secondary">
              Designed for modern hiring workflows and career advancement.
            </div>
          </div>

          {/* Column 2: Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-content-primary uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#features" className="hover:text-blue-600 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-blue-600 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#for-seekers" className="hover:text-blue-600 transition-colors">
                  For Job Seekers
                </a>
              </li>
              <li>
                <a href="/#for-employers" className="hover:text-blue-600 transition-colors">
                  For Employers
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Account & Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-content-primary uppercase tracking-wider">
              Get Started
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                  <span>Create Account</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-600 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-brandBorder flex flex-col sm:flex-row items-center justify-between text-xs text-content-secondary gap-4">
          <p>© {new Date().getFullYear()} SmartHire. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-content-secondary">Intelligent Career Discovery & Recruitment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
