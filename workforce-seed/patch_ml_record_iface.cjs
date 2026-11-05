const fs = require('fs');
const path = require('path');

const fullPath = path.resolve(__dirname, '../work-allocation-engine/src/allocations/team-formation/team-formation.service.ts');
let content = fs.readFileSync(fullPath, 'utf8');

content = content.replace(
  /export interface MLPredictionRecord \{[\s\S]*?\}/,
  `export interface MLPredictionRecord {
  employee_id: string;
  predicted_performance?: number;
  burnout_probability?: number;
  delivery_confidence?: number;
  recommendation_score?: number;
}`
);

fs.writeFileSync(fullPath, content, 'utf8');
console.log('MLPredictionRecord interface updated successfully');

