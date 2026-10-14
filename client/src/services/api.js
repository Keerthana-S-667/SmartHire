/**
 * SmartHire Centralized API Service
 * Encapsulates all HTTP requests between the React frontend and Express backend.
 *
 * Key Architectural Features:
 *  - Uses credentials: 'include' on all requests to exchange HTTP-only JWT cookies.
 *  - Loads baseURL from VITE_API_URL environment variable.
 *  - Formats errors cleanly so components can display friendly user alerts.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Core HTTP Request Wrapper
 * @param {string} endpoint - API route path (e.g. '/auth/login')
 * @param {object} options - Fetch options (method, body, headers)
 * @returns {Promise<any>} Parsed response data
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Accept': 'application/json',
  };

  // Automatically attach Content-Type for JSON payloads
  if (options.body && typeof options.body === 'object') {
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
    // If it's a network error (e.g. server down / CORS failure)
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
  /**
   * Register a new Job Seeker or Employer
   */
  register(userData) {
    return request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  },

  /**
   * Log into account and receive HTTP-only cookie
   */
  login(credentials) {
    return request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  /**
   * Retrieve current user profile using active session cookie
   */
  getMe() {
    return request('/auth/me', {
      method: 'GET',
    });
  },

  /**
   * Destroy session cookie on backend
   */
  logout() {
    return request('/auth/logout', {
      method: 'POST',
    });
  },
};

// -------------------------------------------------------------
// Admin Service Endpoints
// -------------------------------------------------------------
export const adminService = {
  /**
   * Get aggregate platform stats (user counts, DB status)
   */
  getStats() {
    return request('/admin/stats', {
      method: 'GET',
    });
  },

  /**
   * Get registered users list for administrative view
   */
  getUsers() {
    return request('/admin/users', {
      method: 'GET',
    });
  },
};

// -------------------------------------------------------------
// System Health Service Endpoint
// -------------------------------------------------------------
export const healthService = {
  /**
   * Inspect backend and MongoDB connection status
   */
  checkHealth() {
    return request('/health', {
      method: 'GET',
    });
  },
};

export default {
  auth: authService,
  admin: adminService,
  health: healthService,
};
