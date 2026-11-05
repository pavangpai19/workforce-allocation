const http = require('http');

async function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json;
        try {
          json = JSON.parse(data);
        } catch {
          json = data;
        }
        resolve({ status: res.statusCode, data: json, headers: res.headers });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== WORKFORCEIQ END-TO-END SERVICE TEST ===\n');

  // 1. ML Service Health
  console.log('1. Checking Python ML Service Health...');
  const mlRes = await request('http://127.0.0.1:8000/health');
  console.log(`ML Health Status: ${mlRes.status}`, mlRes.data);
  if (mlRes.status !== 200) throw new Error('ML Service unhealthy');

  // 2. Frontend HTTP 200
  console.log('\n2. Checking React Frontend...');
  const feRes = await request('http://127.0.0.1:3000/');
  console.log(`Frontend Status: ${feRes.status} (${typeof feRes.data === 'string' ? 'HTML returned' : 'Unknown'})`);
  if (feRes.status !== 200) throw new Error('Frontend not accessible');

  // 3. Test Authentication for all 7 Demo Personas
  console.log('\n3. Testing Backend Authentication & Role Resolution...');
  const accounts = [
    { email: 'elena.rostova@workforce.example', role: 'MANAGER' },
    { email: 'marcus.vance@workforce.example', role: 'MANAGER' },
    { email: 'devansh.sharma@workforce.example', role: 'EMPLOYEE' },
    { email: 'sarah.jenkins@workforce.example', role: 'EMPLOYEE' },
    { email: 'liam.oconnor@workforce.example', role: 'EMPLOYEE' },
    { email: 'lucas.silva@workforce.example', role: 'EMPLOYEE' },
    { email: 'alex.rivera@workforce.example', role: 'ADMIN' },
  ];

  const sessions = {};

  for (const acc of accounts) {
    const loginRes = await request('http://localhost:3001/auth/login', { method: 'POST' }, {
      email: acc.email,
      password: 'ApexPass2026!'
    });

    if (loginRes.status !== 201 && loginRes.status !== 200) {
      console.error(`FAILED login for ${acc.email}: status ${loginRes.status}`, loginRes.data);
      throw new Error(`Login failed for ${acc.email}`);
    }

    const { access_token, user } = loginRes.data;
    if (!access_token || user.role !== acc.role) {
      throw new Error(`Role mismatch for ${acc.email}: expected ${acc.role}, got ${user?.role}`);
    }

    sessions[acc.email] = { token: access_token, user };
    console.log(`  [OK] ${acc.email} -> Role: ${user.role}, Name: "${user.name}", EmployeeId: ${user.employeeId}`);

    // Verify /auth/me with Bearer token
    const meRes = await request('http://localhost:3001/auth/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    if (meRes.status !== 200 || meRes.data.email !== acc.email) {
      throw new Error(`/auth/me failed for ${acc.email}: ${JSON.stringify(meRes.data)}`);
    }
  }

  // 4. Test Manager Access to Projects & Employees
  console.log('\n4. Testing Manager API Access (Elena Rostova)...');
  const mgrToken = sessions['elena.rostova@workforce.example'].token;
  
  const projectsRes = await request('http://localhost:3001/projects', {
    headers: { Authorization: `Bearer ${mgrToken}` }
  });
  console.log(`  [OK] /projects returned ${projectsRes.data.length} projects`);
  if (!Array.isArray(projectsRes.data) || projectsRes.data.length === 0) {
    throw new Error('Projects endpoint returned empty');
  }

  const employeesRes = await request('http://localhost:3001/employees', {
    headers: { Authorization: `Bearer ${mgrToken}` }
  });
  console.log(`  [OK] /employees returned ${employeesRes.data.length} employees`);
  if (!Array.isArray(employeesRes.data) || employeesRes.data.length !== 40) {
    throw new Error(`Expected 40 employees, got ${employeesRes.data.length}`);
  }

  // 5. Test Employee Access to My Allocations & Profile (Devansh Sharma)
  console.log('\n5. Testing Employee API Access (Devansh Sharma)...');
  const empSession = sessions['devansh.sharma@workforce.example'];
  const empRes = await request('http://localhost:3001/allocations/my', {
    headers: { Authorization: `Bearer ${empSession.token}` }
  });
  console.log(`  [OK] /allocations/my returned ${empRes.data.length} allocations`);

  const empProfileRes = await request(`http://localhost:3001/employees/${empSession.user.employeeId}`, {
    headers: { Authorization: `Bearer ${empSession.token}` }
  });
  console.log(`  [OK] /employees/${empSession.user.employeeId} -> Name: "${empProfileRes.data.name}", Skills: ${empProfileRes.data.employee_skills?.length}`);

  // 6. Test Team Formation Proposal Generation & Approval (Full Workflow)
  console.log('\n6. Testing Multi-Role Team Formation Workflow...');
  const sampleProject = projectsRes.data[0];
  console.log(`  Target Project: "${sampleProject.name}" (ID: ${sampleProject.id})`);

  const teamGenRes = await request('http://localhost:3001/team-formation/generate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${mgrToken}` }
  }, {
    project_id: sampleProject.id,
    max_candidates_per_role: 3,
    include_fairness_adjustment: true
  });

  if (teamGenRes.status !== 201 && teamGenRes.status !== 200) {
    console.error('Team formation failed:', teamGenRes.data);
    throw new Error('Team formation failed');
  }

  const proposalId = teamGenRes.data.proposal_id;
  console.log(`  [OK] Generated Team Proposal ID: ${proposalId}`);
  console.log(`       Status: ${teamGenRes.data.status}, Headcount: ${teamGenRes.data.selected_headcount}`);
  console.log(`       Proposed Members: ${teamGenRes.data.proposed_members?.length}`);

  // Fetch proposal details
  const propDetailRes = await request(`http://localhost:3001/allocation-proposals/${proposalId}`, {
    headers: { Authorization: `Bearer ${mgrToken}` }
  });
  console.log(`  [OK] Fetched proposal details: status=${propDetailRes.data.status}, members=${propDetailRes.data.members?.length}`);

  // Approve the proposal
  console.log('\n7. Testing Manager Approval of Proposal...');
  const approveRes = await request(`http://localhost:3001/allocation-proposals/${proposalId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${mgrToken}` }
  }, {
    review_comment: 'Approved team proposal in automated E2E validation test.'
  });

  if (approveRes.status !== 201 && approveRes.status !== 200) {
    console.error('Proposal approval failed:', approveRes.data);
    throw new Error('Proposal approval failed');
  }

  console.log(`  [OK] Approval succeeded: ${approveRes.data.message}`);
  console.log(`       Committed Allocations: ${approveRes.data.committed_allocations_count}`);

  console.log('\n=== ALL END-TO-END VERIFICATIONS PASSED 100% ===');
}

runTests().catch(err => {
  console.error('\n[FATAL TEST ERROR]:', err);
  process.exit(1);
});

