const fs = require('fs');
const path = require('path');

const fullPath = path.resolve(__dirname, '../work-allocation-engine/src/allocations/auto-allocation/auto-allocation.service.ts');
let content = fs.readFileSync(fullPath, 'utf8');

content = content.replace(
  "const level = Number(row.proficiency_level ?? row.proficiency ?? 3);",
  "const level = Number(row.proficiency_level ?? 3);"
);

fs.writeFileSync(fullPath, content, 'utf8');
console.log('Line 160 fixed in auto-allocation.service.ts');

