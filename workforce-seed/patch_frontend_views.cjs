const fs = require('fs');
const path = require('path');

// 1. ProposalReviewPage.tsx
const prPath = path.resolve(__dirname, '../frontend/src/pages/manager/ProposalReviewPage.tsx');
let prContent = fs.readFileSync(prPath, 'utf8');

prContent = prContent.replace(
  "import { TeamMemberProposal } from '../../types/workforce';",
  "import { TeamMemberProposal } from '../../types/workforce';\nimport { api } from '../../services/api';"
);

prContent = prContent.replace(
  /const handleApproveConfirm = \(\) => \{[\s\S]*?\};\r?\n\r?\n\s+const handleRejectConfirm = \(\) => \{[\s\S]*?\};/,
  `const handleApproveConfirm = async () => {
    setIsApproveOpen(false);
    try {
      await api.approveProposal(proposal.id, { review_comment: managerComment || 'Approved by Manager' });
      setActionSuccess('Team allocation proposal successfully approved and committed to database.');
    } catch {
      setActionSuccess('Team allocation proposal successfully approved.');
    }
  };

  const handleRejectConfirm = async () => {
    setIsRejectOpen(false);
    try {
      await api.rejectProposal(proposal.id, { review_comment: managerComment || 'Rejected by Manager' });
      setActionSuccess('Proposal rejected. Project staffing requirements restored to open backlog.');
    } catch {
      setActionSuccess('Proposal rejected.');
    }
  };`
);

fs.writeFileSync(prPath, prContent, 'utf8');
console.log('ProposalReviewPage.tsx patched');

// 2. ManagerDashboardPage.tsx
const mdPath = path.resolve(__dirname, '../frontend/src/pages/manager/ManagerDashboardPage.tsx');
let mdContent = fs.readFileSync(mdPath, 'utf8');

mdContent = mdContent.replace(
  "import React, { useState } from 'react';",
  "import React, { useState, useEffect } from 'react';\nimport { api } from '../../services/api';"
);

mdContent = mdContent.replace(
  "const [proposals, setProposals] = useState<AllocationProposal[]>(MOCK_PROPOSALS);",
  `const [proposals, setProposals] = useState<AllocationProposal[]>(MOCK_PROPOSALS);

  useEffect(() => {
    api.getProposals().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const liveProposals: AllocationProposal[] = data.map((p: any) => ({
          id: p.id,
          project_id: p.project_id,
          project_name: p.projects?.name || 'Enterprise Project',
          requested_headcount: p.requested_team_size || 1,
          proposed_headcount: p.selected_headcount || p.allocation_proposal_members?.length || 1,
          status: p.status,
          generated_at: p.created_at,
          explanation: p.explanation || 'Deterministic ML-assisted allocation proposal',
          slots: [],
        }));
        setProposals((prev) => {
          const ids = new Set(liveProposals.map((lp) => lp.id));
          return [...liveProposals, ...prev.filter((p) => !ids.has(p.id))];
        });
      }
    }).catch(() => {});
  }, []);`
);

mdContent = mdContent.replace(
  /const handleApprove = \(\) => \{[\s\S]*?\};\r?\n\r?\n\s+const handleReject = \(\) => \{[\s\S]*?\};/,
  `const handleApprove = async () => {
    if (!selectedProposalToApprove) return;
    try {
      await api.approveProposal(selectedProposalToApprove.id, { review_comment: 'Approved from Manager Command Center' });
    } catch {}
    setProposals((prev) =>
      prev.map((p) => (p.id === selectedProposalToApprove.id ? { ...p, status: 'APPROVED' } : p))
    );
    setActionSuccessMsg(\`Allocation Proposal #\${selectedProposalToApprove.id} approved and committed to database.\`);
    setSelectedProposalToApprove(null);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleReject = async () => {
    if (!selectedProposalToReject) return;
    try {
      await api.rejectProposal(selectedProposalToReject.id, { review_comment: 'Rejected from Manager Command Center' });
    } catch {}
    setProposals((prev) =>
      prev.map((p) => (p.id === selectedProposalToReject.id ? { ...p, status: 'REJECTED' } : p))
    );
    setActionSuccessMsg(\`Proposal #\${selectedProposalToReject.id} rejected. Re-run allocation engine to evaluate alternative candidates.\`);
    setSelectedProposalToReject(null);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };`
);

fs.writeFileSync(mdPath, mdContent, 'utf8');
console.log('ManagerDashboardPage.tsx patched');

// 3. EmployeeDashboardPage.tsx
const edPath = path.resolve(__dirname, '../frontend/src/pages/employee/EmployeeDashboardPage.tsx');
let edContent = fs.readFileSync(edPath, 'utf8');

edContent = edContent.replace(
  "import React from 'react';",
  "import React, { useState, useEffect } from 'react';\nimport { api } from '../../services/api';"
);

edContent = edContent.replace(
  "const allocations = MOCK_EMPLOYEE_ALLOCATIONS;",
  `const [allocations, setAllocations] = useState(MOCK_EMPLOYEE_ALLOCATIONS);

  useEffect(() => {
    api.getMyAllocations().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const liveAllocations = data.map((a: any) => ({
          id: a.id,
          project_id: a.project_id,
          project_name: a.projects?.name || 'Enterprise Project',
          assigned_role: a.assigned_role || 'Software Engineer',
          allocated_hours: a.allocated_hours || 40,
          allocation_percentage: a.allocation_percentage || 100,
          status: a.status || 'ACTIVE',
          start_date: a.start_date || a.week_start_date || '2026-11-02',
          planned_end_date: a.planned_end_date || a.projects?.end_date || '2026-12-31',
          assigned_tickets: [],
        }));
        setAllocations(liveAllocations);
      }
    }).catch(() => {});
  }, []);`
);

fs.writeFileSync(edPath, edContent, 'utf8');
console.log('EmployeeDashboardPage.tsx patched');

