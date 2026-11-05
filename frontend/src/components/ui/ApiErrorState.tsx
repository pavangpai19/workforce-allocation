import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export interface ApiErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ApiErrorState: React.FC<ApiErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="p-5 bg-rose-950/20 border border-rose-500/30 rounded-2xl flex items-center justify-between text-xs text-rose-300">
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
        <div>
          <span className="font-bold block text-white">System Error</span>
          <span>{message}</span>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
