/**
 * Employer Company Profile Page
 * Organization settings, company branding, industry classification,
 * headquarters location, and talent contact information.
 */

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { companyService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Mail,
  Phone,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
} from 'lucide-react';

const EmployerProfilePage = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    industry: 'Technology',
    website: '',
    location: '',
    companySize: '11-50',
    contactEmail: '',
    contactPhone: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const loadCompany = async () => {
    try {
      setLoading(true);
      const res = await companyService.getMyCompany();
      if (res && res.company) {
        setFormData({
          companyName: res.company.companyName || user?.name || '',
          description: res.company.description || '',
          industry: res.company.industry || 'Technology',
          website: res.company.website || '',
          location: res.company.location || '',
          companySize: res.company.companySize || '11-50',
          contactEmail: res.company.contactEmail || user?.email || '',
          contactPhone: res.company.contactPhone || '',
        });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load company profile.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompany();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback({ type: '', message: '' });

      const res = await companyService.updateMyCompany(formData);
      setFeedback({ type: 'success', message: 'Company profile updated successfully!' });
      if (res.company) {
        setFormData((prev) => ({
          ...prev,
          companyName: res.company.companyName,
          description: res.company.description,
          industry: res.company.industry,
          website: res.company.website,
          location: res.company.location,
          companySize: res.company.companySize,
          contactEmail: res.company.contactEmail,
          contactPhone: res.company.contactPhone,
        }));
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update company profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Company Profile"
        subtitle="Manage your organizational presence on SmartHire."
      >
        <div className="card-container p-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-sm text-content-secondary">Loading company profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Company Profile"
      subtitle="Manage your organization's identity, industry details, and hiring contact info."
    >
      <div className="space-y-6 max-w-3xl">
        
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card-container space-y-5">
            <div className="flex items-center gap-2.5 border-b border-brandBorder pb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-content-primary">Organization Information</h2>
                <p className="text-xs text-content-secondary">
                  This information appears across your published job postings.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Company Name <span className="text-status-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="input-field text-sm"
                  placeholder="e.g. Acme Innovations Technologies"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="Technology">Technology & Software</option>
                  <option value="Finance">Finance & Banking</option>
                  <option value="Healthcare">Healthcare & Life Sciences</option>
                  <option value="Education">Education & EdTech</option>
                  <option value="Retail">Retail & E-commerce</option>
                  <option value="Manufacturing">Manufacturing & Engineering</option>
                  <option value="Consulting">Consulting & Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Company Size
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="51-200">51-200 Employees</option>
                  <option value="201-500">201-500 Employees</option>
                  <option value="500+">500+ Employees</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Headquarters Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field text-sm"
                  placeholder="e.g. Bengaluru, India"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Company Website URL
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="input-field text-sm"
                  placeholder="https://company.example.com"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Company Overview & Mission
                </label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field text-sm resize-none"
                  placeholder="Describe your company culture, products, and what makes working at your organization unique..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Hiring Contact Information */}
          <div className="card-container space-y-4">
            <div className="flex items-center gap-2.5 border-b border-brandBorder pb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-content-primary">Recruiting Contact Details</h2>
                <p className="text-xs text-content-secondary">
                  Contact channels for candidate inquiries.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="input-field text-sm"
                  placeholder="careers@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="input-field text-sm"
                  placeholder="+91 80 1234 5678"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary !py-2.5 !px-6 text-sm flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Company Profile</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </DashboardLayout>
  );
};

export default EmployerProfilePage;
