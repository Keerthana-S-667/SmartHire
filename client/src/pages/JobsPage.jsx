/**
 * Jobs Browse & Search Page
 * Public and candidate search directory backed by MongoDB with real-time filtering,
 * keyword query, compensation thresholds, and pagination.
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { jobService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  DollarSign,
  Clock,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
} from 'lucide-react';

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [employmentType, setEmploymentType] = useState(searchParams.get('employmentType') || 'all');
  const [workplaceMode, setWorkplaceMode] = useState(searchParams.get('workplaceMode') || 'all');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || 'all');
  const [salaryMin, setSalaryMin] = useState(searchParams.get('salaryMin') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 9,
        search,
        location,
        employmentType,
        workplaceMode,
        experienceLevel,
        salaryMin,
        sort,
      };

      const res = await jobService.getJobs(params);
      if (res && res.jobs) {
        setJobs(res.jobs);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, employmentType, workplaceMode, experienceLevel, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setEmploymentType('all');
    setWorkplaceMode('all');
    setExperienceLevel('all');
    setSalaryMin('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `From ₹${min.toLocaleString()}`;
    return `Up to ₹${max.toLocaleString()}`;
  };

  const getWorkplaceBadgeClass = (mode) => {
    switch (mode) {
      case 'Remote':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Hybrid':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Page Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Opportunities</span>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700">Explore Open Job Listings</h1>
          <p className="text-sm text-content-secondary max-w-2xl">
            Browse verified job opportunities with salary transparency and clear skill requirements.
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Search & Filter Bar                                           */}
        {/* ------------------------------------------------------------- */}
        <div className="card-container p-4 space-y-4 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-content-secondary absolute left-3 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title, skills (e.g. React), or company name..."
                className="input-field !pl-9 text-sm"
              />
            </div>

            <div className="md:col-span-4 relative">
              <MapPin className="w-4 h-4 text-content-secondary absolute left-3 top-3.5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, state, or location..."
                className="input-field !pl-9 text-sm"
              />
            </div>

            <div className="md:col-span-3 flex gap-2">
              <button
                type="submit"
                className="btn-primary !py-2.5 !px-5 text-sm flex-1 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
              {(search || location || employmentType !== 'all' || workplaceMode !== 'all' || experienceLevel !== 'all' || salaryMin) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn-outline !py-2.5 !px-3 text-xs"
                  title="Clear all filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Secondary Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2 border-t border-brandBorder">
            <div>
              <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                Workplace Mode
              </label>
              <select
                value={workplaceMode}
                onChange={(e) => {
                  setWorkplaceMode(e.target.value);
                  setPage(1);
                }}
                className="input-field text-xs !py-2"
              >
                <option value="all">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => {
                  setEmploymentType(e.target.value);
                  setPage(1);
                }}
                className="input-field text-xs !py-2"
              >
                <option value="all">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => {
                  setExperienceLevel(e.target.value);
                  setPage(1);
                }}
                className="input-field text-xs !py-2"
              >
                <option value="all">All Levels</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead / Manager">Lead / Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                Min Annual Salary
              </label>
              <input
                type="number"
                placeholder="e.g. 500000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                onBlur={fetchJobs}
                className="input-field text-xs !py-2"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                Sort Order
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field text-xs !py-2"
              >
                <option value="newest">Newest First</option>
                <option value="salary_high">Highest Salary</option>
                <option value="salary_low">Lowest Salary</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Results Counter & Listings                                    */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-content-secondary">
            <span>
              Showing <strong className="text-content-primary">{jobs.length}</strong> of{' '}
              <strong className="text-content-primary">{total}</strong> open positions
            </span>
            {total > 0 && (
              <span>
                Page {page} of {totalPages}
              </span>
            )}
          </div>

          {loading ? (
            <div className="card-container p-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="text-sm text-content-secondary">Fetching active job listings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="card-container p-12 text-center space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-content-primary">No Matching Jobs Found</h3>
                <p className="text-xs text-content-secondary">
                  No published job listings match your current search filters. Try adjusting keywords or clearing filters.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn-outline !py-2 !px-4 text-xs inline-flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => {
                const salaryStr = formatSalary(job.salaryMin, job.salaryMax);

                return (
                  <div
                    key={job._id}
                    className="card-container hover:shadow-card transition-all duration-200 flex flex-col justify-between group border border-brandBorder hover:border-blue-300"
                  >
                    <div className="space-y-3.5">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getWorkplaceBadgeClass(
                            job.workplaceMode
                          )}`}
                        >
                          {job.workplaceMode}
                        </span>
                        <span className="text-[11px] font-medium text-content-secondary flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        </span>
                      </div>

                      {/* Title & Company */}
                      <div>
                        <h2 className="font-bold text-base text-content-primary group-hover:text-blue-600 transition-colors line-clamp-1">
                          {job.title}
                        </h2>
                        <p className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{job.companyName}</span>
                        </p>
                      </div>

                      {/* Location & Employment Type */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-content-secondary">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-content-secondary/70" />
                          <span>{job.location}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-content-secondary/70" />
                          <span>{job.employmentType}</span>
                        </span>
                      </div>

                      {/* Skills Chips */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {job.skills.slice(0, 3).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] font-medium px-2 py-0.5 rounded bg-surface-bg border border-brandBorder text-content-secondary"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded text-content-secondary">
                              +{job.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Salary */}
                      {salaryStr && (
                        <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block">
                          {salaryStr}
                        </div>
                      )}
                    </div>

                    {/* Card Footer Action */}
                    <div className="pt-4 mt-4 border-t border-brandBorder flex items-center justify-between">
                      <span className="text-[11px] text-content-secondary">
                        {job.experienceLevel || 'Mid Level'}
                      </span>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="btn-primary !py-1.5 !px-3 text-xs inline-flex items-center gap-1.5 group-hover:bg-blue-600"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* Pagination Controls                                           */}
          {/* ------------------------------------------------------------- */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn-outline !py-2 !px-3 text-xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs text-content-secondary px-3">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn-outline !py-2 !px-3 text-xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default JobsPage;
