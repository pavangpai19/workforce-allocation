const fs = require('fs');
const path = require('path');

const fullPath = path.resolve(__dirname, '../work-allocation-engine/src/allocations/team-formation/team-formation.service.ts');
let content = fs.readFileSync(fullPath, 'utf8');

// Replace Step 5 loop to maintain assignedEmployeeIds set for uq_proposal_employee
const oldStep5 = `    // Step 5: Score and rank candidates for each staffing requirement
    const allCandidates: CandidateScore[] = [];
    let totalRequiredHeadcount = 0;

    for (const req of requirements) {
      const neededHeadcount = Number(req.required_headcount || 1);
      totalRequiredHeadcount += neededHeadcount;

      const candidates = this.scoreCandidatesForRequirement(
        req,
        employees,
        employeeSkills || [],
        mlMap,
        maxCandidatesPerRole,
        includeFairness,
      );

      allCandidates.push(...candidates);
    }`;

const newStep5 = `    // Step 5: Score and rank candidates for each staffing requirement (guaranteeing uq_proposal_employee)
    const allCandidates: CandidateScore[] = [];
    const assignedEmployeeIds = new Set<string>();
    let totalRequiredHeadcount = 0;

    for (const req of requirements) {
      const neededHeadcount = Number(req.required_headcount || 1);
      totalRequiredHeadcount += neededHeadcount;

      const candidates = this.scoreCandidatesForRequirement(
        req,
        employees.filter((e) => !assignedEmployeeIds.has(e.id)),
        employeeSkills || [],
        mlMap,
        maxCandidatesPerRole,
        includeFairness,
      );

      for (const cand of candidates) {
        if (!assignedEmployeeIds.has(cand.employee_id)) {
          assignedEmployeeIds.add(cand.employee_id);
          allCandidates.push(cand);
          if (allCandidates.filter(c => c.staffing_requirement_id === req.id).length >= neededHeadcount) {
            break;
          }
        }
      }
    }`;

content = content.replace(
  /\/\/ Step 5: Score and rank candidates for each staffing requirement[\s\S]*?allCandidates\.push\(\.\.\.candidates\);\r?\n\s+\}/,
  newStep5
);

fs.writeFileSync(fullPath, content, 'utf8');
console.log('team-formation.service.ts updated with unique employee selection');

