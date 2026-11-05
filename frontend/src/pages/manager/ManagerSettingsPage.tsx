import React, { useState } from 'react';
import { PageHeader } from '../../components/shell/PageHeader';
import { Sliders, Bell, Save, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const ManagerSettingsPage: React.FC = () => {
  const [fairnessWeight, setFairnessWeight] = useState(25);
  const [performanceWeight, setPerformanceWeight] = useState(35);
  const [skillMatchWeight, setSkillMatchWeight] = useState(40);
  const [burnoutThreshold, setBurnoutThreshold] = useState(90);
  const [autoNotifyProposals, setAutoNotifyProposals] = useState(true);
  const [allowOverAllocation, setAllowOverAllocation] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Manager Platform Settings"
        description="Configure allocation optimization parameters, capacity warning thresholds, and team governance policies."
        actions={
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-indigo transition flex items-center space-x-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        }
      />

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Platform settings updated successfully. Changes applied to active allocation pipelines.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML Scoring Weights */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <Sliders className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-bold text-white">Allocation Algorithm Weights</h3>
            </div>
            <Badge variant="brand">ML Engine</Badge>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="font-semibold text-slate-200">Skill Proficiency Match</span>
                <span className="font-mono text-brand-400 font-bold">{skillMatchWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                value={skillMatchWeight}
                onChange={(e) => setSkillMatchWeight(parseInt(e.target.value, 10))}
                className="w-full accent-brand-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">Weight assigned to verified competency score and required role skills.</p>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="font-semibold text-slate-200">Historical Performance Score</span>
                <span className="font-mono text-brand-400 font-bold">{performanceWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                value={performanceWeight}
                onChange={(e) => setPerformanceWeight(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">Weight of previous project delivery rating and velocity reliability.</p>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="font-semibold text-slate-200">Workload Fairness & Equity</span>
                <span className="font-mono text-emerald-400 font-bold">{fairnessWeight}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={fairnessWeight}
                onChange={(e) => setFairnessWeight(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">Prioritizes balanced utilization across team members to prevent fatigue.</p>
            </div>
          </div>
        </div>

        {/* Capacity & Alert Thresholds */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Capacity & Alert Policies</h3>
            </div>
            <Badge variant="warning">Monitoring</Badge>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="font-semibold text-slate-200">Capacity Warning Threshold</span>
                <span className="font-mono text-amber-400 font-bold">{burnoutThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="100"
                value={burnoutThreshold}
                onChange={(e) => setBurnoutThreshold(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">Triggers CAPACITY_WARNING alert when employee workload reaches this level.</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoNotifyProposals}
                  onChange={(e) => setAutoNotifyProposals(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Instant Proposal Notifications</span>
                  <span className="text-[11px] text-slate-400 block">Receive real-time alerts when the engine generates a new team proposal.</span>
                </div>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowOverAllocation}
                  onChange={(e) => setAllowOverAllocation(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Allow Emergency Over-Allocation</span>
                  <span className="text-[11px] text-slate-400 block">Require explicit manager justification when allocating an employee beyond 100% capacity.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
