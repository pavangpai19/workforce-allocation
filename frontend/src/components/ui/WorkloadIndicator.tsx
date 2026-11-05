import React from 'react';

export interface WorkloadIndicatorProps {
  allocatedHours: number;
  capacityHours: number;
  showDetails?: boolean;
}

export const WorkloadIndicator: React.FC<WorkloadIndicatorProps> = ({
  allocatedHours,
  capacityHours,
  showDetails = true,
}) => {
  const ratio = capacityHours > 0 ? (allocatedHours / capacityHours) * 100 : 0;

  // Threshold colors: <80% calm indigo, 80-100% amber warning, >100% critical red
  let barColor = 'from-brand-600 to-indigo-400';
  let badgeText = 'Healthy';
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

  if (ratio > 100) {
    barColor = 'from-rose-600 to-red-500';
    badgeText = 'Overallocated';
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  } else if (ratio >= 80) {
    barColor = 'from-amber-500 to-yellow-400';
    badgeText = 'Near Capacity';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  }

  return (
    <div className="w-full space-y-1.5">
      {showDetails && (
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300 font-medium">
            {allocatedHours} / {capacityHours} <span className="text-slate-400 font-normal">hrs/week</span>
          </span>
          <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded-md border ${badgeColor}`}>
            {ratio.toFixed(0)}% &bull; {badgeText}
          </span>
        </div>
      )}
      <div className="h-2 w-full bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
          style={{ width: `${Math.min(100, ratio)}%` }}
        />
      </div>
    </div>
  );
};
