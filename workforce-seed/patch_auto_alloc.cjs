const fs = require('fs');
const path = require('path');

const fullPath = path.resolve(__dirname, '../work-allocation-engine/src/allocations/auto-allocation/auto-allocation.service.ts');
let content = fs.readFileSync(fullPath, 'utf8');

content = content.replace(
  "select('employee_id, proficiency_level, proficiency')",
  "select('employee_id, proficiency_level')"
);

fs.writeFileSync(fullPath, content, 'utf8');
console.log('auto-allocation.service.ts patched successfully');

