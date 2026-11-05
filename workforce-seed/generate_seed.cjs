const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- Configuration ---
const REFERENCE_DATE = '2026-11-03';
const RANDOM_SEED = 42;
const BASE_DIR = path.join(__dirname, 'workforce-seed');
const DATA_DIR = path.join(BASE_DIR, 'data');

// Simple deterministic PRNG (Linear Congruential Generator)
let seedState = RANDOM_SEED;
function seededRandom() {
  seedState = (seedState * 1664525 + 1013904223) % 4294967296;
  return seedState / 4294967296;
}

function randInt(min, max) {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[Math.floor(seededRandom() * arr.length)];
}

function padHex(num, len) {
  return num.toString(16).padStart(len, '0');
}

function makeUuid(prefix, id) {
  return `${prefix}-0000-4000-8000-${padHex(id, 12)}`;
}

// Ensure directories exist
fs.mkdirSync(DATA_DIR, { recursive: true });

// 1. Fictional Indian Names (40 unique names)
const FIRST_NAMES = [
  'Aarav', 'Priya', 'Rohan', 'Ananya', 'Vikram', 'Kavita', 'Aditya', 'Sneha',
  'Arjun', 'Deepika', 'Rahul', 'Neha', 'Siddharth', 'Pooja', 'Karan', 'Meera',
  'Varun', 'Ritu', 'Nikhil', 'Tanvi', 'Abhishek', 'Shreya', 'Gaurav', 'Divya',
  'Manish', 'Isha', 'Kunal', 'Swati', 'Alok', 'Anjali', 'Dev', 'Tara',
  'Prateek', 'Pallavi', 'Akash', 'Simran', 'Harsh', 'Radhika', 'Vishal', 'Payal'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Iyer', 'Verma', 'Malhotra', 'Nair', 'Deshmukh', 'Chopra',
  'Mehta', 'Reddy', 'Banerjee', 'Joshi', 'Kapoor', 'Bhat', 'Rao', 'Gupta',
  'Saxena', 'Kulkarni', 'Singhania', 'Menon', 'Nambiar', 'Pandey', 'Agarwal', 'Chatterjee',
  'Mukherjee', 'Dutta', 'Sengupta', 'Pillai', 'Acharya', 'Trivedi', 'Bose', 'Mishra',
  'Ghosh', 'Choudhury', 'Hegde', 'Gowda', 'Shetty', 'Bhattacharya', 'Sethi', 'Prasad'
];

const ROLES = [
  'Senior Cloud Architect',
  'Staff Backend Engineer',
  'Full Stack Engineer',
  'DevOps & SRE Engineer',
  'Distributed Systems Engineer',
  'Data Platform Engineer',
  'Security & IAM Specialist',
  'Frontend Systems Engineer'
];

const DEPARTMENTS = [
  'Cloud Infrastructure',
  'Core Platform',
  'Data Engineering',
  'Product Engineering',
  'Platform Security'
];

// 2. Technical Skills (28 skills)
const SKILL_NAMES = [
  'Cloud Architecture',
  'Kubernetes & Containers',
  'Distributed Systems',
  'Python / Fast-API',
  'TypeScript & React',
  'Go Systems Programming',
  'PostgreSQL & Optimization',
  'CI/CD & DevOps Automation',
  'Apache Kafka & Streaming',
  'Microservices Architecture',
  'Data Engineering & Spark',
  'MLOps & Pipeline Engineering',
  'Infrastructure as Code (Terraform)',
  'Application Security & IAM',
  'GraphQL & API Gateway',
  'Observability & OpenTelemetry',
  'Site Reliability Engineering (SRE)',
  'Redis & Distributed Caching',
  'Network & VPC Security',
  'Front-End Web Performance',
  'Linux Kernel & Systems Internals',
  'Natural Language Processing',
  'Cloud Security & Compliance',
  'AWS Cloud Architecture',
  'GCP Infrastructure',
  'High-Availability Systems',
  'Full-Stack Web Development',
  'Event-Driven Architecture'
];

// Generate Skills
const skills = SKILL_NAMES.map((name, i) => ({
  id: makeUuid('20000000', i + 1),
  name: name,
  category: i < 5 ? 'Cloud' : i < 10 ? 'Backend' : i < 15 ? 'DevOps' : i < 20 ? 'Data' : 'Security',
}));

// Generate Projects (7 projects: 5 ACTIVE, 1 PLANNING, 1 COMPLETED)
const PROJECTS_DEF = [
  {
    name: 'Cloud Native Migration Platform',
    domain: 'Infrastructure',
    priority: 5,
    status: 'ACTIVE',
    hours: 800,
    start: '2026-08-01',
    end: '2026-12-31',
    deadline: '2026-12-15',
    desc: 'Containerizing core microservices into multi-region Kubernetes clusters with zero downtime.'
  },
  {
    name: 'Real-Time Telemetry & Observability Pipeline',
    domain: 'Data & SRE',
    priority: 4,
    status: 'ACTIVE',
    hours: 600,
    start: '2026-09-01',
    end: '2027-01-31',
    deadline: '2027-01-15',
    desc: 'High-throughput Kafka and OpenTelemetry stream processing for real-time latency anomalies.'
  },
  {
    name: 'Enterprise Identity & Zero-Trust Mesh',
    domain: 'Security',
    priority: 4,
    status: 'ACTIVE',
    hours: 500,
    start: '2026-07-15',
    end: '2026-11-30',
    deadline: '2026-11-20',
    desc: 'Enforcing mTLS and fine-grained SPIFFE/SPIRE workload attestation across internal services.'
  },
  {
    name: 'Customer Analytics Lakehouse',
    domain: 'Data Engineering',
    priority: 3,
    status: 'ACTIVE',
    hours: 750,
    start: '2026-06-01',
    end: '2026-12-10',
    deadline: '2026-12-01',
    desc: 'Unifying transactional PostgreSQL logs with historical BigQuery and Iceberg analytical tables.'
  },
  {
    name: 'Core Payment Gateway Hardening',
    domain: 'FinTech Platform',
    priority: 5,
    status: 'ACTIVE',
    hours: 650,
    start: '2026-09-15',
    end: '2027-02-28',
    deadline: '2027-02-15',
    desc: 'PCI-DSS Level 1 compliance hardening, idempotency token guarantees, and failover routing.'
  },
  {
    name: 'AI-Powered Recommendation Service',
    domain: 'Machine Learning',
    priority: 4,
    status: 'PLANNING',
    hours: 450,
    start: '2026-12-01',
    end: '2027-04-30',
    deadline: '2027-04-15',
    desc: 'Feature store and inference pipeline for contextual dynamic team matching.'
  },
  {
    name: 'Legacy Monolith Decomposition Phase 2',
    domain: 'Architecture',
    priority: 2,
    status: 'COMPLETED',
    hours: 900,
    start: '2026-01-15',
    end: '2026-09-30',
    deadline: '2026-09-25',
    desc: 'Successful extraction of billing and subscription domain services into isolated modules.'
  }
];

const projects = PROJECTS_DEF.map((p, i) => ({
  id: makeUuid('30000000', i + 1),
  name: p.name,
  domain: p.domain,
  project_priority: p.priority,
  priority: p.priority,
  status: p.status,
  estimated_total_hours: p.hours,
  start_date: p.start,
  end_date: p.end,
  deadline: p.deadline,
  description: p.desc,
  created_at: `${p.start}T09:00:00Z`
}));

// Generate Staffing Requirements for Active/Planning projects
const staffingRequirements = [];
let staffReqCounter = 1;

projects.forEach((proj) => {
  if (proj.status === 'COMPLETED') return;
  // 3-4 staffing requirements per project
  const reqRoles = [
    { role: 'Senior Cloud Architect', skillIdx: 0, prof: 4, count: 1, hrs: 30 },
    { role: 'Distributed Systems Engineer', skillIdx: 2, prof: 4, count: 2, hrs: 35 },
    { role: 'DevOps & SRE Engineer', skillIdx: 1, prof: 3, count: 1, hrs: 25 },
    { role: 'Backend Engineer', skillIdx: 3, prof: 3, count: 2, hrs: 40 },
  ];

  reqRoles.forEach((rr) => {
    staffingRequirements.push({
      id: makeUuid('40000000', staffReqCounter++),
      project_id: proj.id,
      required_role: rr.role,
      skill_id: skills[rr.skillIdx % skills.length].id,
      minimum_proficiency: rr.prof,
      required_headcount: rr.count,
      allocation_hours_per_week: rr.hrs,
      is_mandatory: true,
      priority: proj.priority
    });
  });
});

// Generate 40 Employees
// 6 cold-start employees with 0 allocations & limited history (indices 34-39)
const employees = [];
const employeeSkills = [];
let empSkillCounter = 1;

for (let i = 0; i < 40; i++) {
  const empId = makeUuid('10000000', i + 1);
  const firstName = FIRST_NAMES[i];
  const lastName = LAST_NAMES[i];
  const fullName = `${firstName} ${lastName}`;
  const emailName = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z]/g, '')}`;
  const email = `${emailName}@workforce.example`;
  const isColdStart = i >= 34; // 6 cold-start engineers

  const role = ROLES[i % ROLES.length];
  const dept = DEPARTMENTS[i % DEPARTMENTS.length];

  // Scores
  const reliability = isColdStart ? 0.70 : Number((0.80 + seededRandom() * 0.18).toFixed(2));
  const efficiency = isColdStart ? 0.72 : Number((0.78 + seededRandom() * 0.20).toFixed(2));
  const consistency = isColdStart ? 0.68 : Number((0.82 + seededRandom() * 0.16).toFixed(2));
  const availability = isColdStart ? 1.0 : Number((0.50 + seededRandom() * 0.45).toFixed(2));

  employees.push({
    id: empId,
    name: fullName,
    email: email,
    role: role,
    department: dept,
    weekly_capacity_hours: 40,
    max_capacity_hours: 40,
    current_workload_hours: 0, // Will be computed after allocations
    reliability_score: reliability,
    efficiency_score: efficiency,
    consistency_score: consistency,
    availability_score: availability,
    status: 'ACTIVE',
    is_cold_start: isColdStart,
    created_at: isColdStart ? '2026-10-15T09:00:00Z' : '2025-11-01T09:00:00Z'
  });

  // Assign 4 to 6 skills
  const numSkills = isColdStart ? 4 : randInt(4, 6);
  const usedSkillIndices = new Set();
  while (usedSkillIndices.size < numSkills) {
    usedSkillIndices.add(randInt(0, skills.length - 1));
  }

  Array.from(usedSkillIndices).forEach((sIdx) => {
    const profLevel = isColdStart ? randInt(2, 3) : randInt(3, 5);
    employeeSkills.push({
      id: makeUuid('21000000', empSkillCounter++),
      employee_id: empId,
      skill_id: skills[sIdx].id,
      proficiency_level: profLevel
    });
  });
}

// Generate Allocations
// Varied distribution across active projects:
// - Experienced engineers (0-33) get 1 or 2 allocations:
//   - 4 engineers overallocated (45-50h) to provide realistic capacity alerts
//   - 18 engineers optimally allocated (30-40h)
//   - 12 engineers lightly allocated (10-25h)
// - Cold-start engineers (34-39) get 0 allocations
const allocations = [];
let allocCounter = 1;
const activeProjects = projects.filter(p => p.status === 'ACTIVE');

employees.forEach((emp, i) => {
  if (emp.is_cold_start) {
    return; // 0 allocations for cold-start
  }

  let targetHours;
  if (i < 4) {
    targetHours = randInt(45, 48); // Overallocated
  } else if (i < 22) {
    targetHours = randInt(32, 40); // Optimal
  } else {
    targetHours = randInt(15, 25); // Available bandwidth
  }

  if (targetHours > 30 && seededRandom() > 0.4) {
    // Split into 2 allocations
    const h1 = Math.round(targetHours * 0.6);
    const h2 = targetHours - h1;
    const p1 = activeProjects[i % activeProjects.length];
    const p2 = activeProjects[(i + 1) % activeProjects.length];

    allocations.push({
      id: makeUuid('50000000', allocCounter++),
      employee_id: emp.id,
      project_id: p1.id,
      allocated_hours: h1,
      allocated_hours_per_week: h1,
      week_start_date: '2026-11-02',
      status: 'ACTIVE',
      assigned_role: emp.role,
      created_at: '2026-10-01T09:00:00Z'
    });

    allocations.push({
      id: makeUuid('50000000', allocCounter++),
      employee_id: emp.id,
      project_id: p2.id,
      allocated_hours: h2,
      allocated_hours_per_week: h2,
      week_start_date: '2026-11-02',
      status: 'ACTIVE',
      assigned_role: emp.role,
      created_at: '2026-10-01T09:00:00Z'
    });

    emp.current_workload_hours = h1 + h2;
  } else {
    // 1 allocation
    const p1 = activeProjects[i % activeProjects.length];
    allocations.push({
      id: makeUuid('50000000', allocCounter++),
      employee_id: emp.id,
      project_id: p1.id,
      allocated_hours: targetHours,
      allocated_hours_per_week: targetHours,
      week_start_date: '2026-11-02',
      status: 'ACTIVE',
      assigned_role: emp.role,
      created_at: '2026-10-01T09:00:00Z'
    });
    emp.current_workload_hours = targetHours;
  }
});

// Generate 250–300 Completed Task-History Records
// Experienced engineers have 7-10 tasks each.
// Cold-start engineers have 0-1 tasks each.
const taskHistory = [];
let taskCounter = 1;
const completedProject = projects.find(p => p.status === 'COMPLETED');

const TASK_NAMES = [
  'Refactor connection pool timeout handling',
  'Implement OpenTelemetry trace propagators',
  'Optimize GIN indexes on JSONB metadata',
  'Audit IAM roles and delete unused service principals',
  'Implement rate-limiting middleware for auth endpoints',
  'Construct automated canary deployment verification test',
  'Configure Prometheus histogram alert rules',
  'Migrate asynchronous jobs to Redis Streams',
  'Implement zero-downtime schema migration verification',
  'Benchmarking gRPC payload serialization latency'
];

employees.forEach((emp, i) => {
  const taskCount = emp.is_cold_start ? (i % 2 === 0 ? 1 : 0) : randInt(7, 10);
  for (let k = 0; k < taskCount; k++) {
    const proj = (k % 2 === 0 && completedProject) ? completedProject : activeProjects[k % activeProjects.length];
    const delay = seededRandom() > 0.8 ? randInt(1, 4) : 0;
    const hours = randInt(12, 38);
    const quality = Number((3.8 + seededRandom() * 1.2).toFixed(2));
    const dayOffset = randInt(10, 180);
    const completedDate = new Date(new Date(REFERENCE_DATE).getTime() - dayOffset * 86400000).toISOString();

    taskHistory.push({
      id: makeUuid('60000000', taskCounter++),
      employee_id: emp.id,
      project_id: proj.id,
      task_name: TASK_NAMES[k % TASK_NAMES.length],
      completed_at: completedDate,
      delay_days: delay,
      hours_spent: hours,
      quality_score: quality
    });
  }
});

// Generate Employee Performance History (weekly evaluations)
const employeePerformance = [];
let perfCounter = 1;

employees.forEach((emp, i) => {
  const perfCount = emp.is_cold_start ? (i % 2 === 0 ? 1 : 0) : randInt(4, 7);
  for (let k = 0; k < perfCount; k++) {
    const proj = activeProjects[k % activeProjects.length];
    const delivery = Number((0.75 + seededRandom() * 0.23).toFixed(2));
    const quality = Number((0.80 + seededRandom() * 0.19).toFixed(2));
    const weekStart = new Date(new Date(REFERENCE_DATE).getTime() - (k + 1) * 7 * 86400000).toISOString().split('T')[0];

    employeePerformance.push({
      id: makeUuid('70000000', perfCounter++),
      employee_id: emp.id,
      project_id: proj.id,
      week_start_date: weekStart,
      delivery_score: delivery,
      quality_score: quality,
      completion_status: 'COMPLETED'
    });
  }
});

// Generate Manager Feedback (1-2 records per experienced employee)
const managerFeedback = [];
let feedbackCounter = 1;

const MANAGERS = ['Dr. Sarah Chen', 'Alex Rivera', 'Priya Sundaram'];

employees.forEach((emp, i) => {
  if (emp.is_cold_start) return;
  const count = randInt(1, 2);
  for (let k = 0; k < count; k++) {
    const proj = activeProjects[k % activeProjects.length];
    managerFeedback.push({
      id: makeUuid('80000000', feedbackCounter++),
      employee_id: emp.id,
      project_id: proj.id,
      manager_name: MANAGERS[k % MANAGERS.length],
      rating: randInt(4, 5),
      strengths: 'Consistent architecture delivery, strong team mentorship, and proactive incident mitigation.',
      weaknesses: 'Occasional reluctance to delegate lower-priority backlog tasks.',
      comments: `${emp.name} demonstrated outstanding ownership on sprint deliverables.`
    });
  }
});

// Generate Alerts (from actual capacity & staffing states)
const alerts = [];
let alertCounter = 1;

// Capacity Exceeded alerts for the 4 overallocated engineers
employees.filter(e => e.current_workload_hours > 40).forEach(e => {
  alerts.push({
    id: makeUuid('90000000', alertCounter++),
    type: 'CAPACITY_EXCEEDED',
    severity: 'CRITICAL',
    message: `Capacity exceeded: ${e.name} is allocated ${e.current_workload_hours}h/40h (${Math.round((e.current_workload_hours / 40) * 100)}% capacity).`,
    status: 'ACTIVE',
    employee_id: e.id,
    metadata: {
      total_allocated_hours: e.current_workload_hours,
      max_capacity_hours: 40,
      utilization_percentage: Math.round((e.current_workload_hours / 40) * 100),
      checked_at: new Date(REFERENCE_DATE).toISOString()
    }
  });
});

// Staffing Gap alerts for projects with unfilled requirements
projects.filter(p => p.priority === 5 && p.status === 'ACTIVE').forEach(p => {
  alerts.push({
    id: makeUuid('90000000', alertCounter++),
    type: 'STAFFING_GAP',
    severity: 'HIGH',
    message: `Open Staffing Requirement: ${p.name} has unallocated critical roles for upcoming sprint milestones.`,
    status: 'ACTIVE',
    project_id: p.id,
    metadata: {
      project_name: p.name,
      checked_at: new Date(REFERENCE_DATE).toISOString()
    }
  });
});

// --- Write Output Files ---

// Helper to write JSON and CSV
function writeDataset(filename, records) {
  const jsonPath = path.join(DATA_DIR, `${filename}.json`);
  const csvPath = path.join(DATA_DIR, `${filename}.csv`);

  // Write JSON
  fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2), 'utf8');

  // Write CSV
  if (records.length > 0) {
    const headers = Object.keys(records[0]);
    const csvLines = [headers.join(',')];
    records.forEach(r => {
      const line = headers.map(h => {
        let val = r[h];
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val).replace(/"/g, '""');
          return `"${val}"`;
        }
        if (typeof val === 'string') {
          if (val.includes(',') || val.includes('"') || val.includes('\n')) {
            val = `"${val.replace(/"/g, '""')}"`;
          }
        }
        return val !== undefined && val !== null ? val : '';
      }).join(',');
      csvLines.push(line);
    });
    fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf8');
  }
}

writeDataset('skills', skills);
writeDataset('projects', projects);
writeDataset('project_staffing_requirements', staffingRequirements);
writeDataset('employees', employees.map(({ is_cold_start, ...e }) => e));
writeDataset('employee_skills', employeeSkills);
writeDataset('allocations', allocations);
writeDataset('task_history', taskHistory);
writeDataset('employee_performance', employeePerformance);
writeDataset('manager_feedback', managerFeedback);
writeDataset('alerts', alerts);

// --- Generate Relational seed.sql ---
let sql = `-- ============================================================================
-- WORKFORCEIQ SYNTHETIC RELATIONAL SEED
-- Generated: ${new Date().toISOString()}
-- Reference Date: ${REFERENCE_DATE}
-- Random Seed: ${RANDOM_SEED}
-- Provenance: Fully synthetic dataset conforming to active Supabase schema contracts
-- SAFETY: This script is prepared for manual/authorized local seeding only.
-- DO NOT APPLY TO REMOTE PRODUCTION WITHOUT EXPLICIT AUTHORIZATION.
-- ============================================================================

BEGIN;

-- 1. Insert Skills (${skills.length} records)
INSERT INTO skills (id, name) VALUES
${skills.map(s => `  ('${s.id}', '${s.name.replace(/'/g, "''")}')`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Insert Projects (${projects.length} records)
INSERT INTO projects (id, name, project_priority, status, estimated_total_hours, start_date, end_date, deadline, description) VALUES
${projects.map(p => `  ('${p.id}', '${p.name.replace(/'/g, "''")}', ${p.project_priority}, '${p.status}', ${p.estimated_total_hours}, '${p.start_date}', '${p.end_date}', '${p.deadline}', '${p.description.replace(/'/g, "''")}')`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  project_priority = EXCLUDED.project_priority,
  status = EXCLUDED.status,
  estimated_total_hours = EXCLUDED.estimated_total_hours,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  deadline = EXCLUDED.deadline,
  description = EXCLUDED.description;

-- 3. Insert Project Staffing Requirements (${staffingRequirements.length} records)
INSERT INTO project_staffing_requirements (id, project_id, required_role, skill_id, minimum_proficiency, required_headcount, allocation_hours_per_week, is_mandatory, priority) VALUES
${staffingRequirements.map(sr => `  ('${sr.id}', '${sr.project_id}', '${sr.required_role.replace(/'/g, "''")}', '${sr.skill_id}', ${sr.minimum_proficiency}, ${sr.required_headcount}, ${sr.allocation_hours_per_week}, ${sr.is_mandatory}, ${sr.priority})`).join(',\n')}
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Employees (${employees.length} records)
INSERT INTO employees (id, name, email, role, department, weekly_capacity_hours, max_capacity_hours, current_workload_hours, reliability_score, efficiency_score, consistency_score, availability_score, status) VALUES
${employees.map(e => `  ('${e.id}', '${e.name.replace(/'/g, "''")}', '${e.email}', '${e.role.replace(/'/g, "''")}', '${e.department.replace(/'/g, "''")}', ${e.weekly_capacity_hours}, ${e.max_capacity_hours}, ${e.current_workload_hours}, ${e.reliability_score}, ${e.efficiency_score}, ${e.consistency_score}, ${e.availability_score}, '${e.status}')`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  current_workload_hours = EXCLUDED.current_workload_hours,
  reliability_score = EXCLUDED.reliability_score,
  efficiency_score = EXCLUDED.efficiency_score,
  consistency_score = EXCLUDED.consistency_score,
  availability_score = EXCLUDED.availability_score;

-- 5. Insert Employee Skills (${employeeSkills.length} records)
INSERT INTO employee_skills (id, employee_id, skill_id, proficiency_level) VALUES
${employeeSkills.map(es => `  ('${es.id}', '${es.employee_id}', '${es.skill_id}', ${es.proficiency_level})`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET proficiency_level = EXCLUDED.proficiency_level;

-- 6. Insert Allocations (${allocations.length} records)
INSERT INTO allocations (id, employee_id, project_id, allocated_hours, allocated_hours_per_week, week_start_date, status, assigned_role) VALUES
${allocations.map(a => `  ('${a.id}', '${a.employee_id}', '${a.project_id}', ${a.allocated_hours}, ${a.allocated_hours_per_week}, '${a.week_start_date}', '${a.status}', '${a.assigned_role.replace(/'/g, "''")}')`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  allocated_hours = EXCLUDED.allocated_hours,
  allocated_hours_per_week = EXCLUDED.allocated_hours_per_week,
  status = EXCLUDED.status;

-- 7. Insert Task History (${taskHistory.length} records)
INSERT INTO task_history (id, employee_id, project_id, task_name, completed_at, delay_days, hours_spent, quality_score) VALUES
${taskHistory.map(th => `  ('${th.id}', '${th.employee_id}', '${th.project_id}', '${th.task_name.replace(/'/g, "''")}', '${th.completed_at}', ${th.delay_days}, ${th.hours_spent}, ${th.quality_score})`).join(',\n')}
ON CONFLICT (id) DO NOTHING;

-- 8. Insert Employee Performance (${employeePerformance.length} records)
INSERT INTO employee_performance (id, employee_id, project_id, week_start_date, delivery_score, quality_score, completion_status) VALUES
${employeePerformance.map(ep => `  ('${ep.id}', '${ep.employee_id}', '${ep.project_id}', '${ep.week_start_date}', ${ep.delivery_score}, ${ep.quality_score}, '${ep.completion_status}')`).join(',\n')}
ON CONFLICT (id) DO NOTHING;

-- 9. Insert Manager Feedback (${managerFeedback.length} records)
INSERT INTO manager_feedback (id, employee_id, project_id, manager_name, rating, strengths, weaknesses, comments) VALUES
${managerFeedback.map(mf => `  ('${mf.id}', '${mf.employee_id}', '${mf.project_id}', '${mf.manager_name.replace(/'/g, "''")}', ${mf.rating}, '${mf.strengths.replace(/'/g, "''")}', '${mf.weaknesses.replace(/'/g, "''")}', '${mf.comments.replace(/'/g, "''")}')`).join(',\n')}
ON CONFLICT (id) DO NOTHING;

-- 10. Insert Alerts (${alerts.length} records)
INSERT INTO alerts (id, type, severity, message, status, employee_id, project_id, metadata) VALUES
${alerts.map(al => `  ('${al.id}', '${al.type}', '${al.severity}', '${al.message.replace(/'/g, "''")}', '${al.status}', ${al.employee_id ? `'${al.employee_id}'` : 'NULL'}, ${al.project_id ? `'${al.project_id}'` : 'NULL'}, '${JSON.stringify(al.metadata).replace(/'/g, "''")}'::jsonb)`).join(',\n')}
ON CONFLICT (id) DO NOTHING;

COMMIT;
`;

fs.writeFileSync(path.join(BASE_DIR, 'seed.sql'), sql, 'utf8');

// --- Seed Manifest ---
const manifest = {
  manifest_version: '1.0.0',
  dataset_name: 'WorkforceIQ Synthetic Enterprise Dataset',
  generated_at: new Date().toISOString(),
  reference_date: REFERENCE_DATE,
  random_seed: RANDOM_SEED,
  provenance: {
    generator: 'workforce-seed/generate_seed.cjs',
    names_origin: 'Fictional Indian names (40 distinct combinations)',
    email_domain: 'workforce.example',
    cold_start_employees_count: employees.filter(e => e.is_cold_start).length,
    deterministic_uuids: true
  },
  record_counts: {
    employees: employees.length,
    skills: skills.length,
    employee_skills: employeeSkills.length,
    projects: projects.length,
    project_staffing_requirements: staffingRequirements.length,
    allocations: allocations.length,
    task_history: taskHistory.length,
    employee_performance: employeePerformance.length,
    manager_feedback: managerFeedback.length,
    alerts: alerts.length
  },
  id_sample: {
    first_employee: { id: employees[0].id, name: employees[0].name, email: employees[0].email },
    last_employee: { id: employees[39].id, name: employees[39].name, email: employees[39].email, cold_start: true },
    first_project: { id: projects[0].id, name: projects[0].name },
    first_skill: { id: skills[0].id, name: skills[0].name }
  }
};

fs.writeFileSync(path.join(BASE_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

console.log('Seed files generated successfully:');
console.log(JSON.stringify(manifest.record_counts, null, 2));
