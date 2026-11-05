import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getHomeRoute = () => {
    if (user?.role === 'ADMIN') return '/admin/dashboard';
    if (user?.role === 'EMPLOYEE') return '/employee/dashboard';
    return '/manager/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 bg-radial-gradient">
      <div className="glass-panel p-8 rounded-3xl border border-rose-500/30 bg-slate-900/90 max-w-md w-full text-center space-y-5 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">Access Forbidden (403)</span>
          <h1 className="text-xl font-extrabold text-white mt-1">Role Authorization Required</h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Your current account role (<strong className="text-slate-200 font-mono">{user?.role || 'ANONYMOUS'}</strong>) does not have authorization to view this resource.
          </p>
        </div>

        <button
          onClick={() => navigate(getHomeRoute())}
          className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-indigo transition flex items-center justify-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Authorized Dashboard</span>
        </button>
      </div>
    </div>
  );
};
