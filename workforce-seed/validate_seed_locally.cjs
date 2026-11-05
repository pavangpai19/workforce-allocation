// Robust Validation script for synthetic_seed.sql
const fs = require('fs');

const schema = JSON.parse(fs.readFileSync('schema_definitions.json', 'utf8'));
const fks = JSON.parse(fs.readFileSync('foreign_keys.json', 'utf8'));
const sql = fs.readFileSync('workforce-seed/synthetic_seed.sql', 'utf8');

console.log('=== STARTING DEEP SQL STRUCTURAL & REFERENTIAL VALIDATION ===');

// Clean and parse SQL statements
// We split statements by INSERT INTO
const statements = sql.split(/INSERT INTO\s+/i).slice(1);
const database = {};
let totalRows = 0;

function parseSqlValues(cols, rawText) {
  // Find where VALUES starts
  const vIndex = rawText.indexOf('VALUES');
  if (vIndex === -1) return [];
  
  // Cut off ON CONFLICT or trailing semicolon
  let body = rawText.slice(vIndex + 6);
  const conflictIdx = body.search(/ON CONFLICT/i);
  if (conflictIdx !== -1) body = body.slice(0, conflictIdx);
  body = body.trim().replace(/;$/, '');
  
  // Scan tuples
  const rows = [];
  let inQuote = false;
  let inParen = 0;
  let curTuple = '';
  
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    
    if (ch === "'") {
      if (inQuote && body[i + 1] === "'") {
        // Escaped quote in SQL
        curTuple += "''";
        i++;
        continue;
      }
      inQuote = !inQuote;
      curTuple += ch;
      continue;
    }
    
    if (!inQuote) {
      if (ch === '(') {
        inParen++;
        if (inParen === 1) {
          curTuple = '';
          continue;
        }
      } else if (ch === ')') {
        inParen--;
        if (inParen === 0) {
          rows.push(parseTupleRow(cols, curTuple));
          curTuple = '';
          continue;
        }
      }
    }
    
    if (inParen > 0) {
      curTuple += ch;
    }
  }
  return rows;
}

function parseTupleRow(cols, tupleStr) {
  const vals = [];
  let inQuote = false;
  let inArray = 0;
  let inBrace = 0;
  let cur = '';
  
  for (let i = 0; i < tupleStr.length; i++) {
    const ch = tupleStr[i];
    
    if (ch === "'") {
      if (inQuote && tupleStr[i + 1] === "'") {
        cur += "'";
        i++;
        continue;
      }
      inQuote = !inQuote;
      cur += ch;
      continue;
    }
    
    if (!inQuote) {
      if (ch === '{') inBrace++;
      else if (ch === '}') inBrace--;
      else if (ch === '[') inArray++;
      else if (ch === ']') inArray--;
      
      if (ch === ',' && inBrace === 0 && inArray === 0) {
        vals.push(cleanVal(cur));
        cur = '';
        continue;
      }
    }
    cur += ch;
  }
  vals.push(cleanVal(cur));
  
  const row = {};
  cols.forEach((col, idx) => {
    row[col] = idx < vals.length ? vals[idx] : null;
  });
  return row;
}

function cleanVal(str) {
  let s = str.trim();
  // Remove cast suffix like ::jsonb, ::text[]
  s = s.replace(/::[a-zA-Z_]+(\[\])?$/g, '').trim();
  if (s === 'NULL' || s === 'null') return null;
  if (s.startsWith("'") && s.endsWith("'")) {
    return s.slice(1, -1).replace(/''/g, "'");
  }
  if (!isNaN(s) && s !== '') return Number(s);
  if (s === 'true') return true;
  if (s === 'false') return false;
  return s;
}

statements.forEach(stmt => {
  const headerMatch = stmt.match(/^([a-zA-Z_]+)\s*\(([\s\S]*?)\)\s*VALUES/i);
  if (!headerMatch) return;
  const table = headerMatch[1].trim();
  const cols = headerMatch[2].split(',').map(c => c.trim().replace(/\s+/g, ' '));
  
  const rows = parseSqlValues(cols, stmt);
  if (!database[table]) database[table] = [];
  database[table].push(...rows);
  totalRows += rows.length;
});

console.log('Parsed tables and row counts:');
for (const [tbl, rows] of Object.entries(database)) {
  console.log('  ' + tbl.padEnd(32) + ': ' + rows.length);
}
console.log('Total parsed rows: ' + totalRows);

// Step 2: Referential Integrity Validation
console.log('\n--- VALIDATING 33 FOREIGN KEY CONSTRAINTS ---');
let fkErrors = [];

fks.forEach((fk, idx) => {
  const fromTable = fk.fromTable;
  const fromCol = fk.fromColumn;
  const toTable = fk.toTable;
  const toCol = fk.toColumn;
  
  const fromRows = database[fromTable] || [];
  const toRows = database[toTable] || [];
  
  const targetSet = new Set(toRows.map(r => String(r[toCol])).filter(v => v !== null && v !== 'null' && v !== undefined));
  
  let violations = 0;
  fromRows.forEach((r, rowIdx) => {
    const val = r[fromCol];
    if (val === null || val === 'NULL' || val === undefined) {
      return;
    }
    const valStr = String(val);
    if (!targetSet.has(valStr)) {
      violations++;
      fkErrors.push({
        fk: `${fromTable}.${fromCol} -> ${toTable}.${toCol}`,
        rowIdx,
        missingValue: valStr
      });
    }
  });
  
  const status = violations === 0 ? 'PASS' : 'FAIL';
  console.log(`[${status}] FK ${idx+1}: ${fromTable}.${fromCol} -> ${toTable}.${toCol} (Checked ${fromRows.length} rows, ${violations} missing)`);
});

// Step 3: Composite and Primary Key Uniqueness
console.log('\n--- VALIDATING PRIMARY & UNIQUE CONSTRAINTS ---');
const pkSpecs = {
  skills: ['id'],
  employees: ['id'],
  employee_auth: ['employee_id'],
  employee_profiles: ['id'],
  employee_skills: ['employee_id', 'skill_id'],
  employee_knowledge: ['id'],
  ml_predictions: ['id'],
  projects: ['id'],
  project_staffing_requirements: ['id'],
  tasks: ['id'],
  task_history: ['id'],
  allocation_proposals: ['id'],
  allocation_proposal_members: ['id'],
  allocations: ['id'],
  employee_performance: ['id'],
  manager_feedback: ['id'],
  decision_weights: ['id'],
  allocation_decisions: ['id'],
  decision_logs: ['id'],
  decision_feedback: ['id'],
  alerts: ['id']
};

let pkErrors = [];
for (const [tbl, cols] of Object.entries(pkSpecs)) {
  const rows = database[tbl] || [];
  const seen = new Set();
  let duplicates = 0;
  
  rows.forEach(r => {
    const key = cols.map(c => String(r[c])).join('::');
    if (seen.has(key)) {
      duplicates++;
      pkErrors.push({ table: tbl, key });
    }
    seen.add(key);
  });
  
  const status = duplicates === 0 ? 'PASS' : 'FAIL';
  console.log(`[${status}] PK ${tbl} (${cols.join(', ')}): ${rows.length} rows, ${duplicates} duplicates`);
}

const propMemberRows = database['allocation_proposal_members'] || [];
const propMemberSeen = new Set();
let propMemberDups = 0;
propMemberRows.forEach(r => {
  const key = `${r.proposal_id}::${r.employee_id}`;
  if (propMemberSeen.has(key)) propMemberDups++;
  propMemberSeen.add(key);
});
console.log(`[${propMemberDups === 0 ? 'PASS' : 'FAIL'}] UNIQUE allocation_proposal_members(proposal_id, employee_id): ${propMemberDups} duplicates`);

// Step 4: Status and Check Constraints
console.log('\n--- VALIDATING CHECK CONSTRAINTS & STATUS ENUMS ---');
let checkErrors = [];

// 1. allocation_proposals.status
const validProposalStatuses = ['DRAFT', 'GENERATING', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'PARTIALLY_COMMITTED', 'EXPIRED', 'FAILED'];
(database['allocation_proposals'] || []).forEach(r => {
  if (!validProposalStatuses.includes(r.status)) {
    checkErrors.push(`allocation_proposals.status invalid value: '${r.status}' in row id=${r.id}. Allowed: ${validProposalStatuses.join(', ')}`);
  }
});

// 2. allocation_proposal_members.availability_status
const validAvailabilityStatuses = ['AVAILABLE_NOW', 'AVAILABLE_AFTER_RELEASE_CONFIRMATION', 'ACTIVE_UNFINISHED_WORK', 'UNAVAILABLE', 'ON_LEAVE', 'CAPACITY_CONSTRAINED'];
(database['allocation_proposal_members'] || []).forEach(r => {
  if (!validAvailabilityStatuses.includes(r.availability_status)) {
    checkErrors.push(`allocation_proposal_members.availability_status invalid value: '${r.availability_status}' in row id=${r.id}`);
  }
});

// 3. allocations.status
const validAllocationStatuses = ['ACTIVE', 'WORK_COMPLETED', 'AWAITING_REVIEW', 'AWAITING_RELEASE_CONFIRMATION', 'RELEASED', 'COMPLETED', 'CANCELLED', 'PROPOSED'];
(database['allocations'] || []).forEach(r => {
  if (r.status && !validAllocationStatuses.includes(r.status)) {
    checkErrors.push(`allocations.status invalid value: '${r.status}' in row id=${r.id}`);
  }
});

// 4. employee_skills.proficiency_level between 1 and 5
(database['employee_skills'] || []).forEach(r => {
  if (r.proficiency_level < 1 || r.proficiency_level > 5) {
    checkErrors.push(`employee_skills.proficiency_level out of range (1..5): ${r.proficiency_level}`);
  }
});

// 5. project_staffing_requirements minimum_proficiency & headcount
(database['project_staffing_requirements'] || []).forEach(r => {
  if (r.minimum_proficiency < 1 || r.minimum_proficiency > 5) {
    checkErrors.push(`project_staffing_requirements minimum_proficiency out of range: ${r.minimum_proficiency}`);
  }
  if (r.required_headcount <= 0) {
    checkErrors.push(`project_staffing_requirements required_headcount <= 0: ${r.required_headcount}`);
  }
});

// 6. projects.project_priority between 1 and 5
(database['projects'] || []).forEach(r => {
  if (r.project_priority < 1 || r.project_priority > 5) {
    checkErrors.push(`projects.project_priority out of range: ${r.project_priority}`);
  }
});

if (checkErrors.length === 0) {
  console.log('[PASS] All CHECK constraints and enums are 100% compliant!');
} else {
  console.log(`[FAIL] Found ${checkErrors.length} check constraint violations:`);
  checkErrors.forEach(e => console.log('  - ' + e));
}

// Summary
console.log('\n=== VALIDATION SUMMARY ===');
console.log(`FK Errors: ${fkErrors.length}`);
console.log(`PK Errors: ${pkErrors.length}`);
console.log(`Check Constraint Errors: ${checkErrors.length}`);
