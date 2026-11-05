const fs = require('fs');
const path = require('path');

const fullPath = path.resolve(__dirname, '../work-allocation-engine/src/allocations/proposals/proposals.service.ts');
let content = fs.readFileSync(fullPath, 'utf8');

// Replace lines 43-46 (role, department)
content = content.replace(
  /employees \(\r?\n\s+id,\r?\n\s+name,\r?\n\s+role,\r?\n\s+department,\r?\n\s+weekly_capacity_hours\r?\n\s+\)/,
  `employees (\n          id,\n          name,\n          email,\n          weekly_capacity_hours\n        )`
);

// Replace allocation_decisions insert
const searchBlockRegex = /\/\/ Record decision log & audit[\s\S]*?await supabase\.from\('allocation_decisions'\)\.insert\(\[[\s\S]*?\]\);/;

const replacementBlock = `// Record decision log & audit in both allocation_decisions and decision_logs
        await supabase.from('allocation_decisions').insert([
          {
            project_id: proposal.project_id,
            employee_id: member.employee_id,
            week_start_date: committedAlloc.week_start_date,
            fairness_score: member.fairness_adjustment ?? 0.85,
            performance_score: member.predicted_performance ?? 0.9,
            final_score: member.final_score ?? 0.9,
          },
        ]);

        await supabase.from('decision_logs').insert([
          {
            project_id: proposal.project_id,
            employee_id: member.employee_id,
            fairness: member.fairness_adjustment ?? 0.85,
            performance: member.predicted_performance ?? 0.9,
            skillscore: member.skill_match_score ?? 1.0,
            risk_score: member.burnout_risk_probability ?? 0.1,
            confidence: 0.95,
            final_score: member.final_score ?? 0.9,
            explanation:
              member.explanation ||
              \`Approved allocation for \${member.proposed_role} under proposal \${proposal.id}.\`,
          },
        ]);`;

if (searchBlockRegex.test(content)) {
  content = content.replace(searchBlockRegex, replacementBlock);
  console.log('[OK] Successfully replaced allocation_decisions block');
} else {
  console.warn('[WARN] searchBlockRegex did not match');
}

fs.writeFileSync(fullPath, content, 'utf8');
console.log('[OK] proposals.service.ts regex patch complete');

