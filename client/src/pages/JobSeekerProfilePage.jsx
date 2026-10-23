/**
 * Job Seeker Profile Page
 * Comprehensive candidate profile manager with skills inventory, education,
 * work experience, career preferences, and secure resume document management.
 */

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { profileService, API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Briefcase,
  GraduationCap,
  FileText,
  Upload,
  Trash2,
  Download,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react';

const JobSeekerProfilePage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    headline: '',
    bio: '',
    experienceYears: 0,
    skills: [],
    education: [],
    experience: [],
    preferredRoles: [],
    preferredLocations: [],
    employmentTypes: ['Full-time'],
  });

  const [newSkill, setNewSkill] = useState('');
  const [resume, setResume] = useState(null);

  // Load existing profile from MongoDB
  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await profileService.getProfile();
      if (res.profile) {
        setFormData({
          fullName: res.profile.fullName || user?.name || '',
          phone: res.profile.phone || '',
          location: res.profile.location || '',
          headline: res.profile.headline || '',
          bio: res.profile.bio || '',
          experienceYears: res.profile.experienceYears || 0,
          skills: res.profile.skills || [],
          education: res.profile.education || [],
          experience: res.profile.experience || [],
          preferredRoles: res.profile.preferredRoles || [],
          preferredLocations: res.profile.preferredLocations || [],
          employmentTypes: res.profile.employmentTypes || ['Full-time'],
        });
        setResume(res.profile.resume || null);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load profile.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Handle skill tag addition
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const trimmed = newSkill.trim();
      if (trimmed && !formData.skills.includes(trimmed)) {
        setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
        setNewSkill('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Education handlers
  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' },
      ],
    }));
  };

  const handleUpdateEducation = (index, field, value) => {
    const updated = [...formData.education];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, education: updated }));
  };

  const handleRemoveEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Work experience handlers
  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: '',
          title: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    }));
  };

  const handleUpdateExperience = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, experience: updated }));
  };

  const handleRemoveExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Submit profile updates
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback({ type: '', message: '' });

      const res = await profileService.updateProfile(formData);
      setFeedback({ type: 'success', message: 'Profile saved successfully!' });
      if (res.profile) {
        setFormData((prev) => ({
          ...prev,
          fullName: res.profile.fullName || prev.fullName,
          phone: res.profile.phone || prev.phone,
          location: res.profile.location || prev.location,
          headline: res.profile.headline || prev.headline,
          bio: res.profile.bio || prev.bio,
          experienceYears: res.profile.experienceYears || prev.experienceYears,
          skills: res.profile.skills || prev.skills,
        }));
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error saving profile.' });
    } finally {
      setSaving(false);
    }
  };

  // Resume file upload
  const handleResumeFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'Resume file size cannot exceed 5MB.' });
      return;
    }

    // Validate file type
    const validExtensions = ['.pdf', '.docx'];
    const isDoc = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!isDoc) {
      setFeedback({ type: 'error', message: 'Please select a valid PDF (.pdf) or Word (.docx) document.' });
      return;
    }

    const uploadForm = new FormData();
    uploadForm.append('resume', file);

    try {
      setUploadingResume(true);
      setFeedback({ type: '', message: '' });

      const res = await profileService.uploadResume(uploadForm);
      setResume(res.resume);
      setFeedback({ type: 'success', message: 'Resume uploaded successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to upload resume.' });
    } finally {
      setUploadingResume(false);
      // Reset input element
      e.target.value = null;
    }
  };

  // Delete resume
  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to remove your resume?')) return;

    try {
      await profileService.deleteResume();
      setResume(null);
      setFeedback({ type: 'success', message: 'Resume removed successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to remove resume.' });
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="My Professional Profile" subtitle="Manage your candidate details and resume">
        <div className="card-container p-12 text-center text-content-secondary space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-sm">Loading profile data from database...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="My Professional Profile"
      subtitle="Keep your professional profile and resume updated to match with the best opportunities."
    >
      <div className="space-y-8 max-w-4xl">
        {/* Feedback Alert */}
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

        {/* ------------------------------------------------------------- */}
        {/* SECTION 1: Resume Upload & Management Card                    */}
        {/* ------------------------------------------------------------- */}
        <div className="card-container space-y-4">
          <div className="flex items-center justify-between border-b border-brandBorder pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-content-primary">Resume Document</h2>
                <p className="text-xs text-content-secondary">
                  PDF or DOCX format, maximum 5MB. Stored securely on server.
                </p>
              </div>
            </div>
            {resume && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-status-success-bg text-status-success-text border border-status-success-border">
                Active Resume Attached
              </span>
            )}
          </div>

          {resume ? (
            <div className="p-4 rounded-xl bg-surface-bg border border-brandBorder flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                  PDF
                </div>
                <div>
                  <p className="text-sm font-bold text-content-primary truncate max-w-xs sm:max-w-md">
                    {resume.originalName}
                  </p>
                  <p className="text-xs text-content-secondary">
                    {resume.size ? `${(resume.size / 1024).toFixed(1)} KB • ` : ''}
                    Uploaded {new Date(resume.uploadedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <a
                  href={profileService.getResumeDownloadUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
                <label className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Replace</span>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleResumeFileChange}
                    disabled={uploadingResume}
                  />
                </label>
                <button
                  type="button"
                  onClick={handleDeleteResume}
                  className="p-2 text-status-error hover:bg-status-error-bg rounded-lg transition-colors border border-transparent hover:border-status-error-border"
                  title="Delete Resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-brandBorder rounded-xl p-8 text-center space-y-3 bg-surface-bg hover:bg-blue-50/50 transition-colors">
              <Upload className="w-8 h-8 text-blue-500 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-content-primary">
                  Upload your professional resume
                </p>
                <p className="text-xs text-content-secondary">
                  Accepted formats: PDF or DOCX (up to 5MB)
                </p>
              </div>
              <div>
                <label className="btn-primary !py-2 !px-4 text-xs inline-flex items-center gap-2 cursor-pointer">
                  {uploadingResume ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Select Resume File</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleResumeFileChange}
                    disabled={uploadingResume}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: Core Profile Information Form                      */}
        {/* ------------------------------------------------------------- */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="card-container space-y-5">
            <div className="flex items-center gap-2.5 border-b border-brandBorder pb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-content-primary">Personal & Contact Details</h2>
                <p className="text-xs text-content-secondary">Basic information visible to prospective employers.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Full Name <span className="text-status-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field text-sm"
                  placeholder="e.g. Priya Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Email Address (Account ID)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="input-field text-sm bg-gray-100 cursor-not-allowed text-content-secondary"
                  title="Email cannot be changed directly"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field text-sm"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Current Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field text-sm"
                  placeholder="e.g. Bengaluru, Karnataka"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="input-field text-sm"
                  placeholder="e.g. Full Stack Developer | React, Node.js & MongoDB Specialist"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Total Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="input-field text-sm max-w-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Professional Summary / Bio
                </label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="input-field text-sm resize-none"
                  placeholder="Briefly describe your career background, primary domains, and achievements..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 3: Skills Inventory                                   */}
          {/* ------------------------------------------------------------- */}
          <div className="card-container space-y-4">
            <div className="flex items-center gap-2.5 border-b border-brandBorder pb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-content-primary">Skills & Competencies</h2>
                <p className="text-xs text-content-secondary">
                  Add key technical and soft skills to improve job matching.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                className="input-field text-sm flex-1"
                placeholder="Type a skill and press Enter (e.g. React, MongoDB, REST APIs)"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="btn-secondary !py-2 !px-4 text-xs font-semibold shrink-0"
              >
                Add Skill
              </button>
            </div>

            {/* Skill Tags Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-semibold"
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
              {formData.skills.length === 0 && (
                <p className="text-xs text-content-secondary italic">
                  No skills added yet. Add a few above to enhance your profile.
                </p>
              )}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 4: Education History                                  */}
          {/* ------------------------------------------------------------- */}
          <div className="card-container space-y-4">
            <div className="flex items-center justify-between border-b border-brandBorder pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-content-primary">Education</h2>
                  <p className="text-xs text-content-secondary">Academic degrees, certifications, or diplomas.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddEducation}
                className="btn-outline !py-1.5 !px-3 text-xs flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Education</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-surface-bg border border-brandBorder space-y-3 relative"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(idx)}
                    className="absolute top-3 right-3 p-1 text-content-secondary hover:text-status-error transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <div>
                      <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                        Institution / University
                      </label>
                      <input
                        type="text"
                        value={edu.institution || ''}
                        onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                        className="input-field text-xs"
                        placeholder="e.g. Stanford University"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                        className="input-field text-xs"
                        placeholder="e.g. B.Tech / Bachelor of Science"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => handleUpdateEducation(idx, 'fieldOfStudy', e.target.value)}
                        className="input-field text-xs"
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                        Graduation Year
                      </label>
                      <input
                        type="text"
                        value={edu.endYear || ''}
                        onChange={(e) => handleUpdateEducation(idx, 'endYear', e.target.value)}
                        className="input-field text-xs"
                        placeholder="e.g. 2024"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.education.length === 0 && (
                <p className="text-xs text-content-secondary italic text-center py-2">
                  No education entries added yet. Click &quot;Add Education&quot; above.
                </p>
              )}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 5: Work Experience                                    */}
          {/* ------------------------------------------------------------- */}
          <div className="card-container space-y-4">
            <div className="flex items-center justify-between border-b border-brandBorder pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-content-primary">Work Experience</h2>
                  <p className="text-xs text-content-secondary">Past roles, responsibilities, and internships.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddExperience}
                className="btn-outline !py-1.5 !px-3 text-xs flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-surface-bg border border-brandBorder space-y-3 relative"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(idx)}
                    className="absolute top-3 right-3 p-1 text-content-secondary hover:text-status-error transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <div>
                      <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                        className="input-field text-xs"
                        placeholder="e.g. Acme Corp"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={exp.title || ''}
                        onChange={(e) => handleUpdateExperience(idx, 'title', e.target.value)}
                        className="input-field text-xs"
                        placeholder="e.g. Junior Web Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={exp.startDate || ''}
                        onChange={(e) => handleUpdateExperience(idx, 'startDate', e.target.value)}
                        className="input-field text-xs"
                        placeholder="e.g. Jan 2022"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                        End Date
                      </label>
                      <input
                        type="text"
                        disabled={exp.current}
                        value={exp.current ? 'Present' : exp.endDate || ''}
                        onChange={(e) => handleUpdateExperience(idx, 'endDate', e.target.value)}
                        className="input-field text-xs"
                        placeholder="e.g. Dec 2023 or Present"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-2 text-xs text-content-primary cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.current || false}
                          onChange={(e) => handleUpdateExperience(idx, 'current', e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>I currently work in this role</span>
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                        Responsibilities & Highlights
                      </label>
                      <textarea
                        rows="2"
                        value={exp.description || ''}
                        onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                        className="input-field text-xs resize-none"
                        placeholder="Summarize key projects, technologies used, and outcomes achieved..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
              {formData.experience.length === 0 && (
                <p className="text-xs text-content-secondary italic text-center py-2">
                  No work experience entries added yet. Click &quot;Add Position&quot; above.
                </p>
              )}
            </div>
          </div>

          {/* Form Submit Bar */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary !py-3 !px-6 text-sm flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default JobSeekerProfilePage;
