import React, { useState } from 'react';
import { Shield, Lock, Mail, CheckCircle2, UserCheck, X } from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, quickLogin, isLoading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    }
  };

  const handleQuick = async (role: UserRole) => {
    await quickLogin(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-md bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-glass overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-indigo-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-glow-indigo">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Workforce Platform Auth</h3>
              <p className="text-xs text-slate-400">Role-Based Access Control (RBAC)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Preset Quick Login Buttons */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Instant Demo RBAC Roles
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuick('MANAGER')}
                className="p-2.5 rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-300 hover:bg-brand-600 hover:text-white transition font-medium text-center"
              >
                <div className="font-bold text-xs">Manager</div>
                <div className="text-[10px] opacity-75">Full Decision Access</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuick('ADMIN')}
                className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition font-medium text-center"
              >
                <div className="font-bold text-xs">Admin</div>
                <div className="text-[10px] opacity-75">All Permissions</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuick('EMPLOYEE')}
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition font-medium text-center"
              >
                <div className="font-bold text-xs">Employee</div>
                <div className="text-[10px] opacity-75">Hub & Feedback</div>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-slate-500 text-[10px] uppercase font-semibold">or login with email</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {errorMsg && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@workforce.io"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition shadow-glow-indigo mt-2 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating...' : 'Sign In with JWT'}</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
