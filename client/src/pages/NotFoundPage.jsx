/**
 * 404 Not Found Page
 * Clean fallback for undefined frontend routes.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="card-container max-w-md w-full text-center space-y-6 p-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mx-auto">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-blue-700">404</h1>
          <h2 className="text-lg font-bold text-content-primary">Page Not Found</h2>
          <p className="text-xs text-content-secondary leading-relaxed">
            The link you followed could not be found or may have been moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to SmartHire Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
