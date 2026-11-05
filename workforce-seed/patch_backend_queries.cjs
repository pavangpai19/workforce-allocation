const fs = require('fs');
const path = require('path');

function patchFile(filePath, transforms) {
  const fullPath = path.resolve(__dirname, '..', filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let count = 0;
  for (const [search, replace] of transforms) {
    if (content.includes(search)) {
      content = content.replace(search, replace);
      count++;
    } else {
      console.warn(`[WARN] Search text not found in ${filePath}:\n${search.slice(0, 60)}...`);
    }
  }
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`[OK] Patched ${filePath} (${count} replacements)`);
}

// 1. Patch proposals.service.ts
patchFile('work-allocation-engine/src/allocations/proposals/proposals.service.ts', [
  [
    `        employees (
          id,
          name,
          role,
          department,
          weekly_capacity_hours
        ),`,
    `        employees (
          id,
          name,
          email,
          weekly_capacity_hours
        ),`
  ],
  [
    'employees (id, name, role)',
    'employees (id, name, email)'
  ],
  [
    'employees (id, name, role)',
    'employees (id, name, email)'
  ],
  [
    `        // Record decision log & audit
        await supabase.from('allocation_decisions').insert([
          {
            allocation_id: committedAlloc.id,
            employee_id: member.employee_id,
            project_id: proposal.project_id,
            fairness_score: member.fairness_adjustment ?? 0.85,
            performance_score: member.predicted_performance ?? 0.9,
            skill_score: member.skill_match_score ?? 1.0,
            knowledge_score: 0.9,
            risk_score: member.burnout_risk_probability ?? 0.1,
            confidence: 0.95,
            final_score: member.final_score ?? 0.9,
            explanation:
              member.explanation ||
              \`Approved allocation for \${member.proposed_role} under proposal \${proposal.id}.\`,
          },
        ]);`,
    `        // Record decision log & audit in both allocation_decisions and decision_logs
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
        ]);`
  ]
]);

// 2. Patch alerts.service.ts
patchFile('work-allocation-engine/src/alerts/alerts.service.ts', [
  ['employees (id, name, email, role),', 'employees (id, name, email),'],
  ['employees (id, name, email, role),', 'employees (id, name, email),'],
  ['employees (id, name, email, role),', 'employees (id, name, email),']
]);

// 3. Patch decision-logs.service.ts
patchFile('work-allocation-engine/src/decision/decision-logs.service.ts', [
  ['employees (id, name, email, role),', 'employees (id, name, email),'],
  ['employees (id, name, email, role),', 'employees (id, name, email),'],
  ['employees (id, name, email, role, department),', 'employees (id, name, email),']
]);

// 4. Patch analytics.service.ts
patchFile('work-allocation-engine/src/analytics/analytics.service.ts', [
  [
    `        employees (
          id,
          name,
          email,
          role,
          department,
          current_workload_hours,
          weekly_capacity_hours
        )`,
    `        employees (
          id,
          name,
          email,
          weekly_capacity_hours,
          efficiency_score,
          reliability_score
        )`
  ]
]);

