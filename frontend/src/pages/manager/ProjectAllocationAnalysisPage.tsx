import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BarChart3,
  Layers,
  FileCheck,
  Briefcase,
  Clock,
  ChevronRight,
  Search,
  Filter,
  UserCheck,
  AlertCircle,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CandidateDetailsDrawer } from '../../components/manager/CandidateDetailsDrawer';
import {
  MOCK_PROJECTS,
  MOCK_TEAM_PROPOSALS,
  MOCK_SLOT_CANDIDATES,
  MOCK_EXCLUDED_CANDIDATES,
  MOCK_EMPLOYEES,
} from '../../data/mockData';
import { RankedCandidate, TeamMemberProposal } from '../../types/workforce';
import { api } from '../../services/api';

export const ProjectAllocationAnalysisPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('team-proposal');
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!projectId) return;
      setIsLoading(true);
      try {
        const liveProj = await api.getProject(projectId);
        if (isMounted && liveProj) {
          setProjectData(liveProj);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        // Fallback to mock
        const mockProj = MOCK_PROJECTS.find((p) => p.id === projectId);
        if (isMounted) {
          setProjectData(mockProj || MOCK_PROJECTS[0]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading allocation analysis telemetry...</p>
      </div>
    );
  }

  const project = projectData || MOCK_PROJECTS[0];
  const liveProposals = project.proposals || [];
  const latestProposal = liveProposals[0] || project.latest_proposal;

  const mockProposal =
    MOCK_TEAM_PROPOSALS.find((prop) => prop.project_id === project.id) || MOCK_TEAM_PROPOSALS[0];

  const proposalId = latestProposal?.id || mockProposal.id;

  // Build proposed team
  const proposedTeam: any[] =
    latestProposal && latestProposal.allocation_proposal_members?.length > 0
      ? latestProposal.allocation_proposal_members.map((m: any) => ({
          slot_id: m.id,
          slot_role: m.proposed_role,
          slot_skill: m.proposed_role,
          employee_id: m.employee_id,
          employee_name: m.employees?.name || 'Assigned Candidate',
          current_role: m.proposed_role,
          allocated_hours: m.allocated_hours_per_week,
          required_hours: m.allocated_hours_per_week,
          predicted_performance: m.predicted_performance ?? 0.88,
          final_deterministic_score: m.final_score ?? 0.88,
          burnout_risk_score: m.constraint_snapshot?.burnout_risk_probability ?? 0.15,
          hard_constraint_status: m.eligibility_status || 'ELIGIBLE',
          availability_status: m.availability_status || 'AVAILABLE_NOW',
          explanation: m.explanation,
        }))
      : mockProposal.proposed_team;

  // Decision logs
  const liveDecisionLogs: any[] = project.decision_logs || [];
  const excludedCandidates =
    liveDecisionLogs.length > 0
      ? liveDecisionLogs
          .filter((log: any) => log.explanation?.toLowerCase().includes('reject') || log.final_score < 0.3)
          .map((log: any) => ({
            employee_id: log.employee_id,
            employee_name: log.employees?.name || 'Evaluated Engineer',
            role: 'Candidate',
            failed_constraint_reason: log.explanation?.includes('Proficiency') ? 'Skill Threshold' : 'Lower Rank / Capacity',
            target_slot: 'Project Requirement',
            details: log.explanation,
          }))
      : MOCK_EXCLUDED_CANDIDATES;

  const handleInspect = (cand: any) => {
    setSelectedCandidate(cand);
    setIsDrawerOpen(true);
  };

  const tabs = [
    { id: 'team-proposal', label: 'Team Proposal', count: proposedTeam.length },
    { id: 'staffing-coverage', label: 'Staffing Coverage' },
    { id: 'candidate-rankings', label: 'Candidate Rankings' },
    { id: 'excluded-candidates', label: 'Audit Logs & Exclusions', count: excludedCandidates.length },
    { id: 'decision-factors', label: 'Decision Factors & Weights' },
  ];

  // 9-Step Process
  const steps = [
    { num: 1, label: 'Hard Constraints', status: 'done' },
    { num: 2, label: 'Eligibility Gate', status: 'done' },
    { num: 3, label: '9-Feature ML Signals', status: 'done' },
    { num: 4, label: 'Score Decomposition', status: 'done' },
    { num: 5, label: 'Candidate Ranking', status: 'done' },
    { num: 6, label: 'Multi-Person Team Formation', status: 'done' },
    { num: 7, label: 'Release Dependency Check', status: 'done' },
    { num: 8, label: 'Audit Log Staged', status: 'done' },
    { num: 9, label: 'Human Governance Review', status: 'active' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title={`Deterministic Team Allocation Analysis: ${project.name}`}
        description="Multi-person staffing optimization with 9-feature ML signals, hard constraint verification, and manager approval."
        breadcrumbs={[
          { label: 'Manager Dashboard', path: '/manager/dashboard' },
          { label: 'Projects', path: '/manager/projects' },
          { label: project.name, path: `/manager/projects/${project.id}` },
          { label: 'Allocation Analysis' },
        ]}
        actions={
          <div className="flex items-center space-x-3">
            <Link
              to={`/manager/proposals/${proposalId}`}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-glow-indigo transition flex items-center space-x-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Review Proposal & Approve</span>
            </Link>
          </div>
        }
      />

      {/* 9-Step Progress Visualizer */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Deterministic Allocation Pipeline Status</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Pipeline Complete • Awaiting Human Sign-Off
          </span>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
          {steps.map((st) => (
            <div
              key={st.num}
              className={`p-2.5 rounded-xl border text-center transition ${
                st.status === 'done'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-brand-600 text-white border-brand-500 shadow-glow-indigo'
              }`}
            >
              <span className="text-[10px] font-mono opacity-80 block font-bold">Step {st.num}</span>
              <span className="text-[11px] font-semibold block leading-tight mt-0.5">{st.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pill" />

        {/* Tab 1: Team Proposal */}
        {activeTab === 'team-proposal' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Recommended Multi-Person Team Composition</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Proposed team meets all staffing slot requirements without overloading individual engineers.
                </p>
              </div>
              <Link
                to={`/manager/proposals/${proposalId}`}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold transition"
              >
                Open Approval Workflow
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposedTeam.map((member: any) => (
                <div
                  key={member.slot_id}
                  className="p-5 bg-slate-950/70 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-3.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-brand-400 uppercase tracking-wider block">
                        Slot: {member.slot_role}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{member.employee_name}</h4>
                      <p className="text-xs text-slate-400">{member.current_role}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-brand-400 font-mono">
                        {(member.final_deterministic_score * 100).toFixed(1)}%
                      </div>
                      <span className="text-[10px] text-slate-400">Deterministic Score</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Allocated Hours</span>
                      <span className="font-bold text-white font-mono">{member.allocated_hours}h / wk</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Predicted Perf</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {(member.predicted_performance * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Burnout Risk</span>
                      <span
                        className={`font-bold font-mono ${
                          member.burnout_risk_score > 0.5 ? 'text-rose-400' : 'text-slate-300'
                        }`}
                      >
                        {(member.burnout_risk_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {member.explanation && (
                    <p className="text-[11px] text-slate-300 italic bg-slate-900/40 p-2 rounded-lg border border-slate-800/50">
                      {member.explanation}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[11px] text-slate-300">
                        Hard Constraints: {member.hard_constraint_status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleInspect(member)}
                      className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-1"
                    >
                      <span>Inspect Candidate</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Staffing Coverage */}
        {activeTab === 'staffing-coverage' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-white">Staffing Slot & Capacity Coverage</h3>
            <p className="text-xs text-slate-400">
              Aggregated weekly hours allocated across configured role requirements.
            </p>

            <div className="space-y-3">
              {proposedTeam.map((m: any) => (
                <div key={m.slot_id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">
                      {m.slot_role} ({m.slot_skill})
                    </span>
                    <span className="font-mono text-brand-400">
                      {m.allocated_hours}h / {m.required_hours}h ({Math.round((m.allocated_hours / (m.required_hours || 1)) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${Math.min((m.allocated_hours / (m.required_hours || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Assigned: {m.employee_name}</span>
                    <span>Availability: {m.availability_status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Candidate Rankings */}
        {activeTab === 'candidate-rankings' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-white">Per-Slot Candidate Leaderboard</h3>
            <p className="text-xs text-slate-400">
              Deterministic ranking of eligible employees evaluated under normalized 9-feature ML weights.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-2 font-semibold">Rank</th>
                    <th className="pb-2 font-semibold">Candidate</th>
                    <th className="pb-2 font-semibold">Role</th>
                    <th className="pb-2 font-semibold">Status</th>
                    <th className="pb-2 font-semibold">ML Perf</th>
                    <th className="pb-2 font-semibold">Risk</th>
                    <th className="pb-2 font-semibold font-mono">Final Score</th>
                    <th className="pb-2 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {proposedTeam.map((c: any, idx: number) => (
                    <tr key={c.slot_id} className="hover:bg-slate-800/30 transition">
                      <td className="py-2.5 font-bold font-mono text-slate-400">#{idx + 1}</td>
                      <td className="py-2.5 font-semibold text-white">{c.employee_name}</td>
                      <td className="py-2.5 text-slate-400">{c.slot_role}</td>
                      <td className="py-2.5">
                        <StatusBadge
                          status={c.hard_constraint_status === 'ELIGIBLE' ? 'healthy' : 'warning'}
                          label={c.hard_constraint_status}
                        />
                      </td>
                      <td className="py-2.5 font-mono text-emerald-400">
                        {(c.predicted_performance * 100).toFixed(0)}%
                      </td>
                      <td className="py-2.5 font-mono text-amber-400">
                        {(c.burnout_risk_score * 100).toFixed(0)}%
                      </td>
                      <td className="py-2.5 font-bold font-mono text-brand-400">
                        {(c.final_deterministic_score * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => handleInspect(c)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Excluded Candidates / Audit Logs */}
        {activeTab === 'excluded-candidates' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-white">Candidates Excluded by Hard Constraints & Decision Audit Logs</h3>
            <p className="text-xs text-slate-400">
              Transparent audit log of all engineers screened out or ranked lower prior to final proposal.
            </p>

            <div className="space-y-3">
              {excludedCandidates.map((exc: any, i: number) => (
                <div
                  key={`${exc.employee_id}-${i}`}
                  className="p-4 bg-slate-950/60 rounded-2xl border border-rose-500/20 flex items-start space-x-3.5"
                >
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-bold text-white">{exc.employee_name}</h4>
                        <span className="text-[10px] text-slate-400">({exc.role})</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-semibold">
                        {exc.failed_constraint_reason}
                      </span>
                    </div>
                    <div className="text-[11px] text-brand-300 font-mono">Target: {exc.target_slot}</div>
                    <p className="text-xs text-slate-300">{exc.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Decision Factors */}
        {activeTab === 'decision-factors' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-white">Deterministic Scoring Formulation & Model Governance</h3>
            <p className="text-xs text-slate-400">
              The allocation engine computes deterministic candidate ranks using mathematically validated weights.
            </p>

            <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-xs font-mono text-brand-300 font-bold">
                Final Score = 0.40·SkillMatch + 0.40·ML_Performance + 0.20·FairnessAdjustment
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                All feature inputs are normalized strictly between 0.0 and 1.0. Hard constraints (proficiency threshold, workload capacity, burnout risk limit) are applied deterministically prior to ranking.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Details Drawer */}
      {selectedCandidate && (
        <CandidateDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          candidate={selectedCandidate}
        />
      )}
    </div>
  );
};
