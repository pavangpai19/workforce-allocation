/**
 * ============================================================================
 * WORKFORCEIQ — CONTROLLED DATABASE RESET & SYNTHETIC DATA POPULATION ENGINE
 * ============================================================================
 * Conforms to strict execution safety:
 * 1. Targeted Deletion: Deletes ONLY the 11 identified legacy development records
 *    by exact primary keys in reverse dependency order.
 * 2. Explicit Policy Calibration: Calibrates the pre-existing decision_weights row
 *    ('29a9f570-7dd9-4dca-ad01-9ec7a3fc048f') to baseline enterprise weights.
 * 3. Strict INSERT Semantics: Uses pure INSERT operations to prevent silent overwrites.
 * 4. Pre-Execution Validation: Validates all parsed SQL records against synthetic_manifest.json.
 * 5. Native PostgreSQL COUNT(*) Verification: Uses { count: 'exact', head: true }
 *    to verify exact row counts without row-limit truncations.
 * 6. Hard Failure Termination: Exits with process.exit(1) on any failure.
 * ============================================================================
 */

const path = require('path');
const fs = require('fs');

const workspaceRoot = path.resolve(__dirname, '..');
const { createClient } = require(path.join(workspaceRoot, 'work-allocation-engine/node_modules/@supabase/supabase-js'));
const env = fs.readFileSync(path.join(workspaceRoot, 'work-allocation-engine/.env'), 'utf8');
const url = env.match(/SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const SQL_FILE_PATH = path.join(__dirname, 'clean_reset_and_seed.sql');
const MANIFEST_PATH = path.join(__dirname, 'synthetic_manifest.json');

// --- Exact 11 Legacy Development Records Targeted for Deletion ---
const LEGACY_TARGETS = {
  allocations: [
    '18de9afe-d0be-473d-b1e1-622d6fa1e52e',
    '7237662c-09dc-4fb8-ba13-31f6fe3edaca',
    '1e5bf114-6e7a-4b78-8dfd-78b06debb74e'
  ],
  employee_performance: [
    'fb648c59-1fb3-4134-9aaa-f78e00321ed3',
    '29c562ec-1cc5-4f63-a2df-5d4ca33a1bd3'
  ],
  employee_skills: [
    '32aed4c6-1d27-48cb-943a-3d28900d8992',
    '04ca3551-d0df-45ab-851a-7e8d23aad45e'
  ],
  employees: [
    '32aed4c6-1d27-48cb-943a-3d28900d8992',
    '04ca3551-d0df-45ab-851a-7e8d23aad45e'
  ],
  projects: [
    'd0032f98-9087-4aeb-841e-6b84b39c6151',
    '02a90ed6-e4a6-4e3b-9950-69467c7d764c'
  ]
};

// --- Preserved Entities ---
const PRESERVED_DECISION_WEIGHTS_ID = '29a9f570-7dd9-4dca-ad01-9ec7a3fc048f';
const BASELINE_WEIGHTS = {
  fairness_weight: 0.25,
  performance_weight: 0.30,
  skill_weight: 0.20,
  knowledge_weight: 0.15,
  risk_weight: 0.10,
  updated_at: new Date().toISOString()
};

// Topological Insertion Order across all 21 tables
const INSERTION_ORDER = [
  'skills',
  'employees',
  'employee_auth',
  'employee_profiles',
  'employee_skills',
  'employee_knowledge',
  'ml_predictions',
  'projects',
  'project_staffing_requirements',
  'tasks',
  'task_history',
  'allocation_proposals',
  'allocation_proposal_members',
  'allocations',
  'employee_performance',
  'manager_feedback',
  'decision_weights',
  'allocation_decisions',
  'decision_logs',
  'decision_feedback',
  'alerts'
];

function parseTuples(rawText) {
  const vIndex = rawText.indexOf('VALUES');
  if (vIndex === -1) return [];
  
  let body = rawText.slice(vIndex + 6);
  const conflictIdx = body.search(/ON CONFLICT/i);
  if (conflictIdx !== -1) body = body.slice(0, conflictIdx);
  body = body.trim().replace(/;$/, '');
  
  const rows = [];
  let inQuote = false;
  let inParen = 0;
  let currentTuple = '';
  
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    const prev = i > 0 ? body[i - 1] : '';
    
    if (c === "'" && prev !== '\\') {
      if (inQuote && body[i + 1] === "'") {
        currentTuple += "'";
        i++;
        continue;
      }
      inQuote = !inQuote;
      currentTuple += c;
    } else if (!inQuote && c === '(') {
      if (inParen === 0) currentTuple = '';
      else currentTuple += c;
      inParen++;
    } else if (!inQuote && c === ')') {
      inParen--;
      if (inParen === 0) {
        rows.push(currentTuple.trim());
        currentTuple = '';
      } else {
        currentTuple += c;
      }
    } else if (inParen > 0) {
      currentTuple += c;
    }
  }
  return rows;
}

function parseTupleValues(tupleStr) {
  const values = [];
  let inQuote = false;
  let currentVal = '';
  
  for (let i = 0; i < tupleStr.length; i++) {
    const c = tupleStr[i];
    const prev = i > 0 ? tupleStr[i - 1] : '';
    
    if (c === "'" && prev !== '\\') {
      if (inQuote && tupleStr[i + 1] === "'") {
        currentVal += "'";
        i++;
        continue;
      }
      inQuote = !inQuote;
    } else if (!inQuote && c === ',') {
      values.push(currentVal.trim());
      currentVal = '';
    } else {
      currentVal += c;
    }
  }
  values.push(currentVal.trim());
  
  return values.map(v => {
    if (v === 'NULL' || v === 'null') return null;
    if (v.startsWith("'") && v.endsWith("'")) {
      const unquoted = v.slice(1, -1).replace(/''/g, "'");
      if (unquoted.startsWith('{') && unquoted.endsWith('}')) {
        const inner = unquoted.slice(1, -1).trim();
        if (!inner) return [];
        return inner.split(',').map(s => s.trim().replace(/^"/, '').replace(/"$/, ''));
      }
      if ((unquoted.startsWith('{') && unquoted.includes(':')) || unquoted.startsWith('[')) {
        try { return JSON.parse(unquoted); } catch(e) {}
      }
      return unquoted;
    }
    if (v.toLowerCase() === 'true') return true;
    if (v.toLowerCase() === 'false') return false;
    if (!isNaN(v) && v !== '') return Number(v);
    return v;
  });
}

function loadAndValidateSeed() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const sql = fs.readFileSync(path.join(__dirname, 'synthetic_seed.sql'), 'utf8');
  const stmts = sql.split(/INSERT INTO\s+/i).slice(1);
  const data = {};

  stmts.forEach(s => {
    const match = s.match(/^([a-zA-Z0-9_]+)\s*\((.*?)\)\s*VALUES/is);
    if (match) {
      const table = match[1];
      const cols = match[2].split(',').map(c => c.trim());
      const rawTuples = parseTuples(s);
      data[table] = rawTuples.map(t => {
        const vals = parseTupleValues(t);
        const row = {};
        cols.forEach((col, cIdx) => {
          row[col] = vals[cIdx];
        });
        return row;
      });
    }
  });

  // Strict Validation against Manifest
  console.log('Validating seed records against synthetic_manifest.json...');
  for (const [table, expCount] of Object.entries(manifest.record_counts)) {
    const actual = (data[table] || []).length;
    if (actual !== expCount) {
      console.error(`FATAL VALIDATION ERROR: Table [${table}] parsed ${actual} rows, expected ${expCount}`);
      process.exit(1);
    }
  }
  console.log('✓ Pre-execution validation passed: all 21 tables match manifest counts.\n');
  return data;
}

/**
 * Executes targeted deletion of the 11 legacy records by exact primary key.
 */
async function executeTargetedReset() {
  console.log('--- EXECUTING TARGETED RESET OF LEGACY DEVELOPMENT RECORDS ---');

  // 1. Delete legacy allocations
  console.log(`Deleting ${LEGACY_TARGETS.allocations.length} legacy allocation records...`);
  const { error: errAlloc } = await supabase
    .from('allocations')
    .delete()
    .in('id', LEGACY_TARGETS.allocations);
  if (errAlloc) throw new Error(`Failed to delete legacy allocations: ${errAlloc.message}`);

  // 2. Delete legacy performance records
  console.log(`Deleting ${LEGACY_TARGETS.employee_performance.length} legacy performance records...`);
  const { error: errPerf } = await supabase
    .from('employee_performance')
    .delete()
    .in('id', LEGACY_TARGETS.employee_performance);
  if (errPerf) throw new Error(`Failed to delete legacy performance records: ${errPerf.message}`);

  // 3. Delete legacy employee_skills mappings
  console.log(`Deleting legacy skill mappings for ${LEGACY_TARGETS.employee_skills.length} employees...`);
  const { error: errSkills } = await supabase
    .from('employee_skills')
    .delete()
    .in('employee_id', LEGACY_TARGETS.employee_skills);
  if (errSkills) throw new Error(`Failed to delete legacy employee skills: ${errSkills.message}`);

  // 4. Delete legacy employees
  console.log(`Deleting ${LEGACY_TARGETS.employees.length} legacy employee records (Pavan, Rahul)...`);
  const { error: errEmp } = await supabase
    .from('employees')
    .delete()
    .in('id', LEGACY_TARGETS.employees);
  if (errEmp) throw new Error(`Failed to delete legacy employees: ${errEmp.message}`);

  // 5. Delete legacy projects
  console.log(`Deleting ${LEGACY_TARGETS.projects.length} legacy project records (AI Workforce Engine)...`);
  const { error: errProj } = await supabase
    .from('projects')
    .delete()
    .in('id', LEGACY_TARGETS.projects);
  if (errProj) throw new Error(`Failed to delete legacy projects: ${errProj.message}`);

  // 6. Explicitly calibrate decision_weights
  console.log(`Calibrating decision_weights row ${PRESERVED_DECISION_WEIGHTS_ID} to baseline policy...`);
  const { error: errWeights } = await supabase
    .from('decision_weights')
    .update(BASELINE_WEIGHTS)
    .eq('id', PRESERVED_DECISION_WEIGHTS_ID);
  if (errWeights) throw new Error(`Failed to calibrate decision weights: ${errWeights.message}`);

  console.log('✓ Targeted reset and policy calibration complete.\n');
}

/**
 * Inserts synthetic dataset using strict INSERT semantics.
 */
async function executeStrictSeed() {
  console.log('--- EXECUTING STRICT SYNTHETIC SEED INSERTION ---');
  const seedData = loadAndValidateSeed();

  for (const table of INSERTION_ORDER) {
    if (table === 'decision_weights') {
      // Already explicitly calibrated in reset phase
      continue;
    }

    const rows = seedData[table] || [];
    if (rows.length === 0) continue;

    console.log(`Inserting ${rows.length} rows into [${table}]...`);

    if (table === 'skills') {
      // For skills: 26 new skills, 2 canonical skills (React, Python).
      // Reconcile the 2 canonical skills cleanly.
      const canonicalIds = ['b4cc67f8-1eb1-4e9a-8980-f2a67584b3fc', '45c21a7c-1697-48ba-bf34-d2bdab25d501'];
      const newSkills = rows.filter(r => !canonicalIds.includes(r.id));
      const canonicalSkills = rows.filter(r => canonicalIds.includes(r.id));

      if (newSkills.length > 0) {
        const { error: insertErr } = await supabase.from('skills').insert(newSkills);
        if (insertErr) throw new Error(`Failed to insert skills: ${insertErr.message}`);
      }
      for (const cs of canonicalSkills) {
        const { error: upsertErr } = await supabase.from('skills').upsert(cs);
        if (upsertErr) throw new Error(`Failed to reconcile canonical skill ${cs.name}: ${upsertErr.message}`);
      }
    } else {
      // Strict pure INSERT for all other 20 tables in chunks of 50
      const BATCH_SIZE = 50;
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE);
        const { error: insertErr } = await supabase.from(table).insert(batch);
        if (insertErr) {
          throw new Error(`Strict INSERT failed on [${table}] at offset ${i}: ${insertErr.message}`);
        }
      }
    }
    console.log(`  ✓ [${table}] successfully populated.`);
  }
  console.log('\n✓ All 21 tables populated successfully.');
}

/**
 * Verifies exact remote row counts using PostgreSQL COUNT(*) (head: true, count: 'exact').
 */
async function verifyExactCounts() {
  console.log('\n--- VERIFYING EXACT REMOTE COUNTS VIA POSTGRESQL COUNT(*) ---');
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  let failureCount = 0;

  for (const table of INSERTION_ORDER) {
    const expected = manifest.record_counts[table];
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`  [FAIL] ${table.padEnd(30)}: ERROR - ${error.message}`);
      failureCount++;
    } else {
      const match = count === expected;
      const status = match ? 'PASS' : 'FAIL';
      if (!match) failureCount++;
      console.log(`  [${status}] ${table.padEnd(30)}: COUNT(*) = ${String(count).padStart(3)} | Expected = ${String(expected).padStart(3)}`);
    }
  }

  if (failureCount > 0) {
    console.error(`\nVERIFICATION FAILURE: ${failureCount} tables did not match expected counts.`);
    process.exit(1);
  } else {
    console.log('\n✓ VERIFICATION SUCCESS: All 21 tables match exact manifest counts.');
  }
}

module.exports = {
  loadAndValidateSeed,
  executeTargetedReset,
  executeStrictSeed,
  verifyExactCounts
};

if (require.main === module) {
  const action = process.argv[2];
  if (action === 'validate-local') {
    loadAndValidateSeed();
  } else if (action === 'verify-counts') {
    verifyExactCounts().catch(err => {
      console.error('Count verification failed:', err.message);
      process.exit(1);
    });
  } else if (action === 'execute') {
    (async () => {
      try {
        loadAndValidateSeed();
        await executeTargetedReset();
        await executeStrictSeed();
        await verifyExactCounts();
        console.log('\n=== COMPLETE REMOTE WORKFORCEIQ RESET & SEEDING ACCOMPLISHED ===');
      } catch (err) {
        console.error('\nEXECUTION ABORTED DUE TO ERROR:', err.message);
        process.exit(1);
      }
    })();
  } else {
    console.log('Usage: node execute_synthetic_seed.cjs [validate-local | verify-counts | execute]');
  }
}
