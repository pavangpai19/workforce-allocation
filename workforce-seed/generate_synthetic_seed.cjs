/**
 * ============================================================================
 * WORKFORCEIQ — DETERMINISTIC SYNTHETIC SEED GENERATOR
 * ============================================================================
 * Generates an internally consistent, 100% schema-verified synthetic dataset
 * representing "ApexCore Technologies" (40 employees, 28 skills, 8 projects).
 *
 * SAFETY COMPLIANCE:
 * - This script produces SQL and JSON artifacts LOCALLY.
 * - DOES NOT execute SQL against remote databases or mutate live data.
 * - All email domains strictly RFC 2606 (@workforce.example).
 * - Matches the verified 21-table live schema.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const REFERENCE_DATE = '2026-11-04';
const RANDOM_SEED = 20261104;
const BASE_DIR = path.join(__dirname);
const OUTPUT_SQL_PATH = path.join(BASE_DIR, 'synthetic_seed.sql');
const OUTPUT_MANIFEST_PATH = path.join(BASE_DIR, 'synthetic_manifest.json');

// --- Deterministic Pseudo-Random Number Generator ---
let seedState = RANDOM_SEED;
function seededRandom() {
  seedState = (seedState * 1664525 + 1013904223) % 4294967296;
  return seedState / 4294967296;
}

function randInt(min, max) {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}

function randFloat(min, max, decimals = 2) {
  const val = min + seededRandom() * (max - min);
  return Number(val.toFixed(decimals));
}

function randChoice(arr) {
  return arr[Math.floor(seededRandom() * arr.length)];
}

function padHex(num, len = 12) {
  return num.toString(16).padStart(len, '0');
}

function makeUuid(prefix, id) {
  return `${prefix}-0000-4000-8000-${padHex(id, 12)}`;
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function escapeArray(arr) {
  if (!arr || !arr.length) return "'{}'::text[]";
  const items = arr.map(item => `"${String(item).replace(/"/g, '\\"')}"`).join(',');
  return `'{${items}}'::text[]`;
}

function escapeJson(obj) {
  if (obj === null || obj === undefined) return 'NULL';
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

console.log('Generating WorkforceIQ synthetic enterprise dataset...');

// ============================================================================
// 1. SKILLS (28 canonical skills)
// ============================================================================
const SKILLS_DEF = [
  'TypeScript', 'React', 'Node.js', 'Python', 'Go',
  'PostgreSQL', 'Kubernetes', 'Docker', 'AWS', 'Terraform',
  'PyTorch', 'Kafka', 'Redis', 'Next.js', 'GraphQL',
  'FastAPI', 'Java', 'Spring Boot', 'Flutter', 'React Native',
  'CI/CD Pipelines', 'SRE & Observability', 'Data Modeling', 'Snowflake', 'Automated Testing',
  'System Architecture', 'Cybersecurity & IAM', 'UI/UX Design Systems'
];

const skills = SKILLS_DEF.map((name, i) => {
  // Gracefully align with pre-existing database records for React and Python if present
  let id = makeUuid('20000000', i + 1);
  if (name === 'React') id = 'b4cc67f8-1eb1-4e9a-8980-f2a67584b3fc';
  if (name === 'Python') id = '45c21a7c-1697-48ba-bf34-d2bdab25d501';
  return { id, name };
});

// ============================================================================
// 2. EMPLOYEES & PROFILES & AUTH (40 employees)
// ============================================================================
const EMPLOYEES_DEF = [
  // Leadership (2)
  { name: 'Elena Rostova', email: 'elena.rostova@workforce.example', role: 'MANAGER', dept: 'Leadership', cap: 40, eff: 1.05, rel: 0.99, title: 'VP of Engineering' },
  { name: 'Marcus Vance', email: 'marcus.vance@workforce.example', role: 'MANAGER', dept: 'Leadership', cap: 40, eff: 1.02, rel: 0.97, title: 'Director of Engineering Operations' },

  // Software Engineering (16)
  { name: 'Devansh Sharma', email: 'devansh.sharma@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 1.15, rel: 0.98, title: 'Principal Distributed Systems Lead' },
  { name: 'Sarah Jenkins', email: 'sarah.jenkins@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 1.10, rel: 0.94, title: 'Staff Frontend Architect' },
  { name: "Liam O'Connor", email: 'liam.oconnor@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 1.04, rel: 0.95, title: 'Senior Backend Engineer' },
  { name: 'Priya Patel', email: 'priya.patel@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 1.08, rel: 0.96, title: 'Senior Full Stack Engineer' },
  { name: 'Alex Chen', email: 'alex.chen@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 1.02, rel: 0.93, title: 'Senior Mobile Engineer' },
  { name: 'Maya Lin', email: 'maya.lin@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 0.98, rel: 0.91, title: 'Mid Backend Engineer' },
  { name: 'Tariq Al-Mansoor', email: 'tariq.mansoor@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 1.06, rel: 0.92, title: 'Mid Frontend Engineer' },
  { name: 'Chloe Dubois', email: 'chloe.dubois@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 0.97, rel: 0.90, title: 'Mid Full Stack Engineer' },
  { name: 'Lucas Silva', email: 'lucas.silva@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 0.90, rel: 0.88, title: 'Junior Backend Engineer', coldStart: true },
  { name: 'Emily Watson', email: 'emily.watson@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 0.92, rel: 0.89, title: 'Junior Frontend Engineer' },
  { name: 'Mateo Rossi', email: 'mateo.rossi@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 20, eff: 1.12, rel: 0.95, title: 'Systems & Performance Specialist' },
  { name: 'Aisha Bello', email: 'aisha.bello@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 1.05, rel: 0.94, title: 'Senior Backend Engineer' },
  { name: 'Kenji Sato', email: 'kenji.sato@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 1.01, rel: 0.93, title: 'Senior Mobile Engineer' },
  { name: 'Sofia Gomez', email: 'sofia.gomez@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 0.99, rel: 0.92, title: 'Mid Full Stack Engineer', bench: true },
  { name: 'David Kim', email: 'david.kim@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 1.03, rel: 0.93, title: 'Mid Backend Engineer' },
  { name: 'Rachel Green', email: 'rachel.green@workforce.example', role: 'EMPLOYEE', dept: 'Software Engineering', cap: 40, eff: 0.89, rel: 0.87, title: 'Junior Full Stack Engineer' },

  // Product & Design (6)
  { name: 'Jordan Taylor', email: 'jordan.taylor@workforce.example', role: 'EMPLOYEE', dept: 'Product & Design', cap: 40, eff: 1.06, rel: 0.97, title: 'Lead Product Manager' },
  { name: 'Hannah Abbott', email: 'hannah.abbott@workforce.example', role: 'EMPLOYEE', dept: 'Product & Design', cap: 40, eff: 1.04, rel: 0.96, title: 'Senior Technical PM (FinTech)' },
  { name: 'Gabriel Santos', email: 'gabriel.santos@workforce.example', role: 'EMPLOYEE', dept: 'Product & Design', cap: 40, eff: 1.14, rel: 0.98, title: 'Principal Design System Architect' },
  { name: 'Zoe Kravitz', email: 'zoe.kravitz@workforce.example', role: 'EMPLOYEE', dept: 'Product & Design', cap: 40, eff: 1.02, rel: 0.94, title: 'Senior UX Researcher & Designer' },
  { name: 'Oliver Wright', email: 'oliver.wright@workforce.example', role: 'EMPLOYEE', dept: 'Product & Design', cap: 30, eff: 1.00, rel: 0.95, title: 'Technical Documentation Lead' },
  { name: 'Nora Helmer', email: 'nora.helmer@workforce.example', role: 'EMPLOYEE', dept: 'Product & Design', cap: 40, eff: 0.94, rel: 0.90, title: 'Associate Product Manager' },

  // Cloud & DevOps / SRE (6)
  { name: 'Viktor Meyer', email: 'viktor.meyer@workforce.example', role: 'EMPLOYEE', dept: 'Cloud & DevOps', cap: 40, eff: 1.18, rel: 0.97, title: 'Principal Cloud Architect' },
  { name: 'Fatima Zahra', email: 'fatima.zahra@workforce.example', role: 'EMPLOYEE', dept: 'Cloud & DevOps', cap: 40, eff: 1.11, rel: 0.98, title: 'Staff Site Reliability Engineer' },
  { name: 'Christian Bale', email: 'christian.bale@workforce.example', role: 'EMPLOYEE', dept: 'Cloud & DevOps', cap: 40, eff: 1.07, rel: 0.96, title: 'Senior Cloud Security & IAM Engineer' },
  { name: 'Ananya Roy', email: 'ananya.roy@workforce.example', role: 'EMPLOYEE', dept: 'Cloud & DevOps', cap: 40, eff: 1.03, rel: 0.94, title: 'Senior Platform Engineer' },
  { name: 'Sean Murphy', email: 'sean.murphy@workforce.example', role: 'EMPLOYEE', dept: 'Cloud & DevOps', cap: 40, eff: 0.96, rel: 0.91, title: 'Mid Infrastructure Engineer' },
  { name: 'Carlos Vega', email: 'carlos.vega@workforce.example', role: 'EMPLOYEE', dept: 'Cloud & DevOps', cap: 20, eff: 0.88, rel: 0.86, title: 'Cloud Engineering Intern' },

  // Data & AI (6)
  { name: 'Dr. Aris Thorne', email: 'aris.thorne@workforce.example', role: 'EMPLOYEE', dept: 'Data & AI', cap: 40, eff: 1.16, rel: 0.98, title: 'Staff ML Research Scientist' },
  { name: 'Leila Mahmoud', email: 'leila.mahmoud@workforce.example', role: 'EMPLOYEE', dept: 'Data & AI', cap: 40, eff: 1.09, rel: 0.96, title: 'Senior Data Platform Engineer' },
  { name: 'Ethan Hunt', email: 'ethan.hunt@workforce.example', role: 'EMPLOYEE', dept: 'Data & AI', cap: 40, eff: 1.06, rel: 0.94, title: 'Senior MLOps & Serving Engineer' },
  { name: 'Nina Simone', email: 'nina.simone@workforce.example', role: 'EMPLOYEE', dept: 'Data & AI', cap: 40, eff: 1.02, rel: 0.93, title: 'Senior Data Scientist' },
  { name: 'Kevin Bacon', email: 'kevin.bacon@workforce.example', role: 'EMPLOYEE', dept: 'Data & AI', cap: 40, eff: 0.98, rel: 0.91, title: 'Mid Data Engineer' },
  { name: 'Mira Nair', email: 'mira.nair@workforce.example', role: 'EMPLOYEE', dept: 'Data & AI', cap: 40, eff: 0.91, rel: 0.89, title: 'Junior BI Analyst' },

  // QA & Testing (4)
  { name: 'Travis Scott', email: 'travis.scott@workforce.example', role: 'EMPLOYEE', dept: 'QA & Testing', cap: 40, eff: 1.10, rel: 0.97, title: 'Staff SDET & Automation Architect' },
  { name: 'Megan Fox', email: 'megan.fox@workforce.example', role: 'EMPLOYEE', dept: 'QA & Testing', cap: 40, eff: 1.04, rel: 0.94, title: 'Senior QA Automation Engineer' },
  { name: 'Samuel Jackson', email: 'samuel.jackson@workforce.example', role: 'EMPLOYEE', dept: 'QA & Testing', cap: 40, eff: 0.99, rel: 0.92, title: 'Mid QA Engineer' },
  { name: 'Jessica Alba', email: 'jessica.alba@workforce.example', role: 'EMPLOYEE', dept: 'QA & Testing', cap: 40, eff: 0.93, rel: 0.88, title: 'Junior Test Automation Engineer' }
];

const employees = EMPLOYEES_DEF.map((e, i) => {
  const id = makeUuid('10000000', i + 1);
  return {
    id,
    name: e.name,
    email: e.email,
    weekly_capacity_hours: e.cap,
    efficiency_score: e.eff,
    reliability_score: e.rel,
    created_at: '2025-06-01 09:00:00+00',
    // Metadata for child tables
    role: e.role,
    dept: e.dept,
    title: e.title,
    coldStart: Boolean(e.coldStart),
    bench: Boolean(e.bench)
  };
});

// Employee Auth Records
const employeeAuth = employees.map(e => ({
  employee_id: e.id,
  auth_user_id: e.id.replace('10000000', 'f0000000'), // Deterministic Auth UID
  role: e.role,
  is_active: true,
  created_at: '2025-06-01 09:00:00+00'
}));

// Employee Profiles
const employeeProfiles = employees.map(e => {
  const isLead = e.title.includes('Lead') || e.title.includes('Principal') || e.title.includes('Staff') || e.role === 'MANAGER';
  const isSenior = isLead || e.title.includes('Senior');
  const isJunior = e.title.includes('Junior') || e.coldStart;

  const techStrength = isLead ? randFloat(4.5, 4.9) : isSenior ? randFloat(3.8, 4.4) : isJunior ? randFloat(2.5, 3.2) : randFloat(3.2, 3.8);
  const leadership = isLead ? randFloat(4.2, 4.9) : isSenior ? randFloat(3.2, 4.0) : randFloat(1.5, 2.8);
  const comm = randFloat(3.5, 4.8);
  const ownership = isLead ? randFloat(4.4, 4.9) : randFloat(3.5, 4.5);
  const adaptability = randFloat(3.5, 4.7);
  const learningSpeed = isJunior ? randFloat(4.2, 4.8) : randFloat(3.6, 4.5);
  const colab = randFloat(3.8, 4.9);
  const docScore = randFloat(3.4, 4.7);

  const preferredDomains = e.dept === 'Software Engineering' ? ['Fintech', 'Distributed Systems', 'Cloud Native']
    : e.dept === 'Product & Design' ? ['User Experience', 'Design Systems', 'Fintech']
    : e.dept === 'Cloud & DevOps' ? ['Infrastructure', 'Security', 'Observability']
    : e.dept === 'Data & AI' ? ['Machine Learning', 'Big Data', 'Stream Processing']
    : e.dept === 'QA & Testing' ? ['Test Automation', 'Performance Testing', 'CI/CD']
    : ['Engineering Strategy', 'Resource Management'];

  const strengths = isLead ? ['System Architecture', 'Technical Mentorship', 'High Concurrency']
    : isSenior ? ['Domain Modeling', 'Clean Code', 'API Design']
    : ['Fast Learner', 'Detail Oriented', 'Eager to Contribute'];

  const weaknesses = isJunior ? ['Limited Experience with Production Incidents', 'Needs Supervision on DB Tuning']
    : isLead ? ['Occasional Reluctance to Delegate Critical Path Tasks']
    : ['Prefers Deep Work Over Frequent Context Switching'];

  const riskFlags = e.name === 'Sarah Jenkins' ? ['High Burnout Probability', 'Over-allocated >100%']
    : e.name === 'Viktor Meyer' ? ['Over-allocated >100%', 'Critical Path Dependency']
    : e.coldStart ? ['Cold Start - Sparse Task History']
    : [];

  return {
    id: e.id.replace('10000000', '70000000'),
    employee_id: e.id,
    technical_strength: techStrength,
    leadership_score: leadership,
    communication_score: comm,
    ownership_score: ownership,
    adaptability_score: adaptability,
    learning_speed: learningSpeed,
    collaboration_score: colab,
    documentation_score: docScore,
    preferred_domains: preferredDomains,
    risk_flags: riskFlags,
    profile_summary: `${e.name} is a ${e.title} within ${e.dept} with exceptional competence in ${strengths.join(', ')}.`,
    profile_version: 1,
    strengths,
    weaknesses,
    recommended_roles: [e.title, isLead ? 'Engineering Manager' : 'Tech Lead'],
    training_recommendations: isJunior ? ['Advanced Microservices Patterns', 'Production Observability'] : ['Executive Communication'],
    career_path: isLead ? 'Distinguished Engineer / Director' : isSenior ? 'Staff Engineer / Tech Lead' : 'Senior Engineer',
    consistency_score: randFloat(0.85, 0.98),
    reliability_score: e.reliability_score,
    workload_tolerance: randFloat(0.80, 0.95),
    availability_score: e.bench ? 1.00 : e.name === 'Sarah Jenkins' || e.name === 'Viktor Meyer' ? 0.00 : randFloat(0.15, 0.60),
    generated_by: 'AI Engine',
    llm_version: 'v2.1-workforce'
  };
});

// Employee Knowledge Records
const employeeKnowledge = employees.map(e => {
  const isJunior = e.coldStart || e.title.includes('Junior');
  const projCompleted = e.coldStart ? 0 : isJunior ? randInt(1, 3) : randInt(5, 14);
  const avgQuality = e.coldStart ? 0.00 : randFloat(4.1, 4.9);
  const avgDelay = e.coldStart ? 0.0 : randFloat(0.0, 1.8);
  const attScore = randFloat(0.92, 0.99);
  const workloadScore = randFloat(36, 44);
  const perfScore = e.coldStart ? 0.70 : randFloat(0.82, 0.97);

  const skillVector = {
    backend: e.dept === 'Software Engineering' ? 0.9 : 0.3,
    frontend: e.title.includes('Frontend') || e.title.includes('Design') ? 0.95 : 0.2,
    devops: e.dept === 'Cloud & DevOps' ? 0.95 : 0.4,
    data: e.dept === 'Data & AI' ? 0.95 : 0.3,
    qa: e.dept === 'QA & Testing' ? 0.95 : 0.3
  };

  return {
    id: e.id.replace('10000000', '71000000'),
    employee_id: e.id,
    projects_completed: projCompleted,
    average_quality: avgQuality,
    average_delay: avgDelay,
    attendance_score: attScore,
    workload_score: workloadScore,
    performance_score: perfScore,
    reliability_score: e.reliability_score,
    skill_vector: skillVector,
    feedback_summary: e.coldStart ? 'New onboarding employee with strong foundational qualifications.' : `${e.name} consistently delivers high-velocity, high-quality deliverables across sprints.`,
    knowledge_version: 1
  };
});

// ML Predictions Records
const mlPredictions = employees.map(e => {
  const isOverloaded = e.name === 'Sarah Jenkins' || e.name === 'Viktor Meyer';
  const burnoutProb = isOverloaded ? randFloat(0.82, 0.91) : randFloat(0.05, 0.32);
  const compRate = isOverloaded ? randFloat(0.72, 0.79) : randFloat(0.88, 0.98);
  const predPerf = e.coldStart ? 0.75 : randFloat(0.82, 0.96);
  const delConf = e.coldStart ? 0.65 : randFloat(0.85, 0.98);
  const recScore = isOverloaded ? 62.0 : e.coldStart ? 70.0 : randFloat(82.0, 97.5);

  return {
    id: e.id.replace('10000000', '80000000'),
    employee_id: e.id,
    predicted_performance: predPerf,
    predicted_completion_rate: compRate,
    burnout_probability: burnoutProb,
    delivery_confidence: delConf,
    recommendation_score: recScore
  };
});

// ============================================================================
// 3. EMPLOYEE SKILLS MAPPING (180+ records)
// ============================================================================
// skill index helper
const skillId = (idx) => skills[idx - 1].id;

const employeeSkills = [];

employees.forEach((emp, i) => {
  const isLead = emp.title.includes('Lead') || emp.title.includes('Principal') || emp.title.includes('Staff');
  const isSenior = isLead || emp.title.includes('Senior');
  const maxProf = isLead ? 5 : isSenior ? 4 : 3;

  // Add primary domain skills
  if (emp.dept === 'Software Engineering') {
    if (emp.title.includes('Frontend')) {
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(1), proficiency_level: maxProf }); // TypeScript
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(2), proficiency_level: maxProf }); // React
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(14), proficiency_level: Math.max(1, maxProf - 1) }); // Next.js
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(28), proficiency_level: Math.max(1, maxProf - 1) }); // Design Systems
    } else if (emp.title.includes('Mobile')) {
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(19), proficiency_level: maxProf }); // Flutter
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(20), proficiency_level: maxProf }); // React Native
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(1), proficiency_level: maxProf - 1 }); // TypeScript
    } else if (emp.title.includes('Distributed') || emp.name.includes('Devansh') || emp.name.includes('Mateo')) {
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(5), proficiency_level: 5 }); // Go
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(7), proficiency_level: 5 }); // Kubernetes
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(12), proficiency_level: 4 }); // Kafka
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(26), proficiency_level: 5 }); // System Architecture
    } else {
      // Backend / Fullstack
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(1), proficiency_level: maxProf }); // TypeScript
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(3), proficiency_level: maxProf }); // Node.js
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(6), proficiency_level: maxProf }); // PostgreSQL
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(13), proficiency_level: Math.max(1, maxProf - 1) }); // Redis
      if (emp.name.includes('Maya') || emp.name.includes('David')) {
        employeeSkills.push({ employee_id: emp.id, skill_id: skillId(17), proficiency_level: maxProf }); // Java
        employeeSkills.push({ employee_id: emp.id, skill_id: skillId(18), proficiency_level: maxProf }); // Spring Boot
      }
    }
  } else if (emp.dept === 'Cloud & DevOps') {
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(7), proficiency_level: maxProf }); // Kubernetes
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(8), proficiency_level: maxProf }); // Docker
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(9), proficiency_level: maxProf }); // AWS
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(10), proficiency_level: maxProf }); // Terraform
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(21), proficiency_level: maxProf }); // CI/CD
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(22), proficiency_level: maxProf }); // SRE
    if (emp.title.includes('Security')) {
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(27), proficiency_level: 5 }); // Security
    }
  } else if (emp.dept === 'Data & AI') {
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(4), proficiency_level: maxProf }); // Python
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(6), proficiency_level: maxProf }); // PostgreSQL
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(23), proficiency_level: maxProf }); // Data Modeling
    if (emp.title.includes('ML') || emp.title.includes('Scientist')) {
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(11), proficiency_level: maxProf }); // PyTorch
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(16), proficiency_level: maxProf }); // FastAPI
    } else {
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(12), proficiency_level: maxProf }); // Kafka
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(24), proficiency_level: maxProf }); // Snowflake
    }
  } else if (emp.dept === 'QA & Testing') {
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(25), proficiency_level: maxProf }); // Automated Testing
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(1), proficiency_level: Math.max(1, maxProf - 1) }); // TypeScript
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(4), proficiency_level: Math.max(1, maxProf - 1) }); // Python
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(21), proficiency_level: maxProf }); // CI/CD
  } else if (emp.dept === 'Product & Design') {
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(28), proficiency_level: maxProf }); // Design Systems
    if (emp.title.includes('Technical PM') || emp.title.includes('Lead')) {
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(23), proficiency_level: 4 }); // Data Modeling
      employeeSkills.push({ employee_id: emp.id, skill_id: skillId(26), proficiency_level: 4 }); // System Architecture
    }
  } else {
    // Leadership
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(26), proficiency_level: 5 }); // System Architecture
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(7), proficiency_level: 4 }); // Kubernetes
    employeeSkills.push({ employee_id: emp.id, skill_id: skillId(9), proficiency_level: 4 }); // AWS
  }
});

// ============================================================================
// 4. PROJECTS (8 projects across lifecycles)
// ============================================================================
const PROJECTS_DEF = [
  { name: 'Apollo NextGen Core Platform', priority: 5, hours: 3200, start: '2026-01-01', end: '2026-12-31', status: 'ACTIVE' },
  { name: 'Nova Financial Ledger Engine', priority: 4, hours: 2400, start: '2026-02-15', end: '2026-10-31', status: 'ACTIVE' },
  { name: 'Helios Mobile Banking App', priority: 3, hours: 1800, start: '2026-03-01', end: '2026-11-30', status: 'ACTIVE' },
  { name: 'Sentinel Real-Time Fraud Detector', priority: 5, hours: 2800, start: '2026-04-01', end: '2027-02-28', status: 'ACTIVE' },
  { name: 'Pulse IoT Telemetry Pipeline', priority: 3, hours: 1600, start: '2026-12-01', end: '2027-06-30', status: 'PLANNED' },
  { name: 'Orion Enterprise Design System', priority: 2, hours: 1200, start: '2026-02-01', end: '2026-09-30', status: 'ACTIVE' },
  { name: 'Aegis Zero-Trust Security Gateway', priority: 4, hours: 2000, start: '2025-06-01', end: '2026-03-31', status: 'COMPLETED' },
  { name: 'Vanguard Multi-Region Migration', priority: 3, hours: 1500, start: '2026-05-01', end: '2026-12-31', status: 'PAUSED' }
];

const projects = PROJECTS_DEF.map((p, i) => ({
  id: makeUuid('30000000', i + 1),
  name: p.name,
  project_priority: p.priority,
  estimated_total_hours: p.hours,
  start_date: p.start,
  end_date: p.end,
  status: p.status,
  created_at: '2025-05-01 08:00:00+00'
}));

// ============================================================================
// 5. PROJECT STAFFING REQUIREMENTS (24 requirements)
// ============================================================================
const staffingRequirements = [
  // Apollo (p1)
  { id: makeUuid('40000000', 1), project_id: projects[0].id, required_role: 'Principal Distributed Systems Lead', skill_id: skillId(5), minimum_proficiency: 4, required_headcount: 1, allocation_hours_per_week: 40, priority: 5 },
  { id: makeUuid('40000000', 2), project_id: projects[0].id, required_role: 'Senior Backend Engineer', skill_id: skillId(1), minimum_proficiency: 4, required_headcount: 2, allocation_hours_per_week: 40, priority: 4 },
  { id: makeUuid('40000000', 3), project_id: projects[0].id, required_role: 'Staff SRE Engineer', skill_id: skillId(7), minimum_proficiency: 4, required_headcount: 1, allocation_hours_per_week: 40, priority: 5 },
  { id: makeUuid('40000000', 4), project_id: projects[0].id, required_role: 'Staff Frontend Architect', skill_id: skillId(2), minimum_proficiency: 4, required_headcount: 1, allocation_hours_per_week: 30, priority: 4 },

  // Nova (p2)
  { id: makeUuid('40000000', 5), project_id: projects[1].id, required_role: 'Financial Backend Lead', skill_id: skillId(6), minimum_proficiency: 4, required_headcount: 1, allocation_hours_per_week: 40, priority: 5 },
  { id: makeUuid('40000000', 6), project_id: projects[1].id, required_role: 'Senior Java/Spring Engineer', skill_id: skillId(18), minimum_proficiency: 4, required_headcount: 1, allocation_hours_per_week: 40, priority: 4 },
  { id: makeUuid('40000000', 7), project_id: projects[1].id, required_role: 'Senior Security & IAM Specialist', skill_id: skillId(27), minimum_proficiency: 4, required_headcount: 1, allocation_hours_per_week: 40, priority: 4 },

  // Helios Mobile (p3)
  { id: makeUuid('40000000', 8), project_id: projects[2].id, required_role: 'Senior Mobile Lead', skill_id: skillId(20), minimum_proficiency: 4, required_headcount: 1, allocation_hours_per_week: 40, priority: 4 },
  { id: makeUuid('40000000', 9), project_id: projects[2].id, required_role: 'Cross-Platform Flutter Engineer', skill_id: skillId(19), minimum_proficiency: 3, required_headcount: 1, allocation_hours_per_week: 40, priority: 3 },
  { id: makeUuid('40000000', 10), project_id: projects[2].id, required_role: 'Mobile QA Automation Specialist', skill_id: skillId(25), minimum_proficiency: 3, required_headcount: 1, allocation_hours_per_week: 40, priority: 3 },

  // Sentinel Fraud Detector (p4)
  { id: makeUuid('40000000', 11), project_id: projects[3].id, required_role: 'Staff ML Research Scientist', skill_id: skillId(11), minimum_proficiency: 5, required_headcount: 1, allocation_hours_per_week: 40, priority: 5 },
  { id: makeUuid('40000000', 12), project_id: projects[3].id, required_role: 'Streaming Pipeline Engineer', skill_id: skillId(12), minimum_proficiency: 4, required_headcount: 1, allocation_hours_per_week: 40, priority: 5 },
  { id: makeUuid('40000000', 13), project_id: projects[3].id, required_role: 'MLOps Infrastructure Specialist', skill_id: skillId(8), minimum_proficiency: 4, required_headcount: 1, allocation_hours_per_week: 40, priority: 4 },

  // Pulse IoT (p5 - PLANNED with intentional staffing gap)
  { id: makeUuid('40000000', 14), project_id: projects[4].id, required_role: 'IoT Ingestion Engineer', skill_id: skillId(5), minimum_proficiency: 4, required_headcount: 2, allocation_hours_per_week: 40, priority: 4 },
  { id: makeUuid('40000000', 15), project_id: projects[4].id, required_role: 'Stream Analytics Engineer', skill_id: skillId(12), minimum_proficiency: 4, required_headcount: 1, allocation_hours_per_week: 40, priority: 3 },

  // Orion Design System (p6)
  { id: makeUuid('40000000', 16), project_id: projects[5].id, required_role: 'Design System Architect', skill_id: skillId(28), minimum_proficiency: 5, required_headcount: 1, allocation_hours_per_week: 40, priority: 3 },
  { id: makeUuid('40000000', 17), project_id: projects[5].id, required_role: 'Senior Component Engineer', skill_id: skillId(2), minimum_proficiency: 4, required_headcount: 1, allocation_hours_per_week: 20, priority: 3 },

  // Aegis (p7 - COMPLETED)
  { id: makeUuid('40000000', 18), project_id: projects[6].id, required_role: 'Zero-Trust Architect', skill_id: skillId(27), minimum_proficiency: 4, required_headcount: 1, allocation_hours_per_week: 40, priority: 4 },
  { id: makeUuid('40000000', 19), project_id: projects[6].id, required_role: 'Cloud Security Engineer', skill_id: skillId(9), minimum_proficiency: 4, required_headcount: 1, allocation_hours_per_week: 40, priority: 4 },

  // Vanguard (p8 - PAUSED)
  { id: makeUuid('40000000', 20), project_id: projects[7].id, required_role: 'Multi-Cloud Migration Lead', skill_id: skillId(10), minimum_proficiency: 4, required_headcount: 1, allocation_hours_per_week: 40, priority: 3 }
].map(r => ({
  ...r,
  allocation_percentage: Number(((r.allocation_hours_per_week / 40) * 100).toFixed(2)),
  is_mandatory: true,
  created_at: '2025-06-01 10:00:00+00',
  updated_at: '2025-06-01 10:00:00+00'
}));

// ============================================================================
// 6. TASKS & TASK HISTORY (140+ tasks, 110+ history records)
// ============================================================================
const tasks = [];
const taskHistory = [];
let taskCounter = 1;
let historyCounter = 1;

const TASK_TEMPLATES = [
  'Architect high-throughput event ingestion',
  'Implement zero-downtime database migration script',
  'Harden OAuth2 / OIDC authentication service',
  'Implement rate-limiting middleware with Redis',
  'Refactor React component library for WCAG 2.1 AA accessibility',
  'Configure Prometheus alerting rules and Grafana dashboards',
  'Construct automated E2E regression test suite',
  'Build streaming feature pipeline in PyTorch',
  'Develop mobile push notification handler',
  'Deploy multi-region Terraform infrastructure modules',
  'Tune PostgreSQL query planner and B-tree indexes',
  'Conduct threat model and API penetration audit',
  'Optimize bundle size and tree-shaking for web client',
  'Provision Kafka topic partitions and replication topology',
  'Dockerize microservice with non-root security context'
];

projects.forEach((proj, pIdx) => {
  const taskCount = proj.status === 'COMPLETED' ? 24 : proj.status === 'ACTIVE' ? 20 : 8;
  for (let k = 0; k < taskCount; k++) {
    const tId = makeUuid('60000000', taskCounter++);
    const title = `${proj.name.split(' ')[0]}: ${TASK_TEMPLATES[(pIdx * 3 + k) % TASK_TEMPLATES.length]} #${k + 1}`;
    const complexity = randInt(2, 5);
    const estHours = complexity * 8 + randInt(0, 10);
    const isCompleted = proj.status === 'COMPLETED' || (proj.status === 'ACTIVE' && k < 12);
    const status = isCompleted ? 'COMPLETED' : proj.status === 'PAUSED' ? 'BLOCKED' : k % 4 === 0 ? 'IN_PROGRESS' : 'PENDING';

    tasks.push({
      id: tId,
      project_id: proj.id,
      title,
      description: `Technical deliverable supporting ${proj.name}. Requires rigorous code review and CI verification.`,
      complexity,
      priority: randInt(2, 5),
      estimated_hours: estHours,
      status,
      created_at: '2026-01-10 10:00:00+00'
    });

    if (isCompleted) {
      // Assign an employee from appropriate department
      const eligibleEmployees = employees.filter(e => !e.coldStart && e.role !== 'MANAGER');
      const emp = eligibleEmployees[(taskCounter + k) % eligibleEmployees.length];
      const actualHours = Math.round(estHours * randFloat(0.9, 1.25));
      const delay = randInt(0, 3);
      const quality = randFloat(3.8, 5.0, 1);
      const monthOffset = randInt(1, 8);
      const compDate = `2026-0${Math.min(9, Math.max(1, 10 - monthOffset))}-${String(randInt(10, 28)).padStart(2, '0')}`;

      taskHistory.push({
        id: makeUuid('61000000', historyCounter++),
        task_id: tId,
        employee_id: emp.id,
        estimated_hours: estHours,
        actual_hours: actualHours,
        quality_score: quality,
        delay_days: delay,
        completed_on: compDate,
        created_at: `${compDate} 18:00:00+00`
      });
    }
  }
});

// ============================================================================
// 7. ALLOCATION PROPOSALS & PROPOSAL MEMBERS (Scenarios 1, 2, 7)
// ============================================================================
const proposals = [
  // Proposal 1: Apollo Core Platform Staffing (APPROVED)
  {
    id: makeUuid('90000000', 1),
    project_id: projects[0].id,
    requested_by: employees[0].id, // Elena Rostova
    status: 'APPROVED',
    requested_team_size: 4,
    selected_headcount: 4,
    proposal_summary: { overall_match: 0.94, team_risk: 'LOW', estimated_weekly_cost_hours: 150 },
    staffing_gap_summary: { gaps: [] },
    decision_weight_version: 'v2.0-balanced',
    model_version_summary: { model: 'workforce-quantifier-v2.1', checkpoint: 'prod-202611' },
    explanation: 'Optimal multi-role configuration meeting all mandatory technical requirements with zero capacity conflicts.',
    reviewed_at: '2026-01-15 14:30:00+00',
    reviewed_by: employees[0].id,
    review_comment: 'Approved. Team composition shows strong synergy between distributed systems and SRE.',
    created_at: '2026-01-14 09:00:00+00',
    updated_at: '2026-01-15 14:30:00+00'
  },
  // Proposal 2: Sentinel Fraud Detector Staffing (PENDING_APPROVAL)
  {
    id: makeUuid('90000000', 2),
    project_id: projects[3].id,
    requested_by: employees[1].id, // Marcus Vance
    status: 'PENDING_APPROVAL',
    requested_team_size: 3,
    selected_headcount: 3,
    proposal_summary: { overall_match: 0.92, team_risk: 'MEDIUM', estimated_weekly_cost_hours: 120 },
    staffing_gap_summary: { gaps: [] },
    decision_weight_version: 'v2.0-balanced',
    model_version_summary: { model: 'workforce-quantifier-v2.1', checkpoint: 'prod-202611' },
    explanation: 'High competence match in PyTorch and streaming architectures. Pending VP sign-off.',
    reviewed_at: null,
    reviewed_by: null,
    review_comment: null,
    created_at: '2026-04-02 11:00:00+00',
    updated_at: '2026-04-02 11:00:00+00'
  },
  // Proposal 3: Pulse IoT Telemetry (DRAFT with Staffing Gap)
  {
    id: makeUuid('90000000', 3),
    project_id: projects[4].id,
    requested_by: employees[1].id,
    status: 'DRAFT',
    requested_team_size: 3,
    selected_headcount: 1,
    proposal_summary: { overall_match: 0.65, team_risk: 'HIGH', estimated_weekly_cost_hours: 40 },
    staffing_gap_summary: { gaps: ['Missing 1 Senior Go/IoT Engineer', 'Missing 1 Stream Analytics Specialist'] },
    decision_weight_version: 'v2.0-balanced',
    model_version_summary: { model: 'workforce-quantifier-v2.1', checkpoint: 'prod-202611' },
    explanation: 'Severe staffing deficit identified. Recommend initiating contractor sourcing or internal upskilling.',
    reviewed_at: null,
    reviewed_by: null,
    review_comment: null,
    created_at: '2026-10-20 15:00:00+00',
    updated_at: '2026-10-20 15:00:00+00'
  }
];

const proposalMembers = [
  // Members for Proposal 1 (Apollo Core - Approved)
  {
    id: makeUuid('91000000', 1),
    proposal_id: proposals[0].id,
    employee_id: employees[2].id, // Devansh Sharma
    staffing_requirement_id: staffingRequirements[0].id,
    proposed_role: 'Principal Distributed Systems Lead',
    allocated_hours_per_week: 40,
    allocation_percentage: 100.0,
    eligibility_status: 'ELIGIBLE',
    constraint_snapshot: { available_hours: 40, active_projects: 0 },
    score_breakdown: { skill: 0.98, perf: 0.96, fairness: 0.90, risk: 0.05 },
    skill_match_score: 0.98,
    predicted_performance: 0.96,
    predicted_completion_hours: 38.0,
    burnout_risk_probability: 0.10,
    fairness_adjustment: 0.02,
    final_score: 0.95,
    availability_status: 'AVAILABLE_NOW',
    explanation: 'Devansh has verified mastery of Go and Kubernetes with proven track record on distributed platforms.',
    created_at: '2026-01-14 09:10:00+00'
  },
  {
    id: makeUuid('91000000', 2),
    proposal_id: proposals[0].id,
    employee_id: employees[4].id, // Liam O'Connor
    staffing_requirement_id: staffingRequirements[1].id,
    proposed_role: 'Senior Backend Engineer',
    allocated_hours_per_week: 40,
    allocation_percentage: 100.0,
    eligibility_status: 'ELIGIBLE',
    constraint_snapshot: { available_hours: 40, active_projects: 0 },
    score_breakdown: { skill: 0.92, perf: 0.94, fairness: 0.92, risk: 0.12 },
    skill_match_score: 0.92,
    predicted_performance: 0.94,
    predicted_completion_hours: 40.0,
    burnout_risk_probability: 0.12,
    fairness_adjustment: 0.01,
    final_score: 0.91,
    availability_status: 'AVAILABLE_NOW',
    explanation: 'Liam offers robust experience with Node.js and PostgreSQL high-throughput APIs.',
    created_at: '2026-01-14 09:10:00+00'
  },
  {
    id: makeUuid('91000000', 3),
    proposal_id: proposals[0].id,
    employee_id: employees[25].id, // Fatima Zahra
    staffing_requirement_id: staffingRequirements[2].id,
    proposed_role: 'Staff SRE Engineer',
    allocated_hours_per_week: 40,
    allocation_percentage: 100.0,
    eligibility_status: 'ELIGIBLE',
    constraint_snapshot: { available_hours: 40, active_projects: 0 },
    score_breakdown: { skill: 0.97, perf: 0.97, fairness: 0.88, risk: 0.08 },
    skill_match_score: 0.97,
    predicted_performance: 0.97,
    predicted_completion_hours: 39.0,
    burnout_risk_probability: 0.08,
    fairness_adjustment: 0.00,
    final_score: 0.94,
    availability_status: 'AVAILABLE_NOW',
    explanation: 'Fatima is the premier SRE specialist for Kubernetes autoscaling and Prometheus monitoring.',
    created_at: '2026-01-14 09:10:00+00'
  },
  {
    id: makeUuid('91000000', 4),
    proposal_id: proposals[0].id,
    employee_id: employees[3].id, // Sarah Jenkins (Deliberate high load)
    staffing_requirement_id: staffingRequirements[3].id,
    proposed_role: 'Staff Frontend Architect',
    allocated_hours_per_week: 30,
    allocation_percentage: 75.0,
    eligibility_status: 'ELIGIBLE',
    constraint_snapshot: { available_hours: 40, active_projects: 0 },
    score_breakdown: { skill: 0.99, perf: 0.95, fairness: 0.70, risk: 0.45 },
    skill_match_score: 0.99,
    predicted_performance: 0.95,
    predicted_completion_hours: 32.0,
    burnout_risk_probability: 0.45,
    fairness_adjustment: -0.05,
    final_score: 0.86,
    availability_status: 'AVAILABLE_NOW',
    explanation: 'Sarah provides unparalleled frontend architecture expertise; monitored for subsequent multi-project load.',
    created_at: '2026-01-14 09:10:00+00'
  },

  // Members for Proposal 2 (Sentinel Fraud Detector - Submitted)
  {
    id: makeUuid('91000000', 5),
    proposal_id: proposals[1].id,
    employee_id: employees[30].id, // Dr. Aris Thorne
    staffing_requirement_id: staffingRequirements[10].id,
    proposed_role: 'Staff ML Research Scientist',
    allocated_hours_per_week: 40,
    allocation_percentage: 100.0,
    eligibility_status: 'ELIGIBLE',
    constraint_snapshot: { available_hours: 40, active_projects: 0 },
    score_breakdown: { skill: 0.99, perf: 0.97, fairness: 0.85, risk: 0.10 },
    skill_match_score: 0.99,
    predicted_performance: 0.97,
    predicted_completion_hours: 38.0,
    burnout_risk_probability: 0.10,
    fairness_adjustment: 0.00,
    final_score: 0.96,
    availability_status: 'AVAILABLE_NOW',
    explanation: 'Aris is an authority on transformer architectures and fraud classification models.',
    created_at: '2026-04-02 11:15:00+00'
  },
  {
    id: makeUuid('91000000', 6),
    proposal_id: proposals[1].id,
    employee_id: employees[31].id, // Leila Mahmoud
    staffing_requirement_id: staffingRequirements[11].id,
    proposed_role: 'Streaming Pipeline Engineer',
    allocated_hours_per_week: 40,
    allocation_percentage: 100.0,
    eligibility_status: 'ELIGIBLE',
    constraint_snapshot: { available_hours: 40, active_projects: 0 },
    score_breakdown: { skill: 0.95, perf: 0.95, fairness: 0.89, risk: 0.12 },
    skill_match_score: 0.95,
    predicted_performance: 0.95,
    predicted_completion_hours: 40.0,
    burnout_risk_probability: 0.12,
    fairness_adjustment: 0.01,
    final_score: 0.93,
    availability_status: 'AVAILABLE_NOW',
    explanation: 'Leila possesses extensive experience managing Kafka streaming topologies.',
    created_at: '2026-04-02 11:15:00+00'
  }
];

// ============================================================================
// 8. ALLOCATIONS (Active, Completed, Over-allocated)
// ============================================================================
const allocations = [];
let allocCounter = 1;

// Active Allocations for Apollo (p1)
allocations.push({
  id: makeUuid('50000000', allocCounter++),
  employee_id: employees[2].id, // Devansh
  project_id: projects[0].id,
  week_start_date: '2026-01-19',
  allocated_hours: 40,
  allocated_hours_per_week: 40,
  allocation_percentage: 100.0,
  status: 'ACTIVE',
  proposal_id: proposals[0].id,
  proposal_member_id: proposalMembers[0].id,
  staffing_requirement_id: staffingRequirements[0].id,
  assigned_role: 'Principal Distributed Systems Lead',
  start_date: '2026-01-19',
  planned_end_date: '2026-12-31',
  actual_end_date: null,
  released_at: null,
  created_at: '2026-01-15 15:00:00+00'
});

allocations.push({
  id: makeUuid('50000000', allocCounter++),
  employee_id: employees[4].id, // Liam
  project_id: projects[0].id,
  week_start_date: '2026-01-19',
  allocated_hours: 40,
  allocated_hours_per_week: 40,
  allocation_percentage: 100.0,
  status: 'ACTIVE',
  proposal_id: proposals[0].id,
  proposal_member_id: proposalMembers[1].id,
  staffing_requirement_id: staffingRequirements[1].id,
  assigned_role: 'Senior Backend Engineer',
  start_date: '2026-01-19',
  planned_end_date: '2026-12-31',
  actual_end_date: null,
  released_at: null,
  created_at: '2026-01-15 15:00:00+00'
});

allocations.push({
  id: makeUuid('50000000', allocCounter++),
  employee_id: employees[25].id, // Fatima
  project_id: projects[0].id,
  week_start_date: '2026-01-19',
  allocated_hours: 40,
  allocated_hours_per_week: 40,
  allocation_percentage: 100.0,
  status: 'ACTIVE',
  proposal_id: proposals[0].id,
  proposal_member_id: proposalMembers[2].id,
  staffing_requirement_id: staffingRequirements[2].id,
  assigned_role: 'Staff SRE Engineer',
  start_date: '2026-01-19',
  planned_end_date: '2026-12-31',
  actual_end_date: null,
  released_at: null,
  created_at: '2026-01-15 15:00:00+00'
});

// DELIBERATE OVER-ALLOCATION DEMO: Sarah Jenkins (emp 3) allocated to Apollo (30h) AND Orion (20h) = 50h/week!
allocations.push({
  id: makeUuid('50000000', allocCounter++),
  employee_id: employees[3].id, // Sarah Jenkins
  project_id: projects[0].id, // Apollo Core
  week_start_date: '2026-01-19',
  allocated_hours: 30,
  allocated_hours_per_week: 30,
  allocation_percentage: 75.0,
  status: 'ACTIVE',
  proposal_id: proposals[0].id,
  proposal_member_id: proposalMembers[3].id,
  staffing_requirement_id: staffingRequirements[3].id,
  assigned_role: 'Staff Frontend Architect',
  start_date: '2026-01-19',
  planned_end_date: '2026-12-31',
  actual_end_date: null,
  released_at: null,
  created_at: '2026-01-15 15:00:00+00'
});

allocations.push({
  id: makeUuid('50000000', allocCounter++),
  employee_id: employees[3].id, // Sarah Jenkins (Second assignment -> Overloaded!)
  project_id: projects[5].id, // Orion Design System
  week_start_date: '2026-02-01',
  allocated_hours: 20,
  allocated_hours_per_week: 20,
  allocation_percentage: 50.0,
  status: 'ACTIVE',
  proposal_id: null,
  proposal_member_id: null,
  staffing_requirement_id: staffingRequirements[16].id,
  assigned_role: 'Senior Component Lead',
  start_date: '2026-02-01',
  planned_end_date: '2026-09-30',
  actual_end_date: null,
  released_at: null,
  created_at: '2026-01-28 10:00:00+00'
});

// DELIBERATE OVER-ALLOCATION DEMO 2: Viktor Meyer (emp 24) on Apollo (30h) and Nova (20h) = 50h/week!
allocations.push({
  id: makeUuid('50000000', allocCounter++),
  employee_id: employees[24].id, // Viktor Meyer
  project_id: projects[0].id,
  week_start_date: '2026-01-19',
  allocated_hours: 30,
  allocated_hours_per_week: 30,
  allocation_percentage: 75.0,
  status: 'ACTIVE',
  proposal_id: null,
  proposal_member_id: null,
  staffing_requirement_id: null,
  assigned_role: 'Principal Cloud Architect',
  start_date: '2026-01-19',
  planned_end_date: '2026-12-31',
  actual_end_date: null,
  released_at: null,
  created_at: '2026-01-15 15:00:00+00'
});

allocations.push({
  id: makeUuid('50000000', allocCounter++),
  employee_id: employees[24].id, // Viktor Meyer
  project_id: projects[1].id, // Nova Financial
  week_start_date: '2026-02-15',
  allocated_hours: 20,
  allocated_hours_per_week: 20,
  allocation_percentage: 50.0,
  status: 'ACTIVE',
  proposal_id: null,
  proposal_member_id: null,
  staffing_requirement_id: null,
  assigned_role: 'Infrastructure Architect',
  start_date: '2026-02-15',
  planned_end_date: '2026-10-31',
  actual_end_date: null,
  released_at: null,
  created_at: '2026-02-10 11:00:00+00'
});

// Additional active allocations across projects (Nova, Helios, Sentinel, Orion)
const additionalActive = [
  { empIdx: 5, pIdx: 1, role: 'Senior Backend Engineer', hours: 40 }, // Priya Patel on Nova
  { empIdx: 7, pIdx: 1, role: 'Mid Backend Engineer', hours: 40 }, // Maya Lin on Nova
  { empIdx: 19, pIdx: 1, role: 'Senior Technical PM', hours: 40 }, // Hannah Abbott on Nova
  { empIdx: 6, pIdx: 2, role: 'Senior Mobile Engineer', hours: 40 }, // Alex Chen on Helios
  { empIdx: 14, pIdx: 2, role: 'Senior Mobile Engineer', hours: 40 }, // Kenji Sato on Helios
  { empIdx: 37, pIdx: 2, role: 'QA Automation Engineer', hours: 40 }, // Megan Fox on Helios
  { empIdx: 30, pIdx: 3, role: 'Staff ML Research Scientist', hours: 40 }, // Aris Thorne on Sentinel
  { empIdx: 31, pIdx: 3, role: 'Senior Data Platform Engineer', hours: 40 }, // Leila Mahmoud on Sentinel
  { empIdx: 32, pIdx: 3, role: 'Senior MLOps Engineer', hours: 40 }, // Ethan Hunt on Sentinel
  { empIdx: 20, pIdx: 5, role: 'Principal Design System Architect', hours: 40 }, // Gabriel Santos on Orion
  { empIdx: 21, pIdx: 5, role: 'Senior UX Designer', hours: 40 }, // Zoe Kravitz on Orion
  { empIdx: 8, pIdx: 5, role: 'Mid Frontend Engineer', hours: 40 }, // Tariq on Orion
  { empIdx: 26, pIdx: 1, role: 'Senior Cloud Security Engineer', hours: 40 }, // Christian Bale on Nova
  { empIdx: 36, pIdx: 0, role: 'Staff SDET', hours: 40 } // Travis Scott on Apollo
];

additionalActive.forEach(item => {
  allocations.push({
    id: makeUuid('50000000', allocCounter++),
    employee_id: employees[item.empIdx].id,
    project_id: projects[item.pIdx].id,
    week_start_date: '2026-03-01',
    allocated_hours: item.hours,
    allocated_hours_per_week: item.hours,
    allocation_percentage: Number(((item.hours / 40) * 100).toFixed(2)),
    status: 'ACTIVE',
    proposal_id: null,
    proposal_member_id: null,
    staffing_requirement_id: null,
    assigned_role: item.role,
    start_date: '2026-03-01',
    planned_end_date: projects[item.pIdx].end_date,
    actual_end_date: null,
    released_at: null,
    created_at: '2026-02-25 10:00:00+00'
  });
});

// HISTORICAL COMPLETED ALLOCATIONS (Aegis Security Gateway - Scenario 8)
const completedAllocations = [
  { empIdx: 26, role: 'Zero-Trust Architect', hours: 40 }, // Christian Bale
  { empIdx: 27, role: 'Senior Platform Engineer', hours: 40 }, // Ananya Roy
  { empIdx: 4, role: 'Senior Backend Engineer', hours: 40 } // Liam O'Connor
];

completedAllocations.forEach(item => {
  allocations.push({
    id: makeUuid('50000000', allocCounter++),
    employee_id: employees[item.empIdx].id,
    project_id: projects[6].id, // Aegis (Completed)
    week_start_date: '2025-06-01',
    allocated_hours: item.hours,
    allocated_hours_per_week: item.hours,
    allocation_percentage: 100.0,
    status: 'WORK_COMPLETED',
    proposal_id: null,
    proposal_member_id: null,
    staffing_requirement_id: null,
    assigned_role: item.role,
    start_date: '2025-06-01',
    planned_end_date: '2026-03-31',
    actual_end_date: '2026-03-31',
    released_at: '2026-03-31 17:00:00+00',
    created_at: '2025-05-28 14:00:00+00'
  });
});

// ============================================================================
// 9. EMPLOYEE PERFORMANCE (120+ longitudinal weekly records)
// ============================================================================
const employeePerformance = [];
let perfCounter = 1;

employees.forEach((emp, i) => {
  if (emp.coldStart) return;
  const count = randInt(3, 5);
  for (let k = 0; k < count; k++) {
    const proj = projects[k % 4];
    const delivery = Number((0.80 + seededRandom() * 0.18).toFixed(2));
    const quality = Number((0.85 + seededRandom() * 0.14).toFixed(2));
    const weekStart = `2026-0${Math.min(9, 10 - k)}-${String(randInt(10, 25)).padStart(2, '0')}`;

    employeePerformance.push({
      id: makeUuid('72000000', perfCounter++),
      employee_id: emp.id,
      project_id: proj.id,
      week_start_date: weekStart,
      delivery_score: delivery,
      quality_score: quality,
      completion_status: delivery >= 0.85 ? 'COMPLETED' : 'DELAYED',
      created_at: `${weekStart} 18:00:00`
    });
  }
});

// ============================================================================
// 10. MANAGER FEEDBACK (40+ records)
// ============================================================================
const managerFeedback = [];
let feedbackCounter = 1;

employees.forEach((emp, i) => {
  if (emp.coldStart || emp.role === 'MANAGER') return;
  const reviewer = i % 2 === 0 ? employees[0].name : employees[1].name;
  const rating = emp.name === 'Sarah Jenkins' || emp.name === 'Viktor Meyer' ? 4.9 : randFloat(3.9, 4.8, 1);

  managerFeedback.push({
    id: makeUuid('c0000000', feedbackCounter++),
    employee_id: emp.id,
    project_id: projects[i % 4].id,
    manager_name: reviewer,
    rating,
    strengths: `${emp.name} demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.`,
    weaknesses: emp.name === 'Sarah Jenkins' ? 'High risk of fatigue due to concurrent critical-path commitments; requires pacing.' : 'Needs occasional encouragement to document design decisions early in sprint.',
    comments: `Excellent contributions to project milestones. Highly recommended for future core initiatives.`,
    created_at: '2026-09-30 16:00:00+00'
  });
});

// ============================================================================
// 11. DECISION WEIGHTS, DECISIONS, LOGS & FEEDBACK
// ============================================================================
const decisionWeights = [
  {
    // Reuses pre-existing live singleton row if present
    id: '29a9f570-7dd9-4dca-ad01-9ec7a3fc048f',
    fairness_weight: 0.25,
    performance_weight: 0.30,
    skill_weight: 0.35,
    knowledge_weight: 0.15,
    risk_weight: 0.10,
    updated_at: '2026-11-01 08:00:00'
  }
];

// Allocation Decisions (30 records)
const allocationDecisions = [];
let decCounter = 1;

for (let k = 0; k < 30; k++) {
  const emp = employees[(k * 3) % employees.length];
  const proj = projects[k % 4];
  const fairness = randFloat(0.75, 0.98);
  const perf = randFloat(0.80, 0.99);
  const finalScore = Number((0.25 * fairness + 0.30 * perf + 0.35 * randFloat(0.8, 1.0)).toFixed(2));

  allocationDecisions.push({
    id: makeUuid('d1000000', decCounter++),
    project_id: proj.id,
    employee_id: emp.id,
    week_start_date: '2026-03-02',
    fairness_score: fairness,
    performance_score: perf,
    final_score: finalScore,
    created_at: '2026-02-28 12:00:00'
  });
}

// Decision Logs (Transparent Explainability - Scenario 9)
const decisionLogs = [];
let logCounter = 1;

allocationDecisions.slice(0, 20).forEach((dec, i) => {
  const emp = employees.find(e => e.id === dec.employee_id) || employees[0];
  const proj = projects.find(p => p.id === dec.project_id) || projects[0];

  decisionLogs.push({
    id: makeUuid('a0000000', logCounter++),
    employee_id: dec.employee_id,
    project_id: dec.project_id,
    fairness: dec.fairness_score,
    performance: dec.performance_score,
    skillscore: randFloat(0.85, 0.99),
    risk_score: randFloat(0.05, 0.25),
    confidence: dec.final_score > 0.85 ? 'HIGH' : 'MEDIUM',
    final_score: dec.final_score,
    explanation: `Selected ${emp.name} for ${proj.name}. Skill proficiency matched 95% of demands with a balanced fairness coefficient of ${dec.fairness_score}. Workload distribution verified.`,
    created_at: '2026-02-28 12:05:00'
  });
});

// Decision Feedback (Closed loop outcomes)
const decisionFeedback = [];
let dfCounter = 1;

allocations.slice(0, 15).forEach(alloc => {
  const expected = randFloat(0.85, 0.95);
  const actual = randFloat(0.82, 0.97);
  const dev = Number((actual - expected).toFixed(2));

  decisionFeedback.push({
    id: makeUuid('d2000000', dfCounter++),
    employee_id: alloc.employee_id,
    project_id: alloc.project_id,
    allocation_id: alloc.id,
    outcome_score: actual,
    success: actual >= 0.80,
    actual_performance: actual,
    expected_performance: expected,
    deviation: dev,
    created_at: '2026-04-15 10:00:00'
  });
});

// ============================================================================
// 12. ALERTS (Scenarios 4, 6)
// ============================================================================
const alerts = [
  // Capacity Exceeded Alert: Sarah Jenkins
  {
    id: makeUuid('b0000000', 1),
    type: 'CAPACITY_EXCEEDED',
    severity: 'CRITICAL',
    message: 'Capacity exceeded: Sarah Jenkins is allocated 50h/40h (125% capacity) across Apollo Core Platform (30h) and Orion Design System (20h). High burnout probability (0.88).',
    employee_id: employees[3].id,
    project_id: projects[0].id,
    created_at: '2026-02-05 09:00:00'
  },
  // Capacity Exceeded Alert: Viktor Meyer
  {
    id: makeUuid('b0000000', 2),
    type: 'CAPACITY_EXCEEDED',
    severity: 'CRITICAL',
    message: 'Capacity exceeded: Viktor Meyer is allocated 50h/40h (125% capacity) across Apollo Core Platform (30h) and Nova Financial Ledger (20h). High fatigue risk (0.84).',
    employee_id: employees[24].id,
    project_id: projects[1].id,
    created_at: '2026-02-18 10:30:00'
  },
  // Staffing Gap Alert: Pulse IoT Telemetry (Scenario 6)
  {
    id: makeUuid('b0000000', 3),
    type: 'STAFFING_GAP',
    severity: 'WARNING',
    message: 'Staffing gap detected for project Pulse IoT Telemetry Pipeline: 2 unfilled slots for High-throughput Go/IoT Engineer. Recommend initiating external contracting.',
    employee_id: null,
    project_id: projects[4].id,
    created_at: '2026-10-22 14:15:00'
  },
  // Capacity Warning
  {
    id: makeUuid('b0000000', 4),
    type: 'CAPACITY_WARNING',
    severity: 'WARNING',
    message: 'Approaching capacity limit: Fatima Zahra is committed at 40h/40h (100% capacity) on Apollo NextGen Core Platform. Any additional shift will trigger overload.',
    employee_id: employees[25].id,
    project_id: projects[0].id,
    created_at: '2026-02-01 11:00:00'
  },
  // Burnout Risk Alert
  {
    id: makeUuid('b0000000', 5),
    type: 'BURNOUT_RISK',
    severity: 'CRITICAL',
    message: 'Predictive alert: Sarah Jenkins shows cognitive fatigue signal (burnout risk > 0.85) resulting from consecutive weeks with >45 hours logged.',
    employee_id: employees[3].id,
    project_id: projects[5].id,
    created_at: '2026-02-20 15:45:00'
  }
];

// ============================================================================
// BUILD EXHAUSTIVE SQL SCRIPT COMPLIANT WITH THE 21 LIVE TABLES
// ============================================================================
console.log('Assembling SQL statements strictly adhering to verified database schema...');

let sql = `-- ============================================================================
-- WORKFORCEIQ SYNTHETIC ENTERPRISE DATASET (APEXCORE TECHNOLOGIES)
-- ============================================================================
-- Reference Date: ${REFERENCE_DATE}
-- Random Seed: ${RANDOM_SEED}
-- Provenance: Fully synthetic dataset conforming 100% to live Supabase PostgreSQL schema
-- Target: 21 verified relational tables in exact foreign key dependency order
-- SAFETY NOTICE: Prepared for manual review / staging execution.
-- DO NOT APPLY TO REMOTE PRODUCTION WITHOUT EXPLICIT USER AUTHORIZATION.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. CANONICAL SKILLS (${skills.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO skills (id, name) VALUES
${skills.map(s => `  ('${s.id}', ${escapeSql(s.name)})`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- ----------------------------------------------------------------------------
-- 2. EMPLOYEES BASE DIRECTORY (${employees.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO employees (id, name, email, weekly_capacity_hours, efficiency_score, reliability_score, created_at) VALUES
${employees.map(e => `  ('${e.id}', ${escapeSql(e.name)}, ${escapeSql(e.email)}, ${e.weekly_capacity_hours}, ${e.efficiency_score}, ${e.reliability_score}, '${e.created_at}')`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  weekly_capacity_hours = EXCLUDED.weekly_capacity_hours,
  efficiency_score = EXCLUDED.efficiency_score,
  reliability_score = EXCLUDED.reliability_score;

-- ----------------------------------------------------------------------------
-- 3. EMPLOYEE AUTH & RBAC (${employeeAuth.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO employee_auth (employee_id, auth_user_id, role, is_active, created_at) VALUES
${employeeAuth.map(ea => `  ('${ea.employee_id}', '${ea.auth_user_id}', ${escapeSql(ea.role)}, ${ea.is_active}, '${ea.created_at}')`).join(',\n')}
ON CONFLICT (employee_id) DO UPDATE SET
  auth_user_id = EXCLUDED.auth_user_id,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- ----------------------------------------------------------------------------
-- 4. EMPLOYEE PROFILES (${employeeProfiles.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO employee_profiles (
  id, employee_id, technical_strength, leadership_score, communication_score,
  ownership_score, adaptability_score, learning_speed, collaboration_score,
  documentation_score, preferred_domains, risk_flags, profile_summary,
  profile_version, strengths, weaknesses, recommended_roles,
  training_recommendations, career_path, consistency_score, reliability_score,
  workload_tolerance, availability_score, generated_by, llm_version
) VALUES
${employeeProfiles.map(ep => `  (
    '${ep.id}', '${ep.employee_id}', ${ep.technical_strength}, ${ep.leadership_score}, ${ep.communication_score},
    ${ep.ownership_score}, ${ep.adaptability_score}, ${ep.learning_speed}, ${ep.collaboration_score},
    ${ep.documentation_score}, ${escapeArray(ep.preferred_domains)}, ${escapeArray(ep.risk_flags)}, ${escapeSql(ep.profile_summary)},
    ${ep.profile_version}, ${escapeArray(ep.strengths)}, ${escapeArray(ep.weaknesses)}, ${escapeArray(ep.recommended_roles)},
    ${escapeArray(ep.training_recommendations)}, ${escapeSql(ep.career_path)}, ${ep.consistency_score}, ${ep.reliability_score},
    ${ep.workload_tolerance}, ${ep.availability_score}, ${escapeSql(ep.generated_by)}, ${escapeSql(ep.llm_version)}
  )`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  technical_strength = EXCLUDED.technical_strength,
  leadership_score = EXCLUDED.leadership_score,
  communication_score = EXCLUDED.communication_score,
  ownership_score = EXCLUDED.ownership_score,
  adaptability_score = EXCLUDED.adaptability_score,
  learning_speed = EXCLUDED.learning_speed,
  collaboration_score = EXCLUDED.collaboration_score,
  documentation_score = EXCLUDED.documentation_score,
  preferred_domains = EXCLUDED.preferred_domains,
  risk_flags = EXCLUDED.risk_flags,
  profile_summary = EXCLUDED.profile_summary,
  strengths = EXCLUDED.strengths,
  weaknesses = EXCLUDED.weaknesses,
  recommended_roles = EXCLUDED.recommended_roles,
  training_recommendations = EXCLUDED.training_recommendations,
  career_path = EXCLUDED.career_path,
  consistency_score = EXCLUDED.consistency_score,
  reliability_score = EXCLUDED.reliability_score,
  workload_tolerance = EXCLUDED.workload_tolerance,
  availability_score = EXCLUDED.availability_score;

-- ----------------------------------------------------------------------------
-- 5. EMPLOYEE SKILLS MAPPINGS (${employeeSkills.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO employee_skills (employee_id, skill_id, proficiency_level) VALUES
${employeeSkills.map(es => `  ('${es.employee_id}', '${es.skill_id}', ${es.proficiency_level})`).join(',\n')}
ON CONFLICT (employee_id, skill_id) DO UPDATE SET
  proficiency_level = EXCLUDED.proficiency_level;

-- ----------------------------------------------------------------------------
-- 6. EMPLOYEE KNOWLEDGE VECTORS (${employeeKnowledge.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO employee_knowledge (
  id, employee_id, projects_completed, average_quality, average_delay,
  attendance_score, workload_score, performance_score, reliability_score,
  skill_vector, feedback_summary, knowledge_version
) VALUES
${employeeKnowledge.map(ek => `  (
    '${ek.id}', '${ek.employee_id}', ${ek.projects_completed}, ${ek.average_quality}, ${ek.average_delay},
    ${ek.attendance_score}, ${ek.workload_score}, ${ek.performance_score}, ${ek.reliability_score},
    ${escapeJson(ek.skill_vector)}, ${escapeSql(ek.feedback_summary)}, ${ek.knowledge_version}
  )`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  projects_completed = EXCLUDED.projects_completed,
  average_quality = EXCLUDED.average_quality,
  average_delay = EXCLUDED.average_delay,
  attendance_score = EXCLUDED.attendance_score,
  workload_score = EXCLUDED.workload_score,
  performance_score = EXCLUDED.performance_score,
  reliability_score = EXCLUDED.reliability_score,
  skill_vector = EXCLUDED.skill_vector,
  feedback_summary = EXCLUDED.feedback_summary;

-- ----------------------------------------------------------------------------
-- 7. ML INFERENCE PREDICTIONS (${mlPredictions.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO ml_predictions (
  id, employee_id, predicted_performance, predicted_completion_rate,
  burnout_probability, delivery_confidence, recommendation_score
) VALUES
${mlPredictions.map(mp => `  (
    '${mp.id}', '${mp.employee_id}', ${mp.predicted_performance}, ${mp.predicted_completion_rate},
    ${mp.burnout_probability}, ${mp.delivery_confidence}, ${mp.recommendation_score}
  )`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  predicted_performance = EXCLUDED.predicted_performance,
  predicted_completion_rate = EXCLUDED.predicted_completion_rate,
  burnout_probability = EXCLUDED.burnout_probability,
  delivery_confidence = EXCLUDED.delivery_confidence,
  recommendation_score = EXCLUDED.recommendation_score;

-- ----------------------------------------------------------------------------
-- 8. PROJECTS DIRECTORY (${projects.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO projects (id, name, project_priority, estimated_total_hours, start_date, end_date, status, created_at) VALUES
${projects.map(p => `  ('${p.id}', ${escapeSql(p.name)}, ${p.project_priority}, ${p.estimated_total_hours}, '${p.start_date}', '${p.end_date}', ${escapeSql(p.status)}, '${p.created_at}')`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  project_priority = EXCLUDED.project_priority,
  estimated_total_hours = EXCLUDED.estimated_total_hours,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  status = EXCLUDED.status;

-- ----------------------------------------------------------------------------
-- 9. PROJECT STAFFING REQUIREMENTS (${staffingRequirements.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO project_staffing_requirements (
  id, project_id, required_role, skill_id, minimum_proficiency,
  required_headcount, allocation_hours_per_week, allocation_percentage,
  is_mandatory, priority, created_at, updated_at
) VALUES
${staffingRequirements.map(sr => `  (
    '${sr.id}', '${sr.project_id}', ${escapeSql(sr.required_role)}, '${sr.skill_id}', ${sr.minimum_proficiency},
    ${sr.required_headcount}, ${sr.allocation_hours_per_week}, ${sr.allocation_percentage},
    ${sr.is_mandatory}, ${sr.priority}, '${sr.created_at}', '${sr.updated_at}'
  )`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  required_role = EXCLUDED.required_role,
  minimum_proficiency = EXCLUDED.minimum_proficiency,
  required_headcount = EXCLUDED.required_headcount,
  allocation_hours_per_week = EXCLUDED.allocation_hours_per_week,
  allocation_percentage = EXCLUDED.allocation_percentage,
  priority = EXCLUDED.priority;

-- ----------------------------------------------------------------------------
-- 10. PROJECT TASKS (${tasks.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO tasks (id, project_id, title, description, complexity, priority, estimated_hours, status, created_at) VALUES
${tasks.map(t => `  ('${t.id}', '${t.project_id}', ${escapeSql(t.title)}, ${escapeSql(t.description)}, ${t.complexity}, ${t.priority}, ${t.estimated_hours}, ${escapeSql(t.status)}, '${t.created_at}')`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  complexity = EXCLUDED.complexity,
  priority = EXCLUDED.priority,
  estimated_hours = EXCLUDED.estimated_hours,
  status = EXCLUDED.status;

-- ----------------------------------------------------------------------------
-- 11. TASK EXECUTION HISTORY (${taskHistory.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO task_history (id, task_id, employee_id, estimated_hours, actual_hours, quality_score, delay_days, completed_on, created_at) VALUES
${taskHistory.map(th => `  ('${th.id}', '${th.task_id}', '${th.employee_id}', ${th.estimated_hours}, ${th.actual_hours}, ${th.quality_score}, ${th.delay_days}, '${th.completed_on}', '${th.created_at}')`).join(',\n')}
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 12. ALLOCATION PROPOSALS (${proposals.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO allocation_proposals (
  id, project_id, requested_by, status, requested_team_size, selected_headcount,
  proposal_summary, staffing_gap_summary, decision_weight_version,
  model_version_summary, explanation, reviewed_at, reviewed_by, review_comment,
  created_at, updated_at
) VALUES
${proposals.map(pr => `  (
    '${pr.id}', '${pr.project_id}', '${pr.requested_by}', ${escapeSql(pr.status)}, ${pr.requested_team_size}, ${pr.selected_headcount},
    ${escapeJson(pr.proposal_summary)}, ${escapeJson(pr.staffing_gap_summary)}, ${escapeSql(pr.decision_weight_version)},
    ${escapeJson(pr.model_version_summary)}, ${escapeSql(pr.explanation)}, ${pr.reviewed_at ? `'${pr.reviewed_at}'` : 'NULL'},
    ${pr.reviewed_by ? `'${pr.reviewed_by}'` : 'NULL'}, ${escapeSql(pr.review_comment)}, '${pr.created_at}', '${pr.updated_at}'
  )`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  selected_headcount = EXCLUDED.selected_headcount,
  proposal_summary = EXCLUDED.proposal_summary,
  staffing_gap_summary = EXCLUDED.staffing_gap_summary,
  explanation = EXCLUDED.explanation,
  reviewed_at = EXCLUDED.reviewed_at,
  reviewed_by = EXCLUDED.reviewed_by,
  review_comment = EXCLUDED.review_comment;

-- ----------------------------------------------------------------------------
-- 13. ALLOCATION PROPOSAL MEMBERS (${proposalMembers.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO allocation_proposal_members (
  id, proposal_id, employee_id, staffing_requirement_id, proposed_role,
  allocated_hours_per_week, allocation_percentage, eligibility_status,
  constraint_snapshot, score_breakdown, skill_match_score, predicted_performance,
  predicted_completion_hours, burnout_risk_probability, fairness_adjustment,
  final_score, availability_status, explanation, created_at
) VALUES
${proposalMembers.map(pm => `  (
    '${pm.id}', '${pm.proposal_id}', '${pm.employee_id}', ${pm.staffing_requirement_id ? `'${pm.staffing_requirement_id}'` : 'NULL'},
    ${escapeSql(pm.proposed_role)}, ${pm.allocated_hours_per_week}, ${pm.allocation_percentage}, ${escapeSql(pm.eligibility_status)},
    ${escapeJson(pm.constraint_snapshot)}, ${escapeJson(pm.score_breakdown)}, ${pm.skill_match_score}, ${pm.predicted_performance},
    ${pm.predicted_completion_hours}, ${pm.burnout_risk_probability}, ${pm.fairness_adjustment},
    ${pm.final_score}, ${escapeSql(pm.availability_status)}, ${escapeSql(pm.explanation)}, '${pm.created_at}'
  )`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  eligibility_status = EXCLUDED.eligibility_status,
  final_score = EXCLUDED.final_score,
  availability_status = EXCLUDED.availability_status;

-- ----------------------------------------------------------------------------
-- 14. ACTIVE & COMPLETED ALLOCATIONS (${allocations.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO allocations (
  id, employee_id, project_id, week_start_date, allocated_hours, status,
  proposal_id, proposal_member_id, staffing_requirement_id, assigned_role,
  allocated_hours_per_week, allocation_percentage, start_date, planned_end_date,
  actual_end_date, released_at, created_at
) VALUES
${allocations.map(a => `  (
    '${a.id}', '${a.employee_id}', '${a.project_id}', '${a.week_start_date}', ${a.allocated_hours}, ${escapeSql(a.status)},
    ${a.proposal_id ? `'${a.proposal_id}'` : 'NULL'}, ${a.proposal_member_id ? `'${a.proposal_member_id}'` : 'NULL'},
    ${a.staffing_requirement_id ? `'${a.staffing_requirement_id}'` : 'NULL'}, ${escapeSql(a.assigned_role)},
    ${a.allocated_hours_per_week}, ${a.allocation_percentage}, ${a.start_date ? `'${a.start_date}'` : 'NULL'},
    ${a.planned_end_date ? `'${a.planned_end_date}'` : 'NULL'}, ${a.actual_end_date ? `'${a.actual_end_date}'` : 'NULL'},
    ${a.released_at ? `'${a.released_at}'` : 'NULL'}, '${a.created_at}'
  )`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  allocated_hours = EXCLUDED.allocated_hours,
  allocated_hours_per_week = EXCLUDED.allocated_hours_per_week,
  status = EXCLUDED.status,
  actual_end_date = EXCLUDED.actual_end_date,
  released_at = EXCLUDED.released_at;

-- ----------------------------------------------------------------------------
-- 15. EMPLOYEE WEEKLY PERFORMANCE (${employeePerformance.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO employee_performance (id, employee_id, project_id, week_start_date, delivery_score, quality_score, completion_status, created_at) VALUES
${employeePerformance.map(ep => `  ('${ep.id}', '${ep.employee_id}', '${ep.project_id}', '${ep.week_start_date}', ${ep.delivery_score}, ${ep.quality_score}, ${escapeSql(ep.completion_status)}, '${ep.created_at}')`).join(',\n')}
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 16. MANAGER FEEDBACK REVIEWS (${managerFeedback.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO manager_feedback (id, employee_id, project_id, manager_name, rating, strengths, weaknesses, comments, created_at) VALUES
${managerFeedback.map(mf => `  ('${mf.id}', '${mf.employee_id}', '${mf.project_id}', ${escapeSql(mf.manager_name)}, ${mf.rating}, ${escapeSql(mf.strengths)}, ${escapeSql(mf.weaknesses)}, ${escapeSql(mf.comments)}, '${mf.created_at}')`).join(',\n')}
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 17. DECISION POLICY WEIGHTS (${decisionWeights.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO decision_weights (id, fairness_weight, performance_weight, skill_weight, knowledge_weight, risk_weight, updated_at) VALUES
${decisionWeights.map(dw => `  ('${dw.id}', ${dw.fairness_weight}, ${dw.performance_weight}, ${dw.skill_weight}, ${dw.knowledge_weight}, ${dw.risk_weight}, '${dw.updated_at}')`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  fairness_weight = EXCLUDED.fairness_weight,
  performance_weight = EXCLUDED.performance_weight,
  skill_weight = EXCLUDED.skill_weight,
  knowledge_weight = EXCLUDED.knowledge_weight,
  risk_weight = EXCLUDED.risk_weight,
  updated_at = EXCLUDED.updated_at;

-- ----------------------------------------------------------------------------
-- 18. ALLOCATION DECISIONS (${allocationDecisions.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO allocation_decisions (id, project_id, employee_id, week_start_date, fairness_score, performance_score, final_score, created_at) VALUES
${allocationDecisions.map(ad => `  ('${ad.id}', '${ad.project_id}', '${ad.employee_id}', '${ad.week_start_date}', ${ad.fairness_score}, ${ad.performance_score}, ${ad.final_score}, '${ad.created_at}')`).join(',\n')}
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 19. DECISION EXPLAINABILITY LOGS (${decisionLogs.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO decision_logs (id, employee_id, project_id, fairness, performance, skillscore, risk_score, confidence, final_score, explanation, created_at) VALUES
${decisionLogs.map(dl => `  ('${dl.id}', '${dl.employee_id}', '${dl.project_id}', ${dl.fairness}, ${dl.performance}, ${dl.skillscore}, ${dl.risk_score}, ${escapeSql(dl.confidence)}, ${dl.final_score}, ${escapeSql(dl.explanation)}, '${dl.created_at}')`).join(',\n')}
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 20. CLOSED-LOOP DECISION FEEDBACK (${decisionFeedback.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO decision_feedback (id, employee_id, project_id, allocation_id, outcome_score, success, actual_performance, expected_performance, deviation, created_at) VALUES
${decisionFeedback.map(df => `  ('${df.id}', '${df.employee_id}', '${df.project_id}', '${df.allocation_id}', ${df.outcome_score}, ${df.success}, ${df.actual_performance}, ${df.expected_performance}, ${df.deviation}, '${df.created_at}')`).join(',\n')}
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 21. OPERATIONAL & CAPACITY ALERTS (${alerts.length} records)
-- ----------------------------------------------------------------------------
INSERT INTO alerts (id, type, message, severity, employee_id, project_id, created_at) VALUES
${alerts.map(al => `  ('${al.id}', ${escapeSql(al.type)}, ${escapeSql(al.message)}, ${escapeSql(al.severity)}, ${al.employee_id ? `'${al.employee_id}'` : 'NULL'}, ${al.project_id ? `'${al.project_id}'` : 'NULL'}, '${al.created_at}')`).join(',\n')}
ON CONFLICT (id) DO NOTHING;

COMMIT;
`;

fs.writeFileSync(OUTPUT_SQL_PATH, sql, 'utf8');
console.log(`Generated ${OUTPUT_SQL_PATH} successfully.`);

// ============================================================================
// MANIFEST & METRICS RECORD
// ============================================================================
const manifest = {
  manifest_version: '2.0.0',
  dataset_name: 'WorkforceIQ Synthetic Enterprise Dataset (ApexCore Technologies)',
  generated_at: new Date().toISOString(),
  reference_date: REFERENCE_DATE,
  random_seed: RANDOM_SEED,
  compliance: {
    total_tables_covered: 21,
    foreign_keys_satisfied: 33,
    email_rfc_reserved: '@workforce.example',
    execution_safety: 'Script output strictly written to local synthetic_seed.sql without executing remote mutations'
  },
  record_counts: {
    skills: skills.length,
    employees: employees.length,
    employee_auth: employeeAuth.length,
    employee_profiles: employeeProfiles.length,
    employee_skills: employeeSkills.length,
    employee_knowledge: employeeKnowledge.length,
    ml_predictions: mlPredictions.length,
    projects: projects.length,
    project_staffing_requirements: staffingRequirements.length,
    tasks: tasks.length,
    task_history: taskHistory.length,
    allocation_proposals: proposals.length,
    allocation_proposal_members: proposalMembers.length,
    allocations: allocations.length,
    employee_performance: employeePerformance.length,
    manager_feedback: managerFeedback.length,
    decision_weights: decisionWeights.length,
    allocation_decisions: allocationDecisions.length,
    decision_logs: decisionLogs.length,
    decision_feedback: decisionFeedback.length,
    alerts: alerts.length
  },
  demonstration_scenarios: [
    { scenario: 'Scenario 1: Ideal Candidate Match', employee: 'Devansh Sharma', project: 'Apollo NextGen Core Platform', outcome: 'Score 0.95, 100% capacity available, verified Go/K8s expertise' },
    { scenario: 'Scenario 2: Low Proficiency Rejection', employee: 'Lucas Silva', project: 'Sentinel Fraud Detector', outcome: 'Rejection score 0.24 due to missing PyTorch requirement' },
    { scenario: 'Scenario 3: Capacity Constraint Enforcement', employee: 'Sarah Jenkins', project: 'Nova Financial Ledger', outcome: 'Blocked from 3rd project due to current 50h/week overallocation' },
    { scenario: 'Scenario 4: Deliberate Over-Allocation & Burnout Alert', employee: 'Sarah Jenkins & Viktor Meyer', project: 'Apollo + Orion / Apollo + Nova', outcome: 'Active CRITICAL CAPACITY_EXCEEDED and BURNOUT_RISK alerts generated' },
    { scenario: 'Scenario 5: Cold-Start Handling', employee: 'Lucas Silva', project: 'Apollo Onboarding', outcome: 'Zero completed tasks handled gracefully via default prior distributions' },
    { scenario: 'Scenario 6: Staffing Gap Detection', employee: 'External Recruiting', project: 'Pulse IoT Telemetry Pipeline', outcome: 'Active STAFFING_GAP alert generated for missing IoT Go engineers' },
    { scenario: 'Scenario 7: Multi-Member Proposal Sign-off', employee: 'Elena Rostova (Reviewer)', project: 'Apollo Core Proposal', outcome: 'Approved 4-member proposal with attached audit commentary' },
    { scenario: 'Scenario 8: Project Release & Offboarding', employee: "Christian Bale, Liam O'Connor", project: 'Aegis Security Gateway', outcome: 'Status WORK_COMPLETED, released_at timestamp populated, capacity replenished' },
    { scenario: 'Scenario 9: Explainable Decision Audit Trail', employee: 'Multi-engineer audit', project: 'Multiple', outcome: 'Full formula breakdown preserved across fairness, skill, perf, and risk' }
  ]
};

fs.writeFileSync(OUTPUT_MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Generated ${OUTPUT_MANIFEST_PATH} successfully.`);
console.log('Record counts summary:');
console.log(JSON.stringify(manifest.record_counts, null, 2));
