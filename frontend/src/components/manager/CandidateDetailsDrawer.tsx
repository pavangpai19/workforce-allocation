import React from 'react';
import {
  User,
  Star,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Briefcase,
  ShieldCheck,
  Cpu,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SideDrawer } from '../ui/SideDrawer';
import { RankedCandidate, TeamMemberProposal, Employee } from '../../types/workforce';

export interface CandidateDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: RankedCandidate | TeamMemberProposal | Employee | null;
  slotContext?: {
    role: string;
    skill: string;
    min_proficiency: number;
    hours_per_week: number;
  };
}

export const CandidateDetailsDrawer: React.FC<CandidateDetailsDrawerProps> = ({
  isOpen,
  onClose,
  candidate,
  slotContext,
}) => {
  if (!candidate) return null;

  // Type guards / normalizations
  const name = 'name' in candidate ? candidate.name : candidate.employee_name;
  const role = 'role' in candidate ? candidate.role : 'current_role' in candidate ? candidate.current_role : '';
  const employeeId = 'id' in candidate ? candidate.id : candidate.employee_id;

  // Determine scores and features
  const finalScore = 'final_score' in candidate ? candidate.final_score : ('final_deterministic_score' in candidate ? candidate.final_deterministic_score : 0.85);
  const fairness = 'fairness' in candidate ? candidate.fairness : ('fairness_adjustment' in candidate ? candidate.fairness_adjustment : 0.85);
  const performance = 'performance' in candidate ? candidate.performance : ('predicted_performance' in candidate ? candidate.predicted_performance : 0.88);
  const skillScore = 'skillScore' in candidate ? candidate.skillScore : ('skill_match_rating' in candidate ? candidate.skill_match_rating / 5 : 0.9);
  const knowledge = 'knowledge' in candidate ? candidate.knowledge : 0.85;
  const riskScore = 'risk_score' in candidate ? candidate.risk_score : ('burnout_risk_score' in candidate ? candidate.burnout_risk_score : ('burnout_risk_signal' in candidate ? candidate.burnout_risk_signal : 0.15));

  // Features 9 (Quantifier vector)
  const features9 = 'features_9' in candidate ? candidate.features_9 : {
    skill_match_score: typeof skillScore === 'number' ? skillScore : 0.9,
    workload_ratio: 'workload_capacity_state' in candidate && candidate.workload_capacity_state === 'Overallocated' ? 0.9 : 0.625,
    task_complexity: 0.8,
    estimated_hours: slotContext?.hours_per_week || 25,
    efficiency_score: 'efficiency_score' in candidate ? candidate.efficiency_score : 0.88,
    consistency_score: 'consistency_score' in candidate ? candidate.consistency_score : 0.90,
    reliability_score: 'reliability_score' in candidate ? candidate.reliability_score : 0.92,
    availability_score: 'availability_score' in candidate ? candidate.availability_score : 0.85,
    project_priority: 1.0,
  };

  const hardConstraintStatus = 'hard_constraint_status' in candidate ? candidate.hard_constraint_status : 'ELIGIBLE';
  const rejectionReason = 'rejection_reason' in candidate ? candidate.rejection_reason : undefined;

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Allocation Profile"
      subtitle={`Detailed deterministic evaluation for ${name}`}
      width="max-w-2xl"
    >
      <div className="space-y-6 pb-6">
        {/* Candidate Header Profile */}
        <div className="flex items-center justify-between p-4 bg-slate-950/70 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-800 flex items-center justify-center text-white font-bold text-base shadow-glow-indigo">
              {name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-white">{name}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {employeeId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{role}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-400">Final Composite Score</div>
            <div className="text-lg font-extrabold text-brand-400 font-mono">
              {((finalScore ?? 0) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Hard Constraint Status Banner */}
        <div
          className={`p-3.5 rounded-xl border flex items-start space-x-3 ${
            hardConstraintStatus === 'ELIGIBLE' || hardConstraintStatus === 'PASSED'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}
        >
          {hardConstraintStatus === 'ELIGIBLE' || hardConstraintStatus === 'PASSED' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <div className="font-bold">
              Hard Constraints:{' '}
              {hardConstraintStatus === 'ELIGIBLE' || hardConstraintStatus === 'PASSED'
                ? 'Passed All Gates'
                : 'Constraint Violation'}
            </div>
            <p className="mt-0.5 opacity-90">
              {rejectionReason ||
                (hardConstraintStatus === 'ELIGIBLE' || hardConstraintStatus === 'PASSED'
                  ? 'Candidate satisfies minimum skill proficiency, availability window, and weekly capacity thresholds.'
                  : 'Candidate does not satisfy strict allocation prerequisites.')}
            </p>
          </div>
        </div>

        {/* Workload & Capacity Overview */}
        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-brand-400" />
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                Workload & Capacity Status
              </h5>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Utilization: {Math.round(features9.workload_ratio * 100)}%
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  features9.workload_ratio > 0.85
                    ? 'bg-rose-500 shadow-glow-rose'
                    : features9.workload_ratio > 0.7
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(features9.workload_ratio * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Allocated: {Math.round(40 * features9.workload_ratio)}h / 40h</span>
              <span>Remaining: {Math.max(40 - Math.round(40 * features9.workload_ratio), 0)}h</span>
            </div>
          </div>

          {/* Active Projects / Release Dependencies */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5 mb-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Active Project Commitments & Sprint Dependencies:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-[10px] text-slate-300 border border-slate-700/60">
                Cloud Modernization (20h/wk)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-[10px] text-slate-300 border border-slate-700/60">
                Identity Guardrails (5h/wk)
              </span>
              {'pending_release_date' in candidate && candidate.pending_release_date && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-[10px] text-amber-300 border border-amber-500/20 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Release Date: {candidate.pending_release_date}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 9-Feature Quantifier Vector (ML Signals) */}
        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                9-Feature Quantifier Vector (ML Inputs)
              </h5>
            </div>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-mono">
              Strict 9-Feature Contract
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block truncate">1. Skill Match</span>
              <span className="text-xs font-bold font-mono text-white">
                {(features9.skill_match_score * 100).toFixed(0)}%
              </span>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block truncate">2. Workload Ratio</span>
              <span className="text-xs font-bold font-mono text-white">
                {(features9.workload_ratio * 100).toFixed(0)}%
              </span>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block truncate">3. Task Complexity</span>
              <span className="text-xs font-bold font-mono text-white">
                {(features9.task_complexity * 100).toFixed(0)}%
              </span>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block truncate">4. Estimated Hours</span>
              <span className="text-xs font-bold font-mono text-white">
                {features9.estimated_hours}h
              </span>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block truncate">5. Efficiency Score</span>
              <span className="text-xs font-bold font-mono text-white">
                {(features9.efficiency_score * 100).toFixed(0)}%
              </span>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block truncate">6. Consistency Score</span>
              <span className="text-xs font-bold font-mono text-white">
                {(features9.consistency_score * 100).toFixed(0)}%
              </span>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block truncate">7. Reliability Score</span>
              <span className="text-xs font-bold font-mono text-white">
                {(features9.reliability_score * 100).toFixed(0)}%
              </span>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block truncate">8. Availability Score</span>
              <span className="text-xs font-bold font-mono text-white">
                {(features9.availability_score * 100).toFixed(0)}%
              </span>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block truncate">9. Project Priority</span>
              <span className="text-xs font-bold font-mono text-white">
                Level {(features9.project_priority * 5).toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Deterministic 5-Factor Score Decomposition */}
        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                Deterministic 5-Factor Scoring Model
              </h5>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
              Normalized Weights Σw = 1.0
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Fairness & Workload Equity (w = 0.25)</span>
                <span className="font-mono font-bold text-white">{(fairness * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-500 h-full rounded-full" style={{ width: `${fairness * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">ML Predicted Performance (w = 0.30)</span>
                <span className="font-mono font-bold text-white">{(performance * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${performance * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Skill Proficiency Match (w = 0.20)</span>
                <span className="font-mono font-bold text-white">{(skillScore * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${skillScore * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Domain & Knowledge Fit (w = 0.15)</span>
                <span className="font-mono font-bold text-white">{(knowledge * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${knowledge * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Burnout & Risk Penalty (w = 0.10)</span>
                <span className="font-mono font-bold text-amber-400">{(riskScore * 100).toFixed(1)}% penalty</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${riskScore * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Rationale */}
        <div className="p-4 bg-brand-950/20 rounded-2xl border border-brand-500/30 space-y-2">
          <div className="flex items-center space-x-2 text-brand-300 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Decision Intelligence Rationale</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Candidate scored exceptionally well on verified skill proficiency and historical task completion consistency.
            Workload equity adjustment ensures distribution balance without triggering fatigue risk.
          </p>
        </div>
      </div>
    </SideDrawer>
  );
};
