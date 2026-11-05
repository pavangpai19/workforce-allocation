const fs = require('fs');
const path = require('path');

const fullPath = path.resolve(__dirname, '../work-allocation-engine/src/allocations/team-formation/team-formation.service.ts');
let content = fs.readFileSync(fullPath, 'utf8');

// 1. Fix employee_skills select
content = content.replace(
  "select('employee_id, skill_id, proficiency, proficiency_level')",
  "select('employee_id, skill_id, proficiency_level')"
);

// 2. Fix ml_predictions select
content = content.replace(
  "select('employee_id, predicted_performance, performance_score, burnout_risk_probability, risk_score')",
  "select('employee_id, predicted_performance, burnout_probability, delivery_confidence')"
);

// 3. Fix burnoutRisk and predictedPerformance lookup
content = content.replace(
  "const burnoutRisk = Number(ml?.burnout_risk_probability ?? ml?.risk_score ?? 0.1);",
  "const burnoutRisk = Number(ml?.burnout_probability ?? 0.15);"
);
content = content.replace(
  "const predictedPerformance = Number(ml?.predicted_performance ?? ml?.performance_score ?? 0.5);",
  "const predictedPerformance = Number(ml?.predicted_performance ?? 0.88);"
);

// 4. In membersToInsert, add burnout_risk_probability
content = content.replace(
  "skill_match_score: c.skill_match_score,\n      predicted_performance: c.predicted_performance,\n      fairness_adjustment: c.fairness_adjustment,",
  "skill_match_score: c.skill_match_score,\n      predicted_performance: c.predicted_performance,\n      burnout_risk_probability: c.constraint_snapshot?.burnout_risk_probability ?? 0.15,\n      fairness_adjustment: c.fairness_adjustment,"
);

fs.writeFileSync(fullPath, content, 'utf8');
console.log('team-formation.service.ts patched with live DB columns');

