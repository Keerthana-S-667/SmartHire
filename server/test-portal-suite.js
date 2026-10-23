/**
 * SmartHire - Complete Job Portal Integration Test Suite
 * Tests Job Seeker, Employer, and Admin workflows using Node.js standard libraries.
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

const API_BASE = 'http://localhost:5000/api';

function makeRequest(url, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;

    const reqHeaders = {
      ...headers,
      ...(postData && !headers['Content-Type'] && {
        'Content-Type': 'application/json',
      }),
      ...(postData && {
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
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsed,
          });
        });
      }
    );

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

function extractCookie(headers) {
  const setCookie = headers['set-cookie'];
  if (!setCookie) return '';
  return Array.isArray(setCookie) ? setCookie[0].split(';')[0] : setCookie.split(';')[0];
}

const runTests = async () => {
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${details}`);
      failed++;
    }
  };

  console.log('====================================================');
  console.log(' SmartHire: Job Portal Functional Test Suite');
  console.log('====================================================\n');

  const timestamp = Date.now();
  const employerEmail = `emp_${timestamp}@portal.test`;
  const seekerEmail = `seeker_${timestamp}@portal.test`;
  const password = 'Password@123';

  let employerCookie = '';
  let seekerCookie = '';
  let createdJobId = '';
  let createdAppId = '';

  try {
    // 1. Register Employer
    const empReg = await makeRequest(`${API_BASE}/auth/register`, 'POST', {
      name: 'Acme Recruiter',
      email: employerEmail,
      password,
      confirmPassword: password,
      role: 'employer',
    });
    employerCookie = extractCookie(empReg.headers);
    assert(empReg.statusCode === 201 && empReg.data.user?.role === 'employer', 'Test 1: Register Employer account');

    // 2. Register Job Seeker
    const seekerReg = await makeRequest(`${API_BASE}/auth/register`, 'POST', {
      name: 'Rohan Developer',
      email: seekerEmail,
      password,
      confirmPassword: password,
      role: 'job_seeker',
    });
    seekerCookie = extractCookie(seekerReg.headers);
    assert(seekerReg.statusCode === 201 && seekerReg.data.user?.role === 'job_seeker', 'Test 2: Register Job Seeker account');

    // 3. Update Employer Company Profile
    const compRes = await makeRequest(
      `${API_BASE}/companies/me`,
      'PUT',
      {
        companyName: 'Acme Innovations',
        description: 'Building next-gen enterprise tools',
        industry: 'Software',
        location: 'Bengaluru, India',
        companySize: '51-200',
        website: 'https://acme.example.com',
      },
      { Cookie: employerCookie }
    );
    assert(compRes.statusCode === 200 && compRes.data.company?.companyName === 'Acme Innovations', 'Test 3: Update Employer company profile');

    // 4. Update Job Seeker Profile
    const profRes = await makeRequest(
      `${API_BASE}/profiles/me`,
      'PUT',
      {
        fullName: 'Rohan Developer',
        headline: 'Full Stack MERN Engineer',
        location: 'Bengaluru',
        phone: '+91 9876543210',
        bio: 'Passionate about clean code and building scalable applications.',
        experienceYears: 3,
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
        education: [{ institution: 'VTU', degree: 'B.Tech', fieldOfStudy: 'CS', endYear: '2023' }],
      },
      { Cookie: seekerCookie }
    );
    assert(profRes.statusCode === 200 && profRes.data.profile?.skills?.includes('React'), 'Test 4: Update Job Seeker profile with skills and headline');

    // 4b. Upload resume to Seeker profile via multipart HTTP
    const boundary = '---------------------------' + Date.now().toString(16);
    const fileContent = '%PDF-1.4 Mock resume content for candidate Rohan';
    const multipartBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="Rohan_Resume.pdf"\r\nContent-Type: application/pdf\r\n\r\n`),
      Buffer.from(fileContent),
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const uploadRes = await new Promise((resolve, reject) => {
      const urlObj = new URL(`${API_BASE}/profiles/resume`);
      const req = http.request(
        {
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: urlObj.pathname,
          method: 'POST',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': multipartBody.length,
            Cookie: seekerCookie,
          },
        },
        (res) => {
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => {
            try {
              resolve({ statusCode: res.statusCode, data: JSON.parse(data) });
            } catch {
              resolve({ statusCode: res.statusCode, data });
            }
          });
        }
      );
      req.on('error', reject);
      req.write(multipartBody);
      req.end();
    });
    assert(uploadRes.statusCode === 200 && uploadRes.data.success, 'Test 5: Secure resume upload to Job Seeker profile');

    // 5. Employer creates a job
    const jobRes = await makeRequest(
      `${API_BASE}/jobs`,
      'POST',
      {
        title: 'Full Stack Engineer',
        description: 'We are seeking a talented MERN stack engineer to join our core team.',
        responsibilities: ['Develop scalable REST APIs', 'Build responsive UI components'],
        qualifications: ['B.Tech in CS or related field', '3+ years experience'],
        skills: ['React', 'Node.js', 'MongoDB', 'Express'],
        location: 'Bengaluru',
        workplaceMode: 'Hybrid',
        employmentType: 'Full-time',
        experienceLevel: 'Mid Level',
        salaryMin: 800000,
        salaryMax: 1400000,
        openings: 2,
        status: 'published',
      },
      { Cookie: employerCookie }
    );
    createdJobId = jobRes.data.job?._id;
    assert(jobRes.statusCode === 201 && jobRes.data.job?.title === 'Full Stack Engineer', 'Test 6: Employer creates a published job posting');

    // 6. Public search jobs
    const searchRes = await makeRequest(`${API_BASE}/jobs?search=MERN&workplaceMode=Hybrid`);
    assert(searchRes.statusCode === 200 && searchRes.data.jobs?.length >= 1, 'Test 7: Public search and filter published jobs');

    // 7. Get Job Details by ID
    const detailRes = await makeRequest(`${API_BASE}/jobs/${createdJobId}`);
    assert(detailRes.statusCode === 200 && detailRes.data.job?.companyName === 'Acme Innovations', 'Test 8: Retrieve single job details by ID');

    // 8. Seeker applies using profile resume
    const applyRes = await makeRequest(
      `${API_BASE}/applications`,
      'POST',
      {
        jobId: createdJobId,
        coverLetter: 'I have extensive experience with React and Node.js.',
      },
      { Cookie: seekerCookie }
    );
    createdAppId = applyRes.data.application?._id;
    assert(applyRes.statusCode === 201 && applyRes.data.application?.status === 'Applied', 'Test 9: Job Seeker applies for job using saved profile resume');

    // 9. Duplicate application prevention
    const dupRes = await makeRequest(
      `${API_BASE}/applications`,
      'POST',
      {
        jobId: createdJobId,
        coverLetter: 'Second attempt',
      },
      { Cookie: seekerCookie }
    );
    assert(dupRes.statusCode === 400 && dupRes.data.success === false, 'Test 10: Backend rejects duplicate application with 400 Bad Request');

    // 10. Seeker checks My Applications
    const myAppsRes = await makeRequest(`${API_BASE}/applications/my-applications`, 'GET', null, {
      Cookie: seekerCookie,
    });
    assert(myAppsRes.statusCode === 200 && myAppsRes.data.applications?.length >= 1, 'Test 11: Seeker views application tracking list');

    // 11. Employer views applicants for their job
    const applicantsRes = await makeRequest(`${API_BASE}/applications/job/${createdJobId}`, 'GET', null, {
      Cookie: employerCookie,
    });
    assert(applicantsRes.statusCode === 200 && applicantsRes.data.applicants?.length >= 1, 'Test 12: Employer reviews applicants for their posted job');

    // 12. Employer updates application status (Applied -> Shortlisted)
    const statusUpdateRes = await makeRequest(
      `${API_BASE}/applications/${createdAppId}/status`,
      'PATCH',
      { status: 'Shortlisted', notes: 'Strong profile match with React requirements' },
      { Cookie: employerCookie }
    );
    assert(statusUpdateRes.statusCode === 200 && statusUpdateRes.data.application?.status === 'Shortlisted', 'Test 13: Employer updates application status to Shortlisted');

    // 13. RBAC blocks unauthorized users from updating status
    const unauthUpdateRes = await makeRequest(
      `${API_BASE}/applications/${createdAppId}/status`,
      'PATCH',
      { status: 'Rejected' },
      { Cookie: seekerCookie }
    );
    assert(unauthUpdateRes.statusCode === 403 || unauthUpdateRes.statusCode === 401, 'Test 14: RBAC blocks non-employer from changing applicant status');

    // 14. Seeker checks dashboard metrics
    const seekerDashRes = await makeRequest(`${API_BASE}/profiles/dashboard-stats`, 'GET', null, {
      Cookie: seekerCookie,
    });
    assert(
      seekerDashRes.statusCode === 200 &&
      seekerDashRes.data.stats?.totalApplications >= 1 &&
      seekerDashRes.data.stats?.profileCompletion > 0,
      'Test 15: Job Seeker dashboard returns real MongoDB metrics'
    );

    // 15. Employer checks dashboard metrics
    const empDashRes = await makeRequest(`${API_BASE}/applications/employer/dashboard-stats`, 'GET', null, {
      Cookie: employerCookie,
    });
    assert(
      empDashRes.statusCode === 200 &&
      empDashRes.data.stats?.totalJobs >= 1 &&
      empDashRes.data.stats?.totalApplications >= 1,
      'Test 16: Employer dashboard returns real MongoDB metrics'
    );

    // 16. Admin login & stats
    const adminLogin = await makeRequest(`${API_BASE}/auth/login`, 'POST', {
      email: 'admin@smarthire.local',
      password: 'Admin@12345',
    });
    const adminCookie = extractCookie(adminLogin.headers);

    const adminStats = await makeRequest(`${API_BASE}/admin/stats`, 'GET', null, {
      Cookie: adminCookie,
    });
    assert(
      adminStats.statusCode === 200 &&
      adminStats.data.stats?.totalJobs >= 1 &&
      adminStats.data.stats?.totalApplications >= 1,
      'Test 17: Admin dashboard displays accurate platform-wide stats'
    );

    // 17. Employer closes job and verifies new applications are rejected
    const closeJobRes = await makeRequest(
      `${API_BASE}/jobs/${createdJobId}/status`,
      'PATCH',
      { status: 'closed' },
      { Cookie: employerCookie }
    );
    assert(closeJobRes.statusCode === 200 && closeJobRes.data.job?.status === 'closed', 'Test 18: Employer closes job listing');

    // Register second seeker to test applying to closed job
    const seeker2Reg = await makeRequest(`${API_BASE}/auth/register`, 'POST', {
      name: 'Priya Dev',
      email: `seeker2_${timestamp}@portal.test`,
      password,
      confirmPassword: password,
      role: 'job_seeker',
    });
    const seeker2Cookie = extractCookie(seeker2Reg.headers);

    const applyClosedRes = await makeRequest(
      `${API_BASE}/applications`,
      'POST',
      {
        jobId: createdJobId,
        coverLetter: 'Applying to closed position',
      },
      { Cookie: seeker2Cookie }
    );
    assert(applyClosedRes.statusCode === 400 && applyClosedRes.data.success === false, 'Test 19: Backend rejects applications to closed jobs with 400 Bad Request');
  } catch (error) {
    console.error('Test Suite encountered error:', error);
    failed++;
  }

  console.log('\n----------------------------------------------------');
  console.log(`Final Portal Results: ${passed} passed, ${failed} failed`);
  console.log('----------------------------------------------------');
  process.exit(failed > 0 ? 1 : 0);
};

runTests();
