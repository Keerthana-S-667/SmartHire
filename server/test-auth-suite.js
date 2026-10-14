/**
 * SmartHire Automated Test Suite
 * Tests API endpoints, validation logic, role security, and error handling.
 */

const http = require('http');

const API_BASE = 'http://localhost:5000/api';

function makeRequest(url, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = body ? JSON.stringify(body) : null;

    const reqHeaders = {
      ...headers,
      ...(postData && {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      }),
    };

    const req = http.request(
      {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('   SmartHire Stage 1: API & Security Test Suite    ');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(title, condition, details = '') {
    total++;
    if (condition) {
      console.log(`[PASS] ${title}`);
      passed++;
    } else {
      console.error(`[FAIL] ${title} - ${details}`);
    }
  }

  try {
    // Test 1: GET /api/health
    const health = await makeRequest(`${API_BASE}/health`);
    assert(
      'GET /api/health returns valid JSON with database status',
      health.body && typeof health.body.stage === 'string' && health.body.stage.includes('Stage 1'),
      JSON.stringify(health.body)
    );

    // Test 2: Unauthenticated /api/auth/me should be 401
    const unauthMe = await makeRequest(`${API_BASE}/auth/me`);
    assert(
      'GET /api/auth/me rejects unauthenticated request with 401',
      unauthMe.status === 401 && unauthMe.body.success === false,
      `Status: ${unauthMe.status}`
    );

    // Test 3: Unauthenticated /api/admin/stats should be 401
    const unauthStats = await makeRequest(`${API_BASE}/admin/stats`);
    assert(
      'GET /api/admin/stats rejects unauthenticated access with 401',
      unauthStats.status === 401 && unauthStats.body.success === false,
      `Status: ${unauthStats.status}`
    );

    // Test 4: Unauthenticated /api/admin/users should be 401
    const unauthUsers = await makeRequest(`${API_BASE}/admin/users`);
    assert(
      'GET /api/admin/users rejects unauthenticated access with 401',
      unauthUsers.status === 401 && unauthUsers.body.success === false,
      `Status: ${unauthUsers.status}`
    );

    // Test 5: Register with role 'admin' MUST be rejected with 403
    const adminRegister = await makeRequest(`${API_BASE}/auth/register`, 'POST', {
      name: 'Hacker Admin',
      email: 'hacker@admin.com',
      password: 'Password@123',
      confirmPassword: 'Password@123',
      role: 'admin',
    });
    assert(
      'POST /api/auth/register prevents public admin creation with 403 Forbidden',
      adminRegister.status === 403 && adminRegister.body.success === false,
      `Status: ${adminRegister.status}, Msg: ${adminRegister.body.message}`
    );

    // Test 6: Register with missing fields
    const missingFields = await makeRequest(`${API_BASE}/auth/register`, 'POST', {
      name: 'Incomplete',
      email: 'incomplete@test.com',
    });
    assert(
      'POST /api/auth/register rejects missing fields with 400 Bad Request',
      missingFields.status === 400 && missingFields.body.success === false,
      `Status: ${missingFields.status}`
    );

    // Test 7: Register with password mismatch
    const mismatchPass = await makeRequest(`${API_BASE}/auth/register`, 'POST', {
      name: 'Mismatch User',
      email: 'mismatch@test.com',
      password: 'Password123',
      confirmPassword: 'DifferentPassword123',
      role: 'job_seeker',
    });
    assert(
      'POST /api/auth/register rejects mismatched passwords with 400',
      mismatchPass.status === 400 && mismatchPass.body.message.includes('Passwords do not match'),
      `Msg: ${mismatchPass.body.message}`
    );

    // Test 8: Register with password shorter than 6 characters
    const shortPass = await makeRequest(`${API_BASE}/auth/register`, 'POST', {
      name: 'Short Pass',
      email: 'short@test.com',
      password: '123',
      confirmPassword: '123',
      role: 'job_seeker',
    });
    assert(
      'POST /api/auth/register enforces minimum 6-character password with 400',
      shortPass.status === 400 && shortPass.body.message.includes('at least 6 characters'),
      `Msg: ${shortPass.body.message}`
    );

    // Test 9: Login with missing credentials
    const missingLogin = await makeRequest(`${API_BASE}/auth/login`, 'POST', {
      email: '',
      password: '',
    });
    assert(
      'POST /api/auth/login rejects empty credentials with 400',
      missingLogin.status === 400 && missingLogin.body.success === false,
      `Status: ${missingLogin.status}`
    );

    // Test 10: Logout endpoint
    const logoutRes = await makeRequest(`${API_BASE}/auth/logout`, 'POST');
    assert(
      'POST /api/auth/logout succeeds and clears session cookie',
      logoutRes.status === 200 && logoutRes.body.success === true,
      `Status: ${logoutRes.status}`
    );

    console.log('\n----------------------------------------------------');
    console.log(`Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
    console.log('----------------------------------------------------\n');

  } catch (error) {
    console.error('Test execution error:', error);
  }
}

runTests();
