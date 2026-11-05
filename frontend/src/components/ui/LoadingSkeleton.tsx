import React from 'react';

export interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'text';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 3 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
          <div className="h-4 bg-slate-800 rounded w-1/3" />
          <div className="h-3 bg-slate-800/60 rounded w-2/3" />
          <div className="h-2 bg-slate-800/40 rounded w-full mt-2" />
        </div>
      ))}
    </div>
  );
};
