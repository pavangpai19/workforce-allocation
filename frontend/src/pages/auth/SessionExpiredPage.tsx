import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, LogIn } from 'lucide-react';

export const SessionExpiredPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 bg-radial-gradient">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-slate-900/90 max-w-md w-full text-center space-y-5 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
          <Clock className="w-7 h-7" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Session Inactive</span>
          <h1 className="text-xl font-extrabold text-white mt-1">Session Expired</h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Your secure JWT token has expired. Please re-authenticate with your enterprise credentials.
          </p>
        </div>

        <Link
          to="/login"
          className="inline-flex w-full py-3 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-indigo transition items-center justify-center space-x-2"
        >
          <LogIn className="w-4 h-4" />
          <span>Re-authenticate at Sign In</span>
        </Link>
      </div>
    </div>
  );
};
