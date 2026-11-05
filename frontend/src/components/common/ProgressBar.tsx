import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 1 or 0 to 100
  max?: number;
  label?: string;
  sublabel?: string;
  variant?: 'brand' | 'emerald' | 'amber' | 'rose';
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 1,
  label,
  sublabel,
  variant = 'brand',
  showPercentage = true,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantColors = {
    brand: 'from-brand-600 to-indigo-400',
    emerald: 'from-emerald-600 to-teal-400',
    amber: 'from-amber-600 to-yellow-400',
    rose: 'from-rose-600 to-red-400',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="font-medium text-slate-300">{label}</span>
          <div className="flex items-center space-x-1.5">
            {sublabel && <span className="text-slate-400 text-[11px]">{sublabel}</span>}
            {showPercentage && <span className="font-semibold text-slate-200">{percentage.toFixed(1)}%</span>}
          </div>
        </div>
      )}
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${variantColors[variant]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
