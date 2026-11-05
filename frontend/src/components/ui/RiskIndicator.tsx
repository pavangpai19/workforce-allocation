import React from 'react';
import { AlertCircle, ShieldCheck, HelpCircle } from 'lucide-react';

export interface RiskIndicatorProps {
  score: number; // 0.0 to 1.0
  label?: string;
  tooltip?: string;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  score,
  label = 'Burnout Risk Signal',
  tooltip = 'ML-quantified probability based on 9 workforce features (workload ratio, consistency, task complexity).',
}) => {
  const pct = (score * 100).toFixed(1);

  let statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  let riskLevel = 'LOW';
  let Icon = ShieldCheck;

  if (score > 0.6) {
    statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    riskLevel = 'CRITICAL';
    Icon = AlertCircle;
  } else if (score >= 0.35) {
    statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    riskLevel = 'MEDIUM';
    Icon = AlertCircle;
  }

  return (
    <div className="inline-flex items-center gap-2" title={tooltip}>
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${statusColor}`}>
        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{pct}% {riskLevel}</span>
      </span>
      <span className="text-xs text-slate-400 hidden sm:inline">{label}</span>
    </div>
  );
};
