import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Users,
  Sparkles,
  ArrowRight,
  Eye,
  RotateCcw,
  MessageSquare,
  AlertOctagon,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { CandidateDetailsDrawer } from '../../components/manager/CandidateDetailsDrawer';
import { MOCK_TEAM_PROPOSALS, MOCK_PROJECTS } from '../../data/mockData';
import { TeamMemberProposal } from '../../types/workforce';
import { api } from '../../services/api';

export const ProposalReviewPage: React.FC = () => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();
  const [managerComment, setManagerComment] = useState('');
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMemberProposal | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const proposal =
    MOCK_TEAM_PROPOSALS.find((p) => p.id === proposalId) || MOCK_TEAM_PROPOSALS[0];
  const project = MOCK_PROJECTS.find((p) => p.id === proposal.project_id) || MOCK_PROJECTS[0];

  const isInfeasible = proposal.status === 'NO_FEASIBLE_ALLOCATION';

  const handleApproveConfirm = async () => {
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
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title={`Allocation Proposal Review: ${proposal.project_name}`}
        description={`Proposal Reference: ${proposal.id} • Model: ${proposal.model_version}`}
        breadcrumbs={[
          { label: 'Manager Dashboard', path: '/manager/dashboard' },
          { label: 'Projects', path: '/manager/projects' },
          { label: proposal.project_name, path: `/manager/projects/${proposal.project_id}` },
          { label: 'Proposal Review' },
        ]}
        actions={
          <div className="flex items-center space-x-3">
            <Link
              to={`/manager/projects/${proposal.project_id}/allocation`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center space-x-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Inspect Allocation Engine</span>
            </Link>
          </div>
        }
      />

      {/* Success Notification */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 text-emerald-300 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Infeasible Allocation Screen */}
      {isInfeasible ? (
        <div className="space-y-6">
          <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                <AlertOctagon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  No Feasible Multi-Person Team Allocation Found
                </h3>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  The deterministic decision engine evaluated all available candidates against hard constraints
                  (availability window, minimum proficiency, capacity ratio). No valid combination satisfied all {proposal.required_headcount} staffing slots.
                </p>
              </div>
            </div>

            {/* Infeasible Diagnostics */}
            {proposal.infeasible_details && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Required Team Size</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {proposal.infeasible_details.required_team_size} engineers
                  </span>
                </div>
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Eligible Candidates</span>
                  <span className="text-sm font-bold font-mono text-rose-400">
                    {proposal.infeasible_details.eligible_candidates_count} eligible
                  </span>
                </div>
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Capacity Shortage</span>
                  <span className="text-sm font-bold font-mono text-amber-400">
                    {proposal.infeasible_details.capacity_shortage_hours} hrs / week
                  </span>
                </div>
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Deadline Pressure</span>
                  <span className="text-sm font-bold font-mono text-rose-400">
                    {proposal.infeasible_details.deadline_pressure_level}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 7 Actionable Remediation Options */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Actionable Remediation Pathways (Manager Governance)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-white">1. Extend Project Delivery Window</h5>
                <p className="text-[11px] text-slate-400">
                  Shift deadline by 14 days to unlock engineers currently finalizing Q3 platform sprints.
                </p>
                <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg transition">
                  Shift Deadline +14 Days
                </button>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-white">2. Relax Proficiency Level Threshold</h5>
                <p className="text-[11px] text-slate-400">
                  Adjust PySpark slot requirement from Level 4 to Level 3, expanding candidate pool to 4 engineers.
                </p>
                <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg transition">
                  Set Min Proficiency: Level 3
                </button>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-white">3. Enable "Available After Release"</h5>
                <p className="text-[11px] text-slate-400">
                  Include engineers scheduled for release on Sept 12 (Amara Okafor) to satisfy SRE slot.
                </p>
                <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg transition">
                  Include Pending Releases
                </button>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-white">4. Rebalance Low-Priority Workloads</h5>
                <p className="text-[11px] text-slate-400">
                  De-allocate 15h/wk from non-critical maintenance projects to free staff bandwidth.
                </p>
                <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg transition">
                  Open Workload Rebalancer
                </button>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-white">5. Trigger External Hiring Requisition</h5>
                <p className="text-[11px] text-slate-400">
                  Dispatch automated requisition to talent operations for PySpark / SRE contractor staffing.
                </p>
                <button className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-semibold rounded-lg transition">
                  Export Contractor Req
                </button>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-white">6. Phased Milestone Execution</h5>
                <p className="text-[11px] text-slate-400">
                  Split project into Phase 1 (Data Prep) and Phase 2 (Optimization) to staff sequentially.
                </p>
                <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg transition">
                  Split Into Milestones
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Proposal Review */
        <div className="space-y-6">
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-semibold">Proposed Headcount</span>
              <div className="text-xl font-extrabold text-white font-mono mt-1">
                {proposal.proposed_headcount} / {proposal.required_headcount}
              </div>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">100% Slot Fulfillment</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-semibold">Team Composite Score</span>
              <div className="text-xl font-extrabold text-brand-400 font-mono mt-1">
                {(proposal.score_breakdown.composite_team_score * 100).toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Deterministic Weighted Avg</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-semibold">Average Fairness</span>
              <div className="text-xl font-extrabold text-cyan-400 font-mono mt-1">
                {(proposal.score_breakdown.average_fairness * 100).toFixed(0)}%
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Workload Equity Ratio</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-semibold">Avg Burnout Risk Signal</span>
              <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">
                {(proposal.score_breakdown.average_risk_penalty * 100).toFixed(0)}%
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Well Within Safety Limit (&lt;40%)</span>
            </div>
          </div>

          {/* Proposed Multi-Person Team Table */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Proposed Multi-Person Team Members</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review candidate allocations before confirming team formation.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Slot & Role</th>
                    <th className="pb-3 font-semibold">Assigned Engineer</th>
                    <th className="pb-3 font-semibold">Allocated Hours</th>
                    <th className="pb-3 font-semibold">Proficiency</th>
                    <th className="pb-3 font-semibold">ML Predicted Perf</th>
                    <th className="pb-3 font-semibold">Burnout Risk</th>
                    <th className="pb-3 font-semibold font-mono">Final Score</th>
                    <th className="pb-3 font-semibold text-right">Inspection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {proposal.proposed_team.map((member) => (
                    <tr key={member.slot_id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 font-semibold text-white">
                        <div>{member.slot_role}</div>
                        <div className="text-[11px] text-brand-400 font-mono">{member.slot_skill}</div>
                      </td>
                      <td className="py-3.5 font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-brand-600/50 flex items-center justify-center text-[10px] text-white font-bold">
                            {member.employee_name[0]}
                          </div>
                          <span>{member.employee_name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono">{member.allocated_hours}h / wk</td>
                      <td className="py-3.5 font-mono text-emerald-400">Level {member.skill_match_rating}/5</td>
                      <td className="py-3.5 font-mono text-indigo-400">
                        {(member.predicted_performance * 100).toFixed(0)}%
                      </td>
                      <td className="py-3.5 font-mono text-slate-300">
                        {(member.burnout_risk_score * 100).toFixed(0)}%
                      </td>
                      <td className="py-3.5 font-bold font-mono text-brand-400">
                        {(member.final_deterministic_score * 100).toFixed(1)}%
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setIsDrawerOpen(true);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Manager Decision Governance Box */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-bold text-white">Manager Governance Sign-Off</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">
                Manager Allocation Rationale / Comments (Logged to Audit Trail)
              </label>
              <textarea
                value={managerComment}
                onChange={(e) => setManagerComment(e.target.value)}
                placeholder="Enter justification or specific project context for this allocation..."
                rows={3}
                className="w-full p-3 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Approval will commit team member assignments and write to allocation_decisions log.</span>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => setIsRejectOpen(true)}
                  className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl text-xs font-semibold transition"
                >
                  Reject Proposal
                </button>
                <button
                  onClick={() => setIsApproveOpen(true)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-glow-emerald transition flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Team Allocation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApproveConfirm}
        title="Approve Team Allocation"
        message={`Confirm multi-person team allocation for "${proposal.project_name}". This will assign ${proposal.proposed_headcount} engineers to active project staffing slots.`}
        confirmLabel="Confirm & Commit Allocation"
        variant="primary"
      />

      <ConfirmationDialog
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleRejectConfirm}
        title="Reject Allocation Proposal"
        message="Are you sure you want to reject this team proposal? The staffing slots will return to the unallocated queue."
        confirmLabel="Reject Proposal"
        variant="danger"
      />

      {/* Candidate Drawer */}
      <CandidateDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        candidate={selectedMember}
      />
    </div>
  );
};
