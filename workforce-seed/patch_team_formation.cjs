const fs = require('fs');
const path = require('path');

const fullPath = path.resolve(__dirname, '../work-allocation-engine/src/allocations/team-formation/team-formation.service.ts');
let content = fs.readFileSync(fullPath, 'utf8');

// 1. Fix line 94
content = content.replace(
  "select('id, name, current_workload_hours, max_capacity_hours, weekly_capacity_hours')",
  "select('id, name, weekly_capacity_hours')"
);

// 2. Fix lines 243-248 in getProposal
content = content.replace(
  /employees \(\r?\n\s+id,\r?\n\s+name,\r?\n\s+role,\r?\n\s+department\r?\n\s+\)/,
  `employees (\n            id,\n            name,\n            email,\n            weekly_capacity_hours\n          )`
);

fs.writeFileSync(fullPath, content, 'utf8');
console.log('team-formation.service.ts patched successfully');

