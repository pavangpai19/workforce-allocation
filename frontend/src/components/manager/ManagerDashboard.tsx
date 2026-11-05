import React, { useState } from 'react';
import {
  Users,
  Clock,
  Flame,
  CheckCircle2,
  Sparkles,
  Sliders,
  Filter,
  BarChart3,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Play,
  RotateCcw,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { MOCK_PROJECTS, MOCK_CANDIDATES, MOCK_DECISION_LOGS } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { AllocationModal } from './AllocationModal';
import { api, AllocationProposal } from '../../services/api';
import { RankedCandidate } from '../../types/workforce';

export const ManagerDashboard: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');
  const [selectedSkill, setSelectedSkill] = useState<string>('Cloud Architecture');
  const [requiredHours, setRequiredHours] = useState<number>(25);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ranking' | 'audit' | 'pipeline'>('ranking');
  
  // API Integration state
  const [isLoadingAllocation, setIsLoadingAllocation] = useState<boolean>(false);
  const [liveProposal, setLiveProposal] = useState<AllocationProposal | null>(null);
  const [candidatesList, setCandidatesList] = useState<RankedCandidate[]>(MOCK_CANDIDATES);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const selectedProject = MOCK_PROJECTS.find((p) => p.id === selectedProjectId) || MOCK_PROJECTS[0];

  // Trigger NestJS /allocations/auto endpoint
  const handleComputeAutoAllocation = async () => {
    setIsLoadingAllocation(true);
    setApiError(null);
    setSuccessBanner(null);

    try {
      const proposal: AllocationProposal = await api.triggerAutoAllocation({
        project_id: selectedProjectId,
        skill: selectedSkill,
        required_hours: requiredHours,
      });

      setLiveProposal(proposal);

      // Map proposal to UI candidate format
      if (proposal.ranked_candidates && proposal.ranked_candidates.length > 0) {
        const mapped: RankedCandidate[] = proposal.ranked_candidates.map((c: any, i: number) => ({
          employee_id: c.employee_id,
          employee_name: c.employee_name,
          role: 'Qualified Talent',
          remaining: c.remaining_hours,
          fairness: c.fairness_score,
          performance: c.performance_score,
          skillScore: c.skill_score,
          knowledge: c.knowledge_score,
          risk_score: c.risk_score,
          confidence: c.confidence,
          final_score: c.final_score,
          hard_constraint_status: 'ELIGIBLE',
          features_9: {
            skill_match_score: c.skill_score,
            workload_ratio: 0.35,
            task_complexity: selectedProject.complexity / 5,
            estimated_hours: requiredHours,
            efficiency_score: 0.90,
            consistency_score: 0.92,
            reliability_score: 0.91,
            availability_score: 0.88,
            project_priority: selectedProject.priority / 5,
          },
        }));

        setCandidatesList(mapped);
      }

      setSuccessBanner(`Auto-Allocation evaluated successfully! Assigned: ${proposal.selected_candidate?.employee_name} (Score: ${(proposal.selected_candidate?.final_score * 100).toFixed(1)}%)`);
      setIsAllocationModalOpen(true);
    } catch (err: any) {
      console.warn('Live API auto-allocate failed, falling back to local quantifier proposal:', err.message);
      setApiError(`Backend API note: ${err.message}. Using deterministic local quantifier calculation.`);
      
      // Update local candidates for simulation
      const filtered = MOCK_CANDIDATES.map((cand) => {
        const hasSkill = cand.skillScore >= 0.6;
        const hasCap = cand.remaining >= requiredHours;
        let status: 'ELIGIBLE' | 'MISSING_SKILL' | 'INSUFFICIENT_CAPACITY' = 'ELIGIBLE';
        let rejReason: string | undefined = undefined;

        if (!hasSkill) {
          status = 'MISSING_SKILL';
          rejReason = `Missing required proficiency in ${selectedSkill}`;
        } else if (!hasCap) {
          status = 'INSUFFICIENT_CAPACITY';
          rejReason = `Remaining capacity (${cand.remaining}h) < required (${requiredHours}h)`;
        }

        return {
          ...cand,
          hard_constraint_status: status,
          rejection_reason: rejReason,
        };
      });

      setCandidatesList(filtered);
      setIsAllocationModalOpen(true);
    } finally {
      setIsLoadingAllocation(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Fast Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-slate-800/80 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-md border border-brand-500/20">
              Workforce Intelligence
            </span>
            <span className="text-xs text-slate-400">Week of Sep 2, 2026 &bull; REST API Wired</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Decision Engine & Auto-Allocation
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            5-Factor deterministic scoring powered by NestJS /allocations/auto endpoint.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleComputeAutoAllocation}
            disabled={isLoadingAllocation}
            className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-glow-indigo transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isLoadingAllocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
            <span>{isLoadingAllocation ? 'Executing /auto...' : 'Compute Auto-Allocation'}</span>
          </button>
        </div>
      </div>

      {/* Notifications / Feedback Banners */}
      {successBanner && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {successBanner}
          </span>
          <button onClick={() => setSuccessBanner(null)} className="text-slate-400 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      {apiError && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            {apiError}
          </span>
          <button onClick={() => setApiError(null)} className="text-slate-400 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Team Capacity</p>
              <h3 className="text-2xl font-bold text-white mt-1">160 <span className="text-sm font-normal text-slate-400">hrs</span></h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-brand-400 border border-indigo-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar value={87} max={160} label="Current Allocation (87h)" variant="brand" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Team Utilization</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">54.4%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">Healthy Range</span> (optimal: 65% - 80%)
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Burnout High-Risk Alerts</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">1 Employee</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            <span className="text-amber-400 font-medium">Elena Rostova</span> (90% capacity utilization)
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">ML Prediction Confidence</p>
              <h3 className="text-2xl font-bold text-brand-400 mt-1">94.8%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Endpoint: <span className="text-brand-300 font-mono">POST /allocations/auto</span>
          </p>
        </div>

      </div>

      {/* Main Allocation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Project & Allocation Parameter Setup */}
        <div className="lg:col-span-1 space-y-5">
          
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-400" />
                Target Allocation Scope
              </h3>
              <Badge variant="brand">Gated G-1</Badge>
            </div>

            {/* Project Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              >
                {MOCK_PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.priority === 5 ? 'Critical' : 'High Priority'})
                  </option>
                ))}
              </select>
            </div>

            {/* Skill Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Required Skill</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              >
                <option value="Cloud Architecture">Cloud Architecture</option>
                <option value="Kubernetes">Kubernetes</option>
                <option value="Terraform">Terraform</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Node.js / NestJS">Node.js / NestJS</option>
              </select>
            </div>

            {/* Required Hours Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-slate-300">Required Effort</label>
                <span className="text-sm font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                  {requiredHours} hrs / week
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={40}
                step={5}
                value={requiredHours}
                onChange={(e) => setRequiredHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>10h (Part-time)</span>
                <span>25h (Half sprint)</span>
                <span>40h (Full capacity)</span>
              </div>
            </div>

            <button
              onClick={handleComputeAutoAllocation}
              disabled={isLoadingAllocation}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl transition shadow-glow-indigo flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoadingAllocation ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isLoadingAllocation ? 'Executing /auto...' : 'Evaluate & Allocate via REST'}</span>
            </button>
          </div>

          {/* Decision Weights Visualization */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Decision Weights (Sum = 1.0)
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Fairness (Workload Balance)</span>
                <span className="font-mono text-brand-300">25% (0.25)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Performance (ML Calibrated)</span>
                <span className="font-mono text-brand-300">30% (0.30)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Skill Match Proficiency</span>
                <span className="font-mono text-brand-300">20% (0.20)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Domain Knowledge History</span>
                <span className="font-mono text-brand-300">15% (0.15)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Burnout Risk Penalty</span>
                <span className="font-mono text-rose-300">10% (0.10)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Candidate Rankings & Hard Constraints Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* View Tab Buttons */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('ranking')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  activeTab === 'ranking'
                    ? 'bg-slate-800 text-brand-300 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Candidate Soft Rankings ({candidatesList.filter(c => c.hard_constraint_status === 'ELIGIBLE').length} Feasible)
              </button>
              <button
                onClick={() => setActiveTab('pipeline')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  activeTab === 'pipeline'
                    ? 'bg-slate-800 text-brand-300 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hard Constraints Pipeline (C-3 Gating)
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  activeTab === 'audit'
                    ? 'bg-slate-800 text-brand-300 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Audit Decision Logs (Dual-Write H-3)
              </button>
            </div>
          </div>

          {/* Tab 1: Candidate Rankings */}
          {activeTab === 'ranking' && (
            <div className="space-y-3">
              {candidatesList.map((cand, idx) => (
                <div
                  key={cand.employee_id}
                  className={`glass-card p-4 rounded-2xl border transition-all ${
                    idx === 0 && cand.hard_constraint_status === 'ELIGIBLE'
                      ? 'border-brand-500/50 bg-brand-950/20 shadow-glow-indigo'
                      : cand.hard_constraint_status !== 'ELIGIBLE'
                      ? 'opacity-60 border-slate-800 bg-slate-900/30'
                      : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Candidate Info */}
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        idx === 0 && cand.hard_constraint_status === 'ELIGIBLE'
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white">{cand.employee_name}</h4>
                          {idx === 0 && cand.hard_constraint_status === 'ELIGIBLE' && (
                            <Badge variant="success">Optimal Selection</Badge>
                          )}
                          {cand.hard_constraint_status !== 'ELIGIBLE' && (
                            <Badge variant="danger">Infeasible</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{cand.role} &bull; {cand.remaining}h available capacity</p>
                      </div>
                    </div>

                    {/* Final Score Pill */}
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Final Score</div>
                        <div className="text-lg font-extrabold text-brand-300">
                          {(cand.final_score * 100).toFixed(2)}%
                        </div>
                      </div>
                      <button
                        onClick={() => setIsAllocationModalOpen(true)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* 5-Factor Score Matrix */}
                  <div className="mt-3.5 pt-3 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/40">
                      <span className="text-[10px] text-slate-400 block">Fairness</span>
                      <span className="font-semibold text-slate-200">{(cand.fairness * 100).toFixed(1)}%</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/40">
                      <span className="text-[10px] text-slate-400 block">Performance</span>
                      <span className="font-semibold text-slate-200">{(cand.performance * 100).toFixed(1)}%</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/40">
                      <span className="text-[10px] text-slate-400 block">Skill Match</span>
                      <span className="font-semibold text-slate-200">{(cand.skillScore * 100).toFixed(1)}%</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/40">
                      <span className="text-[10px] text-slate-400 block">Knowledge</span>
                      <span className="font-semibold text-slate-200">{(cand.knowledge * 100).toFixed(1)}%</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/40">
                      <span className="text-[10px] text-slate-400 block">Burnout Risk</span>
                      <span className={`font-semibold ${cand.risk_score > 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {(cand.risk_score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {cand.rejection_reason && (
                    <div className="mt-2.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      <span>{cand.rejection_reason}</span>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Hard Constraints Pipeline */}
          {activeTab === 'pipeline' && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Phase 1: Gated Hard Constraints (Rule #3 Compliance)
              </h3>
              <p className="text-xs text-slate-400">
                In compliance with architectural rule #3, candidates failing required skills or available capacity (<span className="text-slate-200 font-mono">remaining &lt; {requiredHours}h</span>) are rejected prior to ML inference and soft scoring.
              </p>

              <div className="space-y-2.5">
                {candidatesList.map((cand) => (
                  <div key={cand.employee_id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-200">{cand.employee_name}</span>
                      <span className="text-slate-400 ml-2">({cand.remaining}h remaining)</span>
                    </div>
                    <div>
                      {cand.hard_constraint_status === 'ELIGIBLE' ? (
                        <Badge variant="success">Passed All Hard Constraints</Badge>
                      ) : (
                        <Badge variant="danger">Filtered Out: {cand.rejection_reason || 'Ineligible'}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Audit Logs */}
          {activeTab === 'audit' && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Durable Decision Audit Trail</h3>
                <Badge variant="brand">allocation_decisions</Badge>
              </div>
              <div className="space-y-3">
                {MOCK_DECISION_LOGS.map((log) => (
                  <div key={log.id} className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-white text-sm">{log.employee_name}</span>
                        <span className="text-slate-400 ml-2">&bull; {log.project_name}</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-semibold text-sm">
                        Score: {(log.final_score * 100).toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-slate-300 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      "{log.explanation}"
                    </p>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                      <span>Allocation ID: <span className="font-mono text-brand-300">{log.allocation_id}</span></span>
                      <span>Recorded: {log.created_at}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Interactive Allocation Inspection Modal */}
      <AllocationModal
        isOpen={isAllocationModalOpen}
        onClose={() => setIsAllocationModalOpen(false)}
        selectedCandidate={candidatesList[0] || MOCK_CANDIDATES[0]}
        project={selectedProject}
        requiredHours={requiredHours}
        proposalExplanation={liveProposal?.explanation}
      />

    </div>
  );
};
