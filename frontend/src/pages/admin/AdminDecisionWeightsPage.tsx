import React, { useState } from 'react';
import {
  Sliders,
  AlertTriangle,
  History,
  CheckCircle2,
  ShieldAlert,
  Info,
  Save,
  RotateCcw,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { MOCK_DECISION_WEIGHTS } from '../../data/mockData';
import { DecisionWeightsConfig } from '../../types/workforce';

export const AdminDecisionWeightsPage: React.FC = () => {
  const [config, setConfig] = useState<DecisionWeightsConfig>(MOCK_DECISION_WEIGHTS);
  const [skillMatch, setSkillMatch] = useState(config.skill_match_weight);
  const [performance, setPerformance] = useState(config.performance_weight);
  const [fairness, setFairness] = useState(config.fairness_weight);
  const [riskPenalty, setRiskPenalty] = useState(config.risk_penalty_weight);
  const [workloadThreshold, setWorkloadThreshold] = useState(config.workload_threshold_ratio);
  const [strictHardConstraints, setStrictHardConstraints] = useState(config.strict_hard_constraints);
  const [fairnessCalibration, setFairnessCalibration] = useState(config.enable_ml_fairness_calibration);

  const [rationale, setRationale] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const totalWeight = Math.round((skillMatch + performance + fairness + riskPenalty) * 100);
  const isWeightValid = totalWeight === 100;

  const handleSaveWeights = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    setIsConfirmOpen(false);
    const newVersion = `v3.${config.change_history.length + 1}`;
    const newHistory = [
      {
        version: newVersion,
        changed_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
        changed_by: 'System Admin (DevOps)',
        rationale: rationale || 'Decision engine optimization coefficient recalibration.',
        weights_summary: `Skill: ${Math.round(skillMatch * 100)}%, Perf: ${Math.round(
          performance * 100
        )}%, Fairness: ${Math.round(fairness * 100)}%, Risk: ${Math.round(riskPenalty * 100)}%`,
      },
      ...config.change_history,
    ];

    setConfig({
      ...config,
      version: newVersion,
      skill_match_weight: skillMatch,
      performance_weight: performance,
      fairness_weight: fairness,
      risk_penalty_weight: riskPenalty,
      workload_threshold_ratio: workloadThreshold,
      strict_hard_constraints: strictHardConstraints,
      enable_ml_fairness_calibration: fairnessCalibration,
      change_history: newHistory,
    });

    setActionSuccess(`Decision scoring weights updated to ${newVersion}. Active for future allocation proposals.`);
    setRationale('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Decision Engine Scoring Weights & Optimization Policy"
        description="Calibrate deterministic ranking coefficients for candidate scoring, fairness, and risk management."
        breadcrumbs={[{ label: 'Admin Console', path: '/admin/dashboard' }, { label: 'Decision Weights' }]}
        actions={
          <button
            onClick={handleSaveWeights}
            disabled={!isWeightValid}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
              isWeightValid
                ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-glow-indigo'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Weights Configuration</span>
          </button>
        }
      />

      {/* Prominent Warning Banner */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start space-x-3 text-xs text-amber-300">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h5 className="font-bold text-amber-200">Critical Policy Notice: Future Proposals Only</h5>
          <p className="mt-0.5 leading-relaxed">
            Changes made here will affect <strong>future automated allocation proposals</strong> only. Existing proposals, active allocations, and historical approval audit snapshots remain strictly immutable.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 text-xs text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Weights Sliders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Composite Scoring Function Weights</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Total Sum:</span>
              <span
                className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                  isWeightValid
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {totalWeight}% (Target: 100%)
              </span>
            </div>
          </div>

          {/* Skill Match Weight */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Skill Match Weight</span>
              <span className="font-mono text-brand-400 font-bold">{Math.round(skillMatch * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={skillMatch}
              onChange={(e) => setSkillMatch(parseFloat(e.target.value))}
              className="w-full accent-brand-500"
            />
            <p className="text-[10px] text-slate-400">Proficiency level alignment and secondary skills overlap.</p>
          </div>

          {/* Performance Weight */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Historical Performance & Velocity Weight</span>
              <span className="font-mono text-cyan-400 font-bold">{Math.round(performance * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={performance}
              onChange={(e) => setPerformance(parseFloat(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <p className="text-[10px] text-slate-400">Consistency, reliability, and past sprint delivery completion scores.</p>
          </div>

          {/* Fairness Weight */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Workforce Fairness & Opportunity Index</span>
              <span className="font-mono text-indigo-400 font-bold">{Math.round(fairness * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={fairness}
              onChange={(e) => setFairness(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <p className="text-[10px] text-slate-400">Distributes growth opportunities evenly and prevents over-reliance on single architects.</p>
          </div>

          {/* Risk Penalty */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Burnout & Overutilization Risk Penalty</span>
              <span className="font-mono text-rose-400 font-bold">{Math.round(riskPenalty * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={riskPenalty}
              onChange={(e) => setRiskPenalty(parseFloat(e.target.value))}
              className="w-full accent-rose-500"
            />
            <p className="text-[10px] text-slate-400">Applies deduction penalties to candidates with elevated burnout signals.</p>
          </div>
        </div>

        {/* Hard Constraints & Policy Settings */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Hard Constraints & Engine Policy</h3>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="text-xs font-bold text-white">Strict Hard Capacity Constraints</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">Strictly eliminate candidates from proposals if hours exceed weekly limit.</p>
              </div>
              <input
                type="checkbox"
                checked={strictHardConstraints}
                onChange={(e) => setStrictHardConstraints(e.target.checked)}
                className="w-4 h-4 accent-brand-500 rounded"
              />
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h5 className="text-xs font-bold text-white">ML Fairness Calibration Engine</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">Enable background calibration to audit candidate distribution variance.</p>
              </div>
              <input
                type="checkbox"
                checked={fairnessCalibration}
                onChange={(e) => setFairnessCalibration(e.target.checked)}
                className="w-4 h-4 accent-brand-500 rounded"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Max Workload Utilization Ratio Threshold</span>
                <span className="font-mono text-amber-400 font-bold">{Math.round(workloadThreshold * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={workloadThreshold}
                onChange={(e) => setWorkloadThreshold(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Change History Audit Log */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white">Weights Revision History</h3>
        </div>

        <div className="space-y-3">
          {config.change_history.map((rev) => (
            <div key={rev.version} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-brand-400 font-bold">{rev.version}</span>
                  <span className="font-semibold text-white">{rev.weights_summary}</span>
                </div>
                <p className="text-[11px] text-slate-400">{rev.rationale}</p>
                <span className="text-[10px] text-slate-500 font-mono block">
                  Modified by {rev.changed_by} at {rev.changed_at}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title="Confirm Decision Weights Recalibration"
        message="You are updating system-wide scoring weights. This action is recorded in the immutable audit log and will take effect on all future automated team proposals."
        confirmLabel="Confirm & Apply Weights"
        variant="primary"
      >
        <div className="pt-3 space-y-2">
          <label className="text-xs font-bold text-slate-300">Change Rationale / Justification</label>
          <input
            type="text"
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder="e.g., Calibrated fairness index following quarterly workload review."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </ConfirmationDialog>
    </div>
  );
};
