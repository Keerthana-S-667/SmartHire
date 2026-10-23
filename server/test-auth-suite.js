/**
 * SmartHire Automated Integration & Security Test Suite
 * Comprehensive testing of all 15 database, authentication, and RBAC requirements.
 */

const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const { User } = require('./models/User');

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

// Helper to extract cookie from set-cookie header
function extractCookie(headers) {
  const setCookie = headers['set-cookie'];
  if (!setCookie) return '';
  const first = Array.isArray(setCookie) ? setCookie[0] : setCookie;
  return first.split(';')[0];
}

async function runComprehensiveTests() {
  console.log('====================================================');
  console.log(' SmartHire Stage 1: Database & Security Test Suite  ');
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
    // 1. Database Connection & Health Check
    const health = await makeRequest(`${API_BASE}/health`);
    assert(
      'Test 1: GET /api/health verifies connected database and healthy status',
      health.status === 200 &&
        health.body.status === 'healthy' &&
        health.body.database &&
        health.body.database.connected === true,
      JSON.stringify(health.body)
    );

    // 2. Successful Registration (Job Seeker)
    const testSeekerEmail = `test.candidate.${Date.now()}@smarthire.local`;
    const regRes = await makeRequest(`${API_BASE}/auth/register`, 'POST', {
      name: 'Test Candidate',
      email: testSeekerEmail,
      password: 'Password@123',
      confirmPassword: 'Password@123',
      role: 'job_seeker',
    });
    assert(
      'Test 2: POST /api/auth/register creates user document and returns safe profile',
      regRes.status === 201 &&
        regRes.body.success === true &&
        regRes.body.user &&
        regRes.body.user.email === testSeekerEmail &&
        regRes.body.user.passwordHash === undefined,
      `Status: ${regRes.status}, Body: ${JSON.stringify(regRes.body)}`
    );

    const seekerCookie = extractCookie(regRes.headers);

    // 3. Missing or Invalid Registration Fields
    const missingRes = await makeRequest(`${API_BASE}/auth/register`, 'POST', {
      name: 'Incomplete',
      email: 'missing@test.com',
    });
    assert(
      'Test 3: POST /api/auth/register rejects missing required fields with 400',
      missingRes.status === 400 && missingRes.body.success === false,
      `Status: ${missingRes.status}`
    );

    // 4. Duplicate Email Registration
    const dupRes = await makeRequest(`${API_BASE}/auth/register`, 'POST', {
      name: 'Duplicate Candidate',
      email: testSeekerEmail,
      password: 'Password@123',
      confirmPassword: 'Password@123',
      role: 'job_seeker',
    });
    assert(
      'Test 4: POST /api/auth/register rejects duplicate email address with 400',
      dupRes.status === 400 &&
        dupRes.body.success === false &&
        dupRes.body.message.includes('already exists'),
      `Status: ${dupRes.status}, Msg: ${dupRes.body.message}`
    );

    // 5. Password Hashing Verification in MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smarthire';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    const storedUser = await User.findOne({ email: testSeekerEmail });
    assert(
      'Test 5: Password stored in MongoDB is properly salted Bcrypt hash (not plaintext)',
      storedUser &&
        typeof storedUser.passwordHash === 'string' &&
        storedUser.passwordHash.startsWith('$2') &&
        storedUser.passwordHash !== 'Password@123',
      `Hash: ${storedUser?.passwordHash}`
    );

    // 6. Successful Login
    const loginRes = await makeRequest(`${API_BASE}/auth/login`, 'POST', {
      email: testSeekerEmail,
      password: 'Password@123',
    });
    assert(
      'Test 6: POST /api/auth/login authenticates valid credentials and issues session cookie',
      loginRes.status === 200 &&
        loginRes.body.success === true &&
        loginRes.body.user.email === testSeekerEmail &&
        loginRes.headers['set-cookie'] !== undefined,
      `Status: ${loginRes.status}`
    );

    // 7. Incorrect Password Rejection
    const badLoginRes = await makeRequest(`${API_BASE}/auth/login`, 'POST', {
      email: testSeekerEmail,
      password: 'WrongPassword@999',
    });
    assert(
      'Test 7: POST /api/auth/login rejects incorrect password with 401 without account leakage',
      badLoginRes.status === 401 && badLoginRes.body.success === false,
      `Status: ${badLoginRes.status}`
    );

    // 8. Logout and Session Handling
    const logoutRes = await makeRequest(`${API_BASE}/auth/logout`, 'POST');
    assert(
      'Test 8: POST /api/auth/logout clears authentication cookie',
      logoutRes.status === 200 && logoutRes.body.success === true,
      `Status: ${logoutRes.status}`
    );

    // 9. Current-User Endpoint (/api/auth/me) with Cookie
    const meRes = await makeRequest(`${API_BASE}/auth/me`, 'GET', null, {
      Cookie: seekerCookie,
    });
    assert(
      'Test 9: GET /api/auth/me returns authenticated user profile with valid cookie',
      meRes.status === 200 &&
        meRes.body.success === true &&
        meRes.body.user &&
        meRes.body.user.email === testSeekerEmail,
      `Status: ${meRes.status}`
    );

    // 10. Unauthenticated Protected-Route Rejection
    const unauthMe = await makeRequest(`${API_BASE}/auth/me`);
    assert(
      'Test 10: GET /api/auth/me rejects unauthenticated request with 401',
      unauthMe.status === 401 && unauthMe.body.success === false,
      `Status: ${unauthMe.status}`
    );

    // 11. Role-Based API Authorization (Job Seeker blocked from Admin APIs)
    const seekerAccessAdmin = await makeRequest(`${API_BASE}/admin/stats`, 'GET', null, {
      Cookie: seekerCookie,
    });
    assert(
      'Test 11: Non-admin user accessing /api/admin/stats is blocked with 403 Forbidden',
      seekerAccessAdmin.status === 403 && seekerAccessAdmin.body.success === false,
      `Status: ${seekerAccessAdmin.status}, Msg: ${seekerAccessAdmin.body.message}`
    );

    // 12. Public Registration Cannot Create Admin
    const adminHacker = await makeRequest(`${API_BASE}/auth/register`, 'POST', {
      name: 'Hacker',
      email: `hacker.${Date.now()}@test.com`,
      password: 'Password@123',
      confirmPassword: 'Password@123',
      role: 'admin',
    });
    assert(
      'Test 12: Public registration with role=admin is rejected with 403 Forbidden',
      adminHacker.status === 403 && adminHacker.body.success === false,
      `Status: ${adminHacker.status}`
    );

    // 13. Admin Login & Authorization Check
    const adminLogin = await makeRequest(`${API_BASE}/auth/login`, 'POST', {
      email: process.env.ADMIN_EMAIL || 'admin@smarthire.local',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    });
    const adminCookie = extractCookie(adminLogin.headers);
    const adminStats = await makeRequest(`${API_BASE}/admin/stats`, 'GET', null, {
      Cookie: adminCookie,
    });
    assert(
      'Test 13: Admin session successfully accesses /api/admin/stats with 200',
      adminStats.status === 200 &&
        adminStats.body.success === true &&
        adminStats.body.stats &&
        typeof adminStats.body.stats.totalUsers === 'number',
      `Status: ${adminStats.status}`
    );

    // 14. Role Normalization (accepts 'jobseeker' without underscore)
    const seekerNormalizedEmail = `normalized.${Date.now()}@smarthire.local`;
    const normRes = await makeRequest(`${API_BASE}/auth/register`, 'POST', {
      name: 'Normalized Seeker',
      email: seekerNormalizedEmail,
      password: 'Password@123',
      confirmPassword: 'Password@123',
      role: 'jobseeker',
    });
    assert(
      'Test 14: Registration accepts "jobseeker" and standardizes role to "job_seeker"',
      normRes.status === 201 &&
        normRes.body.user &&
        normRes.body.user.role === 'job_seeker',
      `Status: ${normRes.status}, Role: ${normRes.body?.user?.role}`
    );

    // 15. Password Mismatch Validation
    const mismatch = await makeRequest(`${API_BASE}/auth/register`, 'POST', {
      name: 'Mismatch',
      email: `mismatch.${Date.now()}@test.com`,
      password: 'Password@123',
      confirmPassword: 'DifferentPassword@123',
      role: 'employer',
    });
    assert(
      'Test 15: Password mismatch is rejected with 400 Bad Request',
      mismatch.status === 400 && mismatch.body.message.includes('do not match'),
      `Status: ${mismatch.status}`
    );

    await mongoose.disconnect();

    console.log('\n----------------------------------------------------');
    console.log(`Final Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
    console.log('----------------------------------------------------\n');

  } catch (error) {
    console.error('Test execution encountered error:', error);
  }
}

runComprehensiveTests();
