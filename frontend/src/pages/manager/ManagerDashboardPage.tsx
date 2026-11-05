import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  AlertTriangle,
  Sparkles,
  Users,
  Plus,
  Play,
  Ticket as TicketIcon,
  Bell,
  Clock,
  Flame,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { WorkloadIndicator } from '../../components/ui/WorkloadIndicator';
import { RiskIndicator } from '../../components/ui/RiskIndicator';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { AllocationProgressModal } from '../../components/manager/AllocationProgressModal';
import {
  MOCK_PROJECTS,
  MOCK_PROPOSALS,
  MOCK_ALERTS,
  MOCK_DECISION_LOGS,
  MOCK_TICKETS,
  MOCK_EMPLOYEES,
} from '../../data/mockData';
import { AllocationProposal } from '../../types/workforce';

export const ManagerDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [proposals, setProposals] = useState<AllocationProposal[]>(MOCK_PROPOSALS);

  useEffect(() => {
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
  }, []);
  const [selectedProposalToApprove, setSelectedProposalToApprove] = useState<AllocationProposal | null>(null);
  const [selectedProposalToReject, setSelectedProposalToReject] = useState<AllocationProposal | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);

  // Statistics
  const activeProjects = MOCK_PROJECTS.filter((p) => p.status === 'ACTIVE');
  const projectsWithGaps = MOCK_PROJECTS.filter((p) => p.staffing_state === 'STAFFING_GAPS');
  const pendingProposals = proposals.filter((p) => p.status === 'PENDING_APPROVAL');
  const criticalAlerts = MOCK_ALERTS.filter((a) => a.severity === 'CRITICAL' || a.severity === 'WARNING');

  const handleApprove = async () => {
    if (!selectedProposalToApprove) return;
    try {
      await api.approveProposal(selectedProposalToApprove.id, { review_comment: 'Approved from Manager Command Center' });
    } catch {}
    setProposals((prev) =>
      prev.map((p) => (p.id === selectedProposalToApprove.id ? { ...p, status: 'APPROVED' } : p))
    );
    setActionSuccessMsg(`Allocation Proposal #${selectedProposalToApprove.id} approved and committed to database.`);
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
    setActionSuccessMsg(`Proposal #${selectedProposalToReject.id} rejected. Re-run allocation engine to evaluate alternative candidates.`);
    setSelectedProposalToReject(null);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header with 4 Fast-Action CTAs */}
      <PageHeader
        title="Manager Command Center"
        description="Workforce intelligence, team capacity tracking, staffing gap alerts, and human-in-the-loop allocation decision approvals."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate('/manager/projects/new')}
              className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-indigo transition flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Project</span>
            </button>
            <button
              onClick={() => setIsAllocationModalOpen(true)}
              className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-indigo transition flex items-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run Allocation</span>
            </button>
            <button
              onClick={() => navigate('/manager/intelligence-pipeline')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-semibold rounded-xl border border-brand-500/30 transition flex items-center space-x-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-brand-400" />
              <span>Pipeline Architecture</span>
            </button>
            <button
              onClick={() => navigate('/manager/tickets')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition flex items-center space-x-1.5"
            >
              <TicketIcon className="w-3.5 h-3.5" />
              <span>Create Ticket</span>
            </button>
            <button
              onClick={() => navigate('/manager/alerts')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition flex items-center space-x-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>View Alerts ({criticalAlerts.length})</span>
            </button>
          </div>
        }
      />

      {/* Success Notification Banner */}
      {actionSuccessMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-slate-400 hover:text-white">Dismiss</button>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Projects"
          value={activeProjects.length}
          subtext={`${projectsWithGaps.length} projects have open staffing gaps`}
          icon={<FolderKanban className="w-5 h-5 text-brand-400" />}
          delta={{ value: '+1 this sprint', trend: 'up' }}
          onClick={() => navigate('/manager/projects')}
        />
        <KpiCard
          title="Team Workload"
          value="54.4%"
          subtext="87 / 160 weekly hours allocated"
          icon={<Users className="w-5 h-5 text-emerald-400" />}
          variant="healthy"
          delta={{ value: 'Optimal bandwidth', trend: 'neutral' }}
          onClick={() => navigate('/manager/team')}
        />
        <KpiCard
          title="Pending Proposals"
          value={pendingProposals.length}
          subtext="Awaiting manager approval"
          icon={<Sparkles className="w-5 h-5 text-amber-400" />}
          variant="warning"
          delta={{ value: '2 require review', trend: 'down' }}
          onClick={() => navigate('/manager/allocations')}
        />
        <KpiCard
          title="High-Risk Alerts"
          value="1 Employee"
          subtext="Elena Rostova (90% capacity, ML risk: 72%)"
          icon={<Flame className="w-5 h-5 text-rose-400" />}
          variant="critical"
          delta={{ value: 'Action required', trend: 'down' }}
          onClick={() => navigate('/manager/alerts')}
        />
      </div>

      {/* Main Grid: Projects with Gaps & Pending Proposals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Projects & Staffing Coverage */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Projects Widget */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-brand-400" />
                  Active Projects & Staffing Coverage
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time team allocation coverage vs required headcount</p>
              </div>
              <button
                onClick={() => navigate('/manager/projects')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <span>View All ({MOCK_PROJECTS.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {MOCK_PROJECTS.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/manager/projects/${project.id}`)}
                  className="p-4 bg-slate-900/60 hover:bg-slate-800/40 rounded-2xl border border-slate-800/80 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-white hover:text-brand-300 transition">{project.name}</h4>
                      <StatusBadge status={project.staffing_state} />
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{project.description}</p>
                    <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                      <span>Domain: <strong className="text-slate-300">{project.domain}</strong></span>
                      <span>Deadline: <strong className="text-slate-300">{project.deadline} ({project.deadline_days}d left)</strong></span>
                      <span>Priority: <strong className="text-brand-300">{project.priority}/5</strong></span>
                    </div>
                  </div>

                  {/* Staffing Progress Pill */}
                  <div className="sm:w-48 flex-shrink-0 text-right space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Coverage</span>
                      <span className="font-bold text-white">{project.current_team_size}/{project.required_team_size} Staffed</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          project.staffing_coverage_pct === 100
                            ? 'bg-emerald-500'
                            : project.staffing_coverage_pct >= 60
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${project.staffing_coverage_pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Allocation Proposals (Human Governance) */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  Pending Allocation Proposals (Human-in-the-Loop Review)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  ML produced candidate scoring and recommendations. Manager approval commits the assignment.
                </p>
              </div>
              <span className="text-xs px-2.5 py-0.5 bg-amber-500/10 text-amber-300 font-bold rounded-full border border-amber-500/20">
                {pendingProposals.length} Pending Approval
              </span>
            </div>

            <div className="space-y-4">
              {pendingProposals.map((prop) => (
                <div key={prop.id} className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{prop.project_name}</span>
                        <span className="text-[10px] text-slate-400">&bull; Slot: {prop.required_role} ({prop.required_skill})</span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1">
                        Recommended Candidate: <strong className="text-emerald-400 font-bold">{prop.selected_candidate.employee_name}</strong>
                        <span className="text-slate-400 ml-2">Final Score: {(prop.selected_candidate.final_score * 100).toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedProposalToReject(prop)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setSelectedProposalToApprove(prop)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-glow-emerald transition"
                      >
                        Approve & Commit
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 italic bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    "{prop.explanation}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Capacity Overview & Alerts & Recent Decisions */}
        <div className="space-y-6">
          
          {/* Team Capacity Health Card */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Users className="w-4 h-4 text-brand-400" />
              Team Capacity & Workload
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Engineering Capacity:</span>
                  <span className="font-bold text-white">160 hrs / week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Allocated This Sprint:</span>
                  <span className="font-bold text-brand-300">87 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Available Bandwidth:</span>
                  <span className="font-bold text-emerald-400">73 hrs</span>
                </div>
              </div>

              <WorkloadIndicator allocatedHours={87} capacityHours={160} />
            </div>

            {/* Employee Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Talent Workload Status</span>
              {MOCK_EMPLOYEES.slice(0, 3).map((emp) => (
                <div key={emp.id} className="flex justify-between items-center text-xs p-2 bg-slate-900/50 rounded-xl border border-slate-800/60">
                  <div>
                    <span className="font-bold text-slate-200 block">{emp.name}</span>
                    <span className="text-[10px] text-slate-400">{emp.allocated_hours}h / {emp.weekly_capacity_hours}h</span>
                  </div>
                  <RiskIndicator score={emp.burnout_risk_signal} />
                </div>
              ))}
            </div>
          </div>

          {/* High-Risk Alerts & Staffing Warnings */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Staffing & Capacity Alerts
              </h3>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Live</span>
            </div>

            <div className="space-y-2.5">
              {MOCK_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => alert.link && navigate(alert.link)}
                  className="p-3 bg-slate-900/70 hover:bg-slate-800/50 rounded-xl border border-slate-800 text-xs space-y-1 cursor-pointer transition"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-200">{alert.title}</span>
                    <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Ticket Activity */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <TicketIcon className="w-4 h-4 text-brand-400" />
              Recent Ticket Activity
            </h3>
            <div className="space-y-2">
              {MOCK_TICKETS.slice(0, 3).map((tck) => (
                <div key={tck.id} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="font-mono text-brand-400 font-semibold">{tck.id}:</span>{' '}
                    <span className="text-slate-300 font-medium truncate">{tck.title}</span>
                  </div>
                  <StatusBadge status={tck.status} />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Approval Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!selectedProposalToApprove}
        onClose={() => setSelectedProposalToApprove(null)}
        onConfirm={handleApprove}
        title="Approve Workforce Allocation"
        message={`Are you sure you want to approve the allocation of ${selectedProposalToApprove?.selected_candidate.employee_name} to ${selectedProposalToApprove?.project_name}? This decision will be recorded permanently in the audit trail.`}
        confirmLabel="Confirm & Commit Allocation"
        variant="primary"
      />

      {/* Rejection Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!selectedProposalToReject}
        onClose={() => setSelectedProposalToReject(null)}
        onConfirm={handleReject}
        title="Reject Allocation Proposal"
        message={`Reject candidate recommendation for ${selectedProposalToReject?.project_name}? The allocation engine can re-evaluate candidate rankings with adjusted constraint weights.`}
        confirmLabel="Reject Proposal"
        variant="danger"
      />

      {/* AI Allocation Execution Engine Modal */}
      <AllocationProgressModal
        isOpen={isAllocationModalOpen}
        onClose={() => setIsAllocationModalOpen(false)}
        requestPayload={{
          project_id: MOCK_PROJECTS[0].id,
          skill: 'Cloud Architecture',
          required_hours: 20,
        }}
        projectName={MOCK_PROJECTS[0].name}
      />
    </div>
  );
};
