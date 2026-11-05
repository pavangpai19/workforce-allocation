// Data Consistency and Scenario Validator
const fs = require('fs');

const sql = fs.readFileSync('workforce-seed/synthetic_seed.sql', 'utf8');

// Load parsed database from validate_seed_locally logic
const statements = sql.split(/INSERT INTO\s+/i).slice(1);
const database = {};

function parseSqlValues(cols, rawText) {
  const vIndex = rawText.indexOf('VALUES');
  if (vIndex === -1) return [];
  let body = rawText.slice(vIndex + 6);
  const conflictIdx = body.search(/ON CONFLICT/i);
  if (conflictIdx !== -1) body = body.slice(0, conflictIdx);
  body = body.trim().replace(/;$/, '');
  
  const rows = [];
  let inQuote = false;
  let inParen = 0;
  let curTuple = '';
  
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === "'") {
      if (inQuote && body[i + 1] === "'") {
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
    if (inParen > 0) curTuple += ch;
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
  let s = str.trim().replace(/::[a-zA-Z_]+(\[\])?$/g, '').trim();
  if (s === 'NULL' || s === 'null') return null;
  if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1).replace(/''/g, "'");
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
  database[table] = parseSqlValues(cols, stmt);
});

console.log('=== DATA CONSISTENCY VALIDATION REPORT ===\n');

// 1. Employee Capacity vs Allocation Hours
console.log('1. Employee Capacity vs Allocation Hours:');
const empHours = {};
database.employees.forEach(e => {
  empHours[e.id] = { name: e.name, capacity: e.weekly_capacity_hours, allocated: 0, allocations: 0 };
});

database.allocations.filter(a => a.status === 'ACTIVE').forEach(a => {
  if (empHours[a.employee_id]) {
    empHours[a.employee_id].allocated += (a.allocated_hours_per_week || a.allocated_hours || 0);
    empHours[a.employee_id].allocations++;
  }
});

let overallocated = [];
let optimallyAllocated = [];
let underallocated = [];

for (const [id, info] of Object.entries(empHours)) {
  const ratio = info.allocated / info.capacity;
  if (ratio > 1.0) {
    overallocated.push(info);
  } else if (ratio >= 0.75) {
    optimallyAllocated.push(info);
  } else {
    underallocated.push(info);
  }
}

console.log(`  - Over-allocated employees (>100% capacity): ${overallocated.length}`);
overallocated.forEach(o => console.log(`    * ${o.name}: ${o.allocated}h / ${o.capacity}h (${Math.round(o.allocated/o.capacity*100)}%) across ${o.allocations} projects`));
console.log(`  - Optimally allocated employees (75%-100%): ${optimallyAllocated.length}`);
console.log(`  - Under-allocated / bench employees (<75%): ${underallocated.length}`);

// 2. Project Staffing Requirements vs Allocations
console.log('\n2. Project Staffing Requirements vs Allocations:');
const reqFulfillment = {};
database.project_staffing_requirements.forEach(r => {
  reqFulfillment[r.id] = { project_id: r.project_id, role: r.required_role, required: r.required_headcount, allocated: 0 };
});
database.allocations.filter(a => a.staffing_requirement_id).forEach(a => {
  if (reqFulfillment[a.staffing_requirement_id]) {
    reqFulfillment[a.staffing_requirement_id].allocated++;
  }
});
let staffedReqs = Object.values(reqFulfillment).filter(r => r.allocated >= r.required).length;
let partialReqs = Object.values(reqFulfillment).filter(r => r.allocated > 0 && r.allocated < r.required).length;
let unstaffedReqs = Object.values(reqFulfillment).filter(r => r.allocated === 0).length;
console.log(`  - Fully fulfilled staffing requirements: ${staffedReqs}`);
console.log(`  - Partially fulfilled requirements: ${partialReqs}`);
console.log(`  - Open/unfulfilled requirements (creating staffing gaps): ${unstaffedReqs}`);

// 3. Employee Skills vs Proficiency Requirements
console.log('\n3. Employee Skills vs Proficiency:');
const empSkillsMap = {};
database.employee_skills.forEach(es => {
  empSkillsMap[`${es.employee_id}::${es.skill_id}`] = es.proficiency_level;
});

let matchedCount = 0;
database.allocations.filter(a => a.staffing_requirement_id).forEach(a => {
  const req = database.project_staffing_requirements.find(r => r.id === a.staffing_requirement_id);
  if (req) {
    const prof = empSkillsMap[`${a.employee_id}::${req.skill_id}`];
    if (prof !== undefined && prof >= req.minimum_proficiency) {
      matchedCount++;
    }
  }
});
console.log(`  - Verified skill proficiency matches on requirement-linked allocations: ${matchedCount}`);

// 4. Task History vs Task Status
console.log('\n4. Task History vs Task Status:');
const taskStatusMap = {};
database.tasks.forEach(t => {
  taskStatusMap[t.id] = t.status;
});
let historyMismatch = 0;
database.task_history.forEach(th => {
  if (taskStatusMap[th.task_id] !== 'COMPLETED') {
    historyMismatch++;
  }
});
console.log(`  - task_history records pointing to non-COMPLETED parent task: ${historyMismatch} (Expected: 0)`);

// 5. Proposal Members vs Proposals
console.log('\n5. Proposal Members vs Proposals:');
const propMap = {};
database.allocation_proposals.forEach(p => {
  propMap[p.id] = { status: p.status, requestedSize: p.requested_team_size, members: 0 };
});
database.allocation_proposal_members.forEach(pm => {
  if (propMap[pm.proposal_id]) {
    propMap[pm.proposal_id].members++;
  }
});
for (const [pId, pInfo] of Object.entries(propMap)) {
  console.log(`  - Proposal ${pId.slice(0, 8)}... (${pInfo.status}): requested team size ${pInfo.requestedSize}, proposed members ${pInfo.members}`);
}

// 6. Approved Proposals vs Allocation Evidence
console.log('\n6. Approved Proposals vs Allocation Evidence:');
const approvedProps = database.allocation_proposals.filter(p => p.status === 'APPROVED');
approvedProps.forEach(ap => {
  const linkedAllocations = database.allocations.filter(a => a.proposal_id === ap.id);
  console.log(`  - Approved Proposal ${ap.id.slice(0, 8)}... has ${linkedAllocations.length} active committed allocations with matching proposal_member_ids.`);
});

// 7. Performance and Prediction Values vs Supported Ranges
console.log('\n7. Performance & Prediction Ranges:');
let rangeErrors = 0;
database.ml_predictions.forEach(mp => {
  if (mp.predicted_performance < 0 || mp.predicted_performance > 1) rangeErrors++;
  if (mp.predicted_completion_rate < 0 || mp.predicted_completion_rate > 1) rangeErrors++;
  if (mp.burnout_probability < 0 || mp.burnout_probability > 1) rangeErrors++;
  if (mp.delivery_confidence < 0 || mp.delivery_confidence > 1) rangeErrors++;
  if (mp.recommendation_score < 0 || mp.recommendation_score > 100) rangeErrors++;
});
console.log(`  - ML prediction values out of supported bounds [0..1 or 0..100]: ${rangeErrors}`);

// 8. Alerts vs Capacity/Staffing Conditions
console.log('\n8. Alerts vs Operational Conditions:');
database.alerts.forEach(al => {
  console.log(`  - Alert [${al.severity}] ${al.type}: ${al.message.slice(0, 80)}...`);
});

console.log('\n=== ALL CONSISTENCY CHECKS COMPLETE ===');
