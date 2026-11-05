import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KpiCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  delta?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  variant?: 'default' | 'healthy' | 'warning' | 'critical';
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtext,
  icon,
  delta,
  variant = 'default',
  onClick,
}) => {
  const borderColors = {
    default: 'border-slate-800 hover:border-slate-700 bg-slate-900/60',
    healthy: 'border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-950/10',
    warning: 'border-amber-500/20 hover:border-amber-500/40 bg-amber-950/10',
    critical: 'border-rose-500/20 hover:border-rose-500/40 bg-rose-950/10',
  };

  const textColors = {
    default: 'text-white',
    healthy: 'text-emerald-400',
    warning: 'text-amber-400',
    critical: 'text-rose-400',
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-200 ${borderColors[variant]} ${
        onClick ? 'cursor-pointer transform hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {icon && <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/50">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline space-x-2">
        <span className={`text-2xl font-extrabold tracking-tight ${textColors[variant]}`}>{value}</span>
        {delta && (
          <span
            className={`inline-flex items-center text-xs font-semibold ${
              delta.trend === 'up' ? 'text-emerald-400' : delta.trend === 'down' ? 'text-rose-400' : 'text-slate-400'
            }`}
          >
            {delta.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 mr-0.5" />}
            {delta.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
            {delta.trend === 'neutral' && <Minus className="w-3.5 h-3.5 mr-0.5" />}
            {delta.value}
          </span>
        )}
      </div>

      {subtext && <p className="mt-1.5 text-xs text-slate-400">{subtext}</p>}
    </div>
  );
};
