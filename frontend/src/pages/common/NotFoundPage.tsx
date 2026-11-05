import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const NotFoundPage: React.FC = () => {
  const { user } = useAuth();
  const dashboardPath = user?.role === 'EMPLOYEE' ? '/employee/dashboard' : '/manager/dashboard';
  const dashboardLabel = user?.role === 'EMPLOYEE' ? 'Employee Dashboard' : 'Manager Dashboard';

  return (
    <div className="min-h-[65vh] flex items-center justify-center p-4">
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <FileQuestion className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Page Not Found (404)</h3>
          <p className="text-xs text-slate-400 mt-1">
            The requested page does not exist or has been moved to another location.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to={dashboardPath}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-indigo transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to {dashboardLabel}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
