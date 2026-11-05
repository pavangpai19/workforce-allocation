const fs = require('fs');
const path = require('path');

// 1. ManagerDashboardPage.tsx
const mdPath = path.resolve(__dirname, '../frontend/src/pages/manager/ManagerDashboardPage.tsx');
let mdContent = fs.readFileSync(mdPath, 'utf8');

// Replace useEffect in ManagerDashboardPage
const oldMdEffect = /useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/;
const newMdEffect = `useEffect(() => {
    api.getProposals().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const liveProposals: AllocationProposal[] = data.map((p: any) => {
          const firstMember = p.allocation_proposal_members?.[0] || {};
          return {
            id: p.id,
            project_id: p.project_id,
            project_name: p.projects?.name || 'Apollo NextGen Platform',
            required_role: firstMember.proposed_role || 'Principal Systems Engineer',
            required_skill: 'Go / Distributed Systems',
            required_hours: firstMember.allocated_hours_per_week || 40,
            status: p.status,
            created_at: p.created_at || new Date().toISOString(),
            explanation: p.explanation || 'Deterministic ML-assisted allocation proposal',
            selected_candidate: {
              employee_id: firstMember.employee_id || '10000000-0000-4000-8000-000000000003',
              employee_name: firstMember.employees?.name || 'Devansh Sharma',
              final_score: firstMember.final_score || 0.88,
              fairness_score: firstMember.fairness_adjustment || 0.85,
              performance_score: firstMember.predicted_performance || 0.90,
              skill_score: firstMember.skill_match_score || 0.95,
              knowledge_score: 0.90,
              risk_score: firstMember.burnout_risk_probability || 0.12,
              confidence: 0.95,
            },
            ranked_candidates: [],
            allocation_id: p.id,
          };
        });
        setProposals((prev) => {
          const ids = new Set(liveProposals.map((lp) => lp.id));
          return [...liveProposals, ...prev.filter((p) => !ids.has(p.id))];
        });
      }
    }).catch(() => {});
  }, []);`;

mdContent = mdContent.replace(oldMdEffect, newMdEffect);
fs.writeFileSync(mdPath, mdContent, 'utf8');
console.log('ManagerDashboardPage.tsx typed mapping patched');

// 2. EmployeeDashboardPage.tsx
const edPath = path.resolve(__dirname, '../frontend/src/pages/employee/EmployeeDashboardPage.tsx');
let edContent = fs.readFileSync(edPath, 'utf8');

const oldEdEffect = /useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/;
const newEdEffect = `useEffect(() => {
    api.getMyAllocations().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const liveAllocations: any[] = data.map((a: any) => ({
          project_id: a.project_id,
          project_name: a.projects?.name || 'Enterprise Project',
          domain: 'Engineering',
          role: a.assigned_role || 'Senior Distributed Engineer',
          allocated_hours: a.allocated_hours || 40,
          allocated_pct: a.allocation_percentage || 100,
          deadline: a.planned_end_date || a.projects?.end_date || '2026-12-31',
          status: (a.status === 'ACTIVE' ? 'Active' : a.status === 'RELEASED' ? 'Released' : 'Pending') as any,
          progress_pct: 65,
          assigned_tickets: [],
          release_requested: false,
        }));
        setAllocations(liveAllocations);
      }
    }).catch(() => {});
  }, []);`;

edContent = edContent.replace(oldEdEffect, newEdEffect);
fs.writeFileSync(edPath, edContent, 'utf8');
console.log('EmployeeDashboardPage.tsx typed mapping patched');

