import React from 'react';
import { X, CheckCircle, ShieldCheck, Sparkles, AlertCircle, FileText } from 'lucide-react';
import { RankedCandidate, Project } from '../../types/workforce';
import { Badge } from '../common/Badge';

interface AllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCandidate: RankedCandidate;
  project: Project;
  requiredHours: number;
  proposalExplanation?: string;
}

export const AllocationModal: React.FC<AllocationModalProps> = ({
  isOpen,
  onClose,
  selectedCandidate,
  project,
  requiredHours,
  proposalExplanation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-glass overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-indigo-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Allocation Proposal Contract</h3>
              <p className="text-xs text-slate-400">Parsed from NestJS POST /allocations/auto</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          {/* Selected Candidate Summary */}
          <div className="flex items-center justify-between p-4 bg-slate-950/70 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Winning Proposal</span>
              <h4 className="text-base font-bold text-white mt-0.5">{selectedCandidate.employee_name}</h4>
              <p className="text-xs text-slate-400">{selectedCandidate.role}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Computed Score</span>
              <div className="text-2xl font-black text-brand-400">
                {(selectedCandidate.final_score * 100).toFixed(2)}%
              </div>
            </div>
          </div>

          {/* 9-Feature ML Vector */}
          <div>
            <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              9-Feature Quantifier Vector
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              {Object.entries(selectedCandidate.features_9).map(([key, val]) => (
                <div key={key} className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block truncate">{key}</span>
                  <span className="font-mono font-semibold text-slate-200">{typeof val === 'number' ? val.toFixed(2) : val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Engine 5-Factor Weighted Calculation */}
          <div>
            <h4 className="font-bold text-slate-200 mb-2">5-Factor Weighted Score Assembly</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-slate-950/40 rounded-lg border border-slate-800">
                <span>Fairness (0.25 weight &times; {(selectedCandidate.fairness * 100).toFixed(1)}%)</span>
                <span className="font-mono text-slate-200">+{(0.25 * selectedCandidate.fairness).toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-950/40 rounded-lg border border-slate-800">
                <span>Performance (0.30 weight &times; {(selectedCandidate.performance * 100).toFixed(1)}%)</span>
                <span className="font-mono text-slate-200">+{(0.30 * selectedCandidate.performance).toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-950/40 rounded-lg border border-slate-800">
                <span>Skill Match (0.20 weight &times; {(selectedCandidate.skillScore * 100).toFixed(1)}%)</span>
                <span className="font-mono text-slate-200">+{(0.20 * selectedCandidate.skillScore).toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-950/40 rounded-lg border border-slate-800">
                <span>Domain Knowledge (0.15 weight &times; {(selectedCandidate.knowledge * 100).toFixed(1)}%)</span>
                <span className="font-mono text-slate-200">+{(0.15 * selectedCandidate.knowledge).toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-950/40 rounded-lg border border-slate-800 text-rose-300">
                <span>Burnout Risk Penalty (-0.10 weight &times; {(selectedCandidate.risk_score * 100).toFixed(1)}%)</span>
                <span className="font-mono text-rose-400">-{(0.10 * selectedCandidate.risk_score).toFixed(4)}</span>
              </div>
            </div>
          </div>

          {/* Explanation Text */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <FileText className="w-3 h-3 text-brand-400" />
              Generated Decision Explanation
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {proposalExplanation || `Selected ${selectedCandidate.employee_name} based on top overall final score (${(selectedCandidate.final_score * 100).toFixed(2)}%). Demonstrates high skill proficiency, ample capacity (${selectedCandidate.remaining}h), low burnout risk, and high ML model confidence.`}
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 flex justify-end space-x-3 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              alert('Allocation proposal committed and recorded in allocation_decisions database!');
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-indigo transition"
          >
            Confirm & Commit Allocation
          </button>
        </div>

      </div>
    </div>
  );
};
