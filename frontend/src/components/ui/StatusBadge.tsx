import React from 'react';

export type StatusVariant =
  | 'approved'
  | 'in-review'
  | 'pending-decision'
  | 'blocked'
  | 'healthy'
  | 'warning'
  | 'critical'
  | 'draft'
  | 'active'
  | 'completed';

export interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'sm' }) => {
  const norm = (status || '').toLowerCase().replace(/_/g, '-');

  const variantStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
    healthy: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
    active: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
    completed: { bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/20', dot: 'bg-indigo-400' },
    'in-review': { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/20', dot: 'bg-amber-400' },
    'pending-decision': { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/20', dot: 'bg-amber-400' },
    'staffing-gaps': { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/20', dot: 'bg-amber-400' },
    warning: { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/20', dot: 'bg-amber-400' },
    blocked: { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/20', dot: 'bg-rose-400' },
    critical: { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/20', dot: 'bg-rose-400' },
    overallocated: { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/20', dot: 'bg-rose-400' },
    draft: { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700', dot: 'bg-slate-400' },
    planning: { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700', dot: 'bg-slate-400' },
  };

  const style = variantStyles[norm] || variantStyles['draft'];
  const displayLabel = label || status.replace(/_/g, ' ');

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span className="capitalize">{displayLabel}</span>
    </span>
  );
};
