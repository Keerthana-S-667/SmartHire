/**
 * Employer Job Form Page (Create / Edit Job)
 * Form for authoring and updating job listings with role requirements,
 * compensation ranges, workplace modes, and skill inventories.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { jobService } from '../services/api';
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  X,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const EmployerJobFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: [''],
    qualifications: [''],
    skills: [],
    location: '',
    workplaceMode: 'On-site',
    employmentType: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryMin: '',
    salaryMax: '',
    openings: 1,
    deadline: '',
    status: 'published',
  });

  const [skillInput, setSkillInput] = useState('');

  // If editing, load existing job data from database
  useEffect(() => {
    if (isEditing) {
      const fetchJob = async () => {
        try {
          setLoading(true);
          const res = await jobService.getJob(id);
          if (res && res.job) {
            const j = res.job;
            setFormData({
              title: j.title || '',
              description: j.description || '',
              responsibilities: j.responsibilities?.length ? j.responsibilities : [''],
              qualifications: j.qualifications?.length ? j.qualifications : [''],
              skills: j.skills || [],
              location: j.location || '',
              workplaceMode: j.workplaceMode || 'On-site',
              employmentType: j.employmentType || 'Full-time',
              experienceLevel: j.experienceLevel || 'Mid Level',
              salaryMin: j.salaryMin !== null ? String(j.salaryMin) : '',
              salaryMax: j.salaryMax !== null ? String(j.salaryMax) : '',
              openings: j.openings || 1,
              deadline: j.deadline ? j.deadline.split('T')[0] : '',
              status: j.status || 'published',
            });
          }
        } catch (err) {
          setFeedback({ type: 'error', message: err.message || 'Failed to load job details.' });
        } finally {
          setLoading(false);
        }
      };

      fetchJob();
    }
  }, [id, isEditing]);

  // Skill tags management
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (trimmed && !formData.skills.includes(trimmed)) {
        setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Responsibilities management
  const handleAddResponsibility = () => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ''],
    }));
  };

  const handleUpdateResponsibility = (idx, value) => {
    const updated = [...formData.responsibilities];
    updated[idx] = value;
    setFormData((prev) => ({ ...prev, responsibilities: updated }));
  };

  const handleRemoveResponsibility = (idx) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== idx),
    }));
  };

  // Qualifications management
  const handleAddQualification = () => {
    setFormData((prev) => ({
      ...prev,
      qualifications: [...prev.qualifications, ''],
    }));
  };

  const handleUpdateQualification = (idx, value) => {
    const updated = [...formData.qualifications];
    updated[idx] = value;
    setFormData((prev) => ({ ...prev, qualifications: updated }));
  };

  const handleRemoveQualification = (idx) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== idx),
    }));
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFeedback({ type: '', message: '' });

      // Validate salary
      if (formData.salaryMin && formData.salaryMax) {
        if (Number(formData.salaryMin) > Number(formData.salaryMax)) {
          setFeedback({
            type: 'error',
            message: 'Minimum salary cannot exceed maximum salary.',
          });
          setSubmitting(false);
          return;
        }
      }

      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
        openings: Number(formData.openings) || 1,
        responsibilities: formData.responsibilities.filter((r) => r.trim()),
        qualifications: formData.qualifications.filter((q) => q.trim()),
        deadline: formData.deadline ? new Date(formData.deadline) : null,
      };

      if (isEditing) {
        await jobService.updateJob(id, payload);
        setFeedback({ type: 'success', message: 'Job posting updated successfully!' });
      } else {
        await jobService.createJob(payload);
        setFeedback({ type: 'success', message: 'Job posting published successfully!' });
      }

      setTimeout(() => {
        navigate('/employer/jobs');
      }, 1200);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save job posting.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title={isEditing ? 'Edit Job Posting' : 'Create Job Posting'}
        subtitle="Configure role requirements and candidate criteria."
      >
        <div className="card-container p-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-sm text-content-secondary">Loading job listing details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={isEditing ? 'Edit Job Posting' : 'Create New Job Posting'}
      subtitle="Define role specifications, qualifications, workplace mode, and compensation."
    >
      <div className="space-y-6 max-w-4xl">
        
        <div>
          <Link
            to="/employer/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-secondary hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Job Postings</span>
          </Link>
        </div>

        {feedback.message && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-status-success-bg text-status-success-text border border-status-success-border'
                : 'bg-status-error-bg text-status-error-text border border-status-error-border'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Core Job Details */}
          <div className="card-container space-y-4">
            <h2 className="font-bold text-base text-content-primary border-b border-brandBorder pb-2">
              Role Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Job Title <span className="text-status-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field text-sm"
                  placeholder="e.g. Senior Full Stack Engineer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Workplace Mode <span className="text-status-error">*</span>
                </label>
                <select
                  value={formData.workplaceMode}
                  onChange={(e) => setFormData({ ...formData, workplaceMode: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Employment Type <span className="text-status-error">*</span>
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Primary Location (City, Country) <span className="text-status-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field text-sm"
                  placeholder="e.g. Bengaluru, India or Remote"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="Entry Level">Entry Level (0-2 years)</option>
                  <option value="Mid Level">Mid Level (3-5 years)</option>
                  <option value="Senior Level">Senior Level (5-8 years)</option>
                  <option value="Lead / Manager">Lead / Manager (8+ years)</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Job Description <span className="text-status-error">*</span>
                </label>
                <textarea
                  required
                  rows="5"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field text-sm resize-none"
                  placeholder="Provide an overview of the role, your team, and what the candidate will work on..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 2: Key Responsibilities */}
          <div className="card-container space-y-4">
            <div className="flex items-center justify-between border-b border-brandBorder pb-2">
              <h2 className="font-bold text-base text-content-primary">
                Responsibilities
              </h2>
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="btn-outline !py-1 !px-2.5 text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => handleUpdateResponsibility(idx, e.target.value)}
                    className="input-field text-xs flex-1"
                    placeholder="e.g. Architect and deploy RESTful microservices using Node.js"
                  />
                  {formData.responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(idx)}
                      className="p-2 text-content-secondary hover:text-status-error transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Qualifications */}
          <div className="card-container space-y-4">
            <div className="flex items-center justify-between border-b border-brandBorder pb-2">
              <h2 className="font-bold text-base text-content-primary">
                Qualifications & Requirements
              </h2>
              <button
                type="button"
                onClick={handleAddQualification}
                className="btn-outline !py-1 !px-2.5 text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.qualifications.map((qual, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={qual}
                    onChange={(e) => handleUpdateQualification(idx, e.target.value)}
                    className="input-field text-xs flex-1"
                    placeholder="e.g. 3+ years experience with React, TypeScript, and modern state management"
                  />
                  {formData.qualifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQualification(idx)}
                      className="p-2 text-content-secondary hover:text-status-error transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Skills Required */}
          <div className="card-container space-y-3">
            <h2 className="font-bold text-base text-content-primary border-b border-brandBorder pb-2">
              Required Skills
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                className="input-field text-sm flex-1"
                placeholder="Type a skill and press Enter (e.g. React, Node.js, MongoDB)"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="btn-secondary !py-2 !px-4 text-xs font-semibold shrink-0"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {formData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-status-error transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 5: Compensation, Openings & Publication */}
          <div className="card-container space-y-4">
            <h2 className="font-bold text-base text-content-primary border-b border-brandBorder pb-2">
              Compensation, Openings & Publication
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Min Salary (Annual ₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  placeholder="e.g. 800000"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Max Salary (Annual ₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  placeholder="e.g. 1500000"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Number of Openings
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.openings}
                  onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Application Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Publication Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="published">Published (Visible to candidates)</option>
                  <option value="draft">Draft (Private)</option>
                  {isEditing && <option value="closed">Closed</option>}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <Link to="/employer/jobs" className="btn-outline !py-2.5 !px-5 text-sm">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary !py-2.5 !px-6 text-sm flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Job...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Publish Job'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </DashboardLayout>
  );
};

export default EmployerJobFormPage;
