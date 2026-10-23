/**
 * SmartHire Centralized API Service
 * Encapsulates all HTTP requests between the React frontend and Express backend.
 *
 * Key Architectural Features:
 *  - Uses credentials: 'include' on all requests to exchange HTTP-only JWT cookies.
 *  - Handles both JSON payloads and multipart FormData (resumes).
 *  - Formats errors cleanly for responsive user alerts.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Core HTTP Request Wrapper
 * @param {string} endpoint - API route path (e.g. '/auth/login')
 * @param {object} options - Fetch options (method, body, headers)
 * @returns {Promise<any>} Parsed response data
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    Accept: 'application/json',
  };

  const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('smarthire_token') : null;
  if (storedToken) {
    defaultHeaders['Authorization'] = `Bearer ${storedToken}`;
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  // Automatically attach Content-Type for JSON payloads (do not set for FormData)
  if (options.body && !isFormData && typeof options.body === 'object') {
    defaultHeaders['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // CRITICAL: 'include' ensures browser transmits and receives HTTP-only cookies cross-origin
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        (data && data.message) ||
        `Request failed with status ${response.status} (${response.statusText})`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (!error.status) {
      error.message =
        'Unable to connect to the SmartHire server. Please verify the backend is running at ' +
        API_BASE_URL;
    }
    throw error;
  }
}

// -------------------------------------------------------------
// Authentication Service Endpoints
// -------------------------------------------------------------
export const authService = {
  async register(userData) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: userData,
    });
    if (data && data.token && typeof localStorage !== 'undefined') {
      localStorage.setItem('smarthire_token', data.token);
    }
    return data;
  },

  async login(credentials) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    if (data && data.token && typeof localStorage !== 'undefined') {
      localStorage.setItem('smarthire_token', data.token);
    }
    return data;
  },

  getMe() {
    return request('/auth/me', {
      method: 'GET',
    });
  },

  async logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('smarthire_token');
    }
    return request('/auth/logout', {
      method: 'POST',
    });
  },
};

// -------------------------------------------------------------
// Job Seeker Profile & Resume Service
// -------------------------------------------------------------
export const profileService = {
  getProfile() {
    return request('/profiles/me', { method: 'GET' });
  },

  updateProfile(data) {
    return request('/profiles/me', { method: 'PUT', body: data });
  },

  uploadResume(formData) {
    return request('/profiles/resume', { method: 'POST', body: formData });
  },

  deleteResume() {
    return request('/profiles/resume', { method: 'DELETE' });
  },

  getSeekerStats() {
    return request('/profiles/dashboard-stats', { method: 'GET' });
  },

  getResumeDownloadUrl() {
    return `${API_BASE_URL}/profiles/resume/download`;
  },
};

// -------------------------------------------------------------
// Company Service (Employer Profile)
// -------------------------------------------------------------
export const companyService = {
  getMyCompany() {
    return request('/companies/me', { method: 'GET' });
  },

  updateMyCompany(data) {
    return request('/companies/me', { method: 'PUT', body: data });
  },

  getCompany(id) {
    return request(`/companies/${id}`, { method: 'GET' });
  },
};

// -------------------------------------------------------------
// Job Listings Service
// -------------------------------------------------------------
export const jobService = {
  getJobs(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    return request(`/jobs${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  getJob(id) {
    return request(`/jobs/${id}`, { method: 'GET' });
  },

  getMyJobs() {
    return request('/jobs/employer/my-jobs', { method: 'GET' });
  },

  createJob(jobData) {
    return request('/jobs', { method: 'POST', body: jobData });
  },

  updateJob(id, jobData) {
    return request(`/jobs/${id}`, { method: 'PUT', body: jobData });
  },

  updateJobStatus(id, status) {
    return request(`/jobs/${id}/status`, { method: 'PATCH', body: { status } });
  },
};

// -------------------------------------------------------------
// Applications Service
// -------------------------------------------------------------
export const applicationService = {
  apply(data) {
    return request('/applications', { method: 'POST', body: data });
  },

  getMyApplications() {
    return request('/applications/my-applications', { method: 'GET' });
  },

  withdraw(id) {
    return request(`/applications/${id}/withdraw`, { method: 'PATCH' });
  },

  getJobApplicants(jobId) {
    return request(`/applications/job/${jobId}`, { method: 'GET' });
  },

  updateStatus(id, status, notes = '') {
    return request(`/applications/${id}/status`, {
      method: 'PATCH',
      body: { status, notes },
    });
  },

  getEmployerStats() {
    return request('/applications/employer/dashboard-stats', { method: 'GET' });
  },

  getApplicationResumeUrl(applicationId) {
    return `${API_BASE_URL}/applications/${applicationId}/resume`;
  },
};

// -------------------------------------------------------------
// Admin Service Endpoints
// -------------------------------------------------------------
export const adminService = {
  getStats() {
    return request('/admin/stats', { method: 'GET' });
  },

  getUsers() {
    return request('/admin/users', { method: 'GET' });
  },

  toggleUserStatus(id) {
    return request(`/admin/users/${id}/status`, { method: 'PATCH' });
  },

  getJobs() {
    return request('/admin/jobs', { method: 'GET' });
  },

  moderateJob(id, status) {
    return request(`/admin/jobs/${id}/status`, { method: 'PATCH', body: { status } });
  },

  getApplications() {
    return request('/admin/applications', { method: 'GET' });
  },
};

// -------------------------------------------------------------
// System Health Service Endpoint
// -------------------------------------------------------------
export const healthService = {
  checkHealth() {
    return request('/health', { method: 'GET' });
  },
};

export default {
  auth: authService,
  profile: profileService,
  company: companyService,
  job: jobService,
  application: applicationService,
  admin: adminService,
  health: healthService,
};
