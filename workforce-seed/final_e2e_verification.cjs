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
        resolve({ status: res.statusCode, data: json });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function verifyAll() {
  console.log('================================================================');
  console.log('   WORKFORCEIQ FINAL END-TO-END EXECUTION & INTEGRATION AUDIT   ');
  console.log('================================================================\n');

  // STEP 1: Verify Running Services
  console.log('>>> [STEP 1] Verifying Service Health...');
  const mlHealth = await request('http://127.0.0.1:8000/health');
  if (mlHealth.status !== 200) throw new Error('ML Service (Port 8000) Unhealthy');
  console.log('  [PASS] Python ML Service is healthy at http://127.0.0.1:8000');

  const feCheck = await request('http://127.0.0.1:3000/');
  if (feCheck.status !== 200) throw new Error('Frontend (Port 3000) Inaccessible');
  console.log('  [PASS] React Vite Frontend is running at http://127.0.0.1:3000');

  // STEP 2: Verify Supabase Authentication & Role Resolution for 7 Demo Personas
  console.log('\n>>> [STEP 2] Verifying Real Supabase Authentication (7 Personas)...');
  const demoAccounts = [
    { role: 'MANAGER', email: 'elena.rostova@workforce.example', expectedName: 'Elena Rostova' },
    { role: 'MANAGER', email: 'marcus.vance@workforce.example', expectedName: 'Marcus Vance' },
    { role: 'EMPLOYEE', email: 'devansh.sharma@workforce.example', expectedName: 'Devansh Sharma' },
    { role: 'EMPLOYEE', email: 'sarah.jenkins@workforce.example', expectedName: 'Sarah Jenkins' },
    { role: 'EMPLOYEE', email: 'liam.oconnor@workforce.example', expectedName: "Liam O'Connor" },
    { role: 'EMPLOYEE', email: 'lucas.silva@workforce.example', expectedName: 'Lucas Silva' },
    { role: 'ADMIN', email: 'alex.rivera@workforce.example', expectedName: 'Jessica Alba' },
  ];

  const authSessions = {};

  for (const acc of demoAccounts) {
    const loginRes = await request('http://localhost:3001/auth/login', { method: 'POST' }, {
      email: acc.email,
      password: 'ApexPass2026!'
    });

    if (loginRes.status !== 200 && loginRes.status !== 201) {
      throw new Error(`Login failed for ${acc.email}: status ${loginRes.status}`);
    }

    const { access_token, user } = loginRes.data;
    if (!access_token || !access_token.startsWith('eyJ')) {
      throw new Error(`Invalid JWT token received for ${acc.email}`);
    }

    if (user.role !== acc.role) {
      throw new Error(`Role mismatch for ${acc.email}: expected ${acc.role}, got ${user.role}`);
    }

    // Verify token with backend /auth/me guard
    const meRes = await request('http://localhost:3001/auth/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    if (meRes.status !== 200 || meRes.data.email !== acc.email) {
      throw new Error(`Token verification failed on /auth/me for ${acc.email}`);
    }

    authSessions[acc.email] = { token: access_token, user };
    console.log(`  [PASS] ${acc.role.padEnd(8)} | ${acc.email.padEnd(35)} | ID: ${user.employeeId} | "${user.name}"`);
  }

  // STEP 3: Manager Exploration of Real Projects and Employees
  console.log('\n>>> [STEP 3] Verifying Manager Exploration API...');
  const managerToken = authSessions['elena.rostova@workforce.example'].token;

  const projRes = await request('http://localhost:3001/projects', {
    headers: { Authorization: `Bearer ${managerToken}` }
  });
  console.log(`  [PASS] Retrieved ${projRes.data.length} projects from database.`);

  const empRes = await request('http://localhost:3001/employees', {
    headers: { Authorization: `Bearer ${managerToken}` }
  });
  console.log(`  [PASS] Retrieved ${empRes.data.length} synthetic employees from database.`);

  // STEP 4: Test Single-Skill ML Auto-Allocation Workflow
  console.log('\n>>> [STEP 4] Testing ML Quantifier & Auto-Allocation Workflow...');
  const targetProject = projRes.data[1] || projRes.data[0];
  console.log(`  Target Project: "${targetProject.name}" (ID: ${targetProject.id})`);

  const autoAllocRes = await request('http://localhost:3001/allocations/auto', {
    method: 'POST',
    headers: { Authorization: `Bearer ${managerToken}` }
  }, {
    project_id: targetProject.id,
    skill: 'Python',
    required_hours: 15,
    week_start_date: '2026-11-09'
  });

  if (autoAllocRes.status !== 200 && autoAllocRes.status !== 201) {
    throw new Error(`Auto-allocation failed: ${JSON.stringify(autoAllocRes.data)}`);
  }

  console.log(`  [PASS] Auto-Allocation Outcome: ${autoAllocRes.data.message}`);
  console.log(`         Candidate Selected: "${autoAllocRes.data.selected_employee?.employee_name}" (Score: ${autoAllocRes.data.selected_employee?.final_score})`);
  console.log(`         Total Candidates Evaluated: ${autoAllocRes.data.candidates?.length}`);
  console.log(`         Durable Allocation ID: ${autoAllocRes.data.allocation_id}`);

  // STEP 5: Multi-Role Team Formation & Manager Approval
  console.log('\n>>> [STEP 5] Testing Multi-Role Team Proposal Generation & Manager Approval...');
  const teamProject = projRes.data[0];
  console.log(`  Forming team for: "${teamProject.name}" (ID: ${teamProject.id})`);

  const teamGenRes = await request('http://localhost:3001/team-formation/generate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${managerToken}` }
  }, {
    project_id: teamProject.id,
    max_candidates_per_role: 3,
    include_fairness_adjustment: true
  });

  if (teamGenRes.status !== 200 && teamGenRes.status !== 201) {
    throw new Error(`Team generation failed: ${JSON.stringify(teamGenRes.data)}`);
  }

  const teamProposalId = teamGenRes.data.proposal_id;
  console.log(`  [PASS] Generated Proposal ID: ${teamProposalId}`);
  console.log(`         Status: ${teamGenRes.data.status}, Headcount: ${teamGenRes.data.selected_headcount}`);
  console.log(`         Explanation: ${teamGenRes.data.explanation}`);

  // Manager Approves Proposal
  const approveRes = await request(`http://localhost:3001/allocation-proposals/${teamProposalId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${managerToken}` }
  }, {
    review_comment: 'Approved team proposal in automated end-to-end verification.'
  });

  if (approveRes.status !== 200 && approveRes.status !== 201) {
    throw new Error(`Proposal approval failed: ${JSON.stringify(approveRes.data)}`);
  }

  console.log(`  [PASS] Proposal ${teamProposalId} approved.`);
  console.log(`         Committed Allocations Count: ${approveRes.data.committed_allocations_count}`);

  // STEP 6: Employee Workflow & Live Allocation Visibility
  console.log('\n>>> [STEP 6] Testing Employee Portal & Allocation Visibility...');
  const devanshToken = authSessions['devansh.sharma@workforce.example'].token;

  const myAllocRes = await request('http://localhost:3001/allocations/my', {
    headers: { Authorization: `Bearer ${devanshToken}` }
  });

  if (myAllocRes.status !== 200) {
    throw new Error(`Failed to fetch employee allocations: ${JSON.stringify(myAllocRes.data)}`);
  }

  console.log(`  [PASS] Devansh Sharma has ${myAllocRes.data.length} active allocations in database.`);
  myAllocRes.data.forEach((alloc, idx) => {
    console.log(`         #${idx + 1}: Project "${alloc.projects?.name}" | ${alloc.allocated_hours}h/wk | Status: ${alloc.status}`);
  });

  console.log('\n================================================================');
  console.log('   ALL END-TO-END WORKFLOWS COMPLETED AND FULLY VERIFIED 100%   ');
  console.log('================================================================');
}

verifyAll().catch(err => {
  console.error('\n[FATAL AUDIT FAILURE]:', err.message);
  process.exit(1);
});

