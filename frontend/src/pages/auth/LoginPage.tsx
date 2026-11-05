import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, Cpu, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, quickLogin, user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [redirectingRole, setRedirectingRole] = useState<string | null>(null);

  // If already authenticated and not loading, redirect directly to role dashboard
  if (!isLoading && isAuthenticated && user) {
    const target = user.role === 'EMPLOYEE' ? '/employee/dashboard' : '/manager/dashboard';
    return <Navigate to={target} replace />;
  }

  const handleSuccessfulAuth = (authenticatedUser: { role: UserRole }) => {
    const target = authenticatedUser.role === 'EMPLOYEE' ? '/employee/dashboard' : '/manager/dashboard';
    setRedirectingRole(authenticatedUser.role);
    setTimeout(() => {
      navigate(target, { replace: true });
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const loggedUser = await login(email, password);
      handleSuccessfulAuth(loggedUser);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your enterprise credentials.');
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setErrorMsg('');
    try {
      const loggedUser = await quickLogin(role);
      handleSuccessfulAuth(loggedUser);
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 bg-radial-gradient">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 items-center justify-center font-bold text-white shadow-glow-indigo">
            <Cpu className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Workforce<span className="text-brand-400">IQ</span>
          </h1>
          <p className="text-xs text-slate-400">
            Enterprise Workforce Intelligence & Allocation Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-glass space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white">Enterprise Sign In</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your corporate credentials. Access is governed by verified backend role permissions.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {redirectingRole && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center space-x-2 animate-fadeIn">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>JWT verified &bull; Navigating to <strong className="uppercase">{redirectingRole}</strong> portal...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena.rostova@workforce.example or devansh.sharma@workforce.example"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-brand-400 hover:text-brand-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="remember-me" className="ml-2 text-xs text-slate-400">
                Remember this workstation for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !!redirectingRole}
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-glow-indigo transition flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In with JWT'}</span>
            </button>
          </form>

          {/* Quick Demo Role Switcher */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Quick Role Testing</span>
              </span>
              <span className="text-[10px] text-slate-500">Click to switch</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('MANAGER')}
                className="p-2 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition flex flex-col"
              >
                <span className="font-bold text-slate-200">Manager</span>
                <span className="text-[10px] text-slate-500 truncate">elena.rostova@...</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('EMPLOYEE')}
                className="p-2 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition flex flex-col"
              >
                <span className="font-bold text-slate-200">Employee</span>
                <span className="text-[10px] text-slate-500 truncate">devansh.sharma@...</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                className="p-2 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition flex flex-col"
              >
                <span className="font-bold text-slate-200">Admin</span>
                <span className="text-[10px] text-slate-500 truncate">alex.rivera@...</span>
              </button>
            </div>
          </div>

          {/* Secure Sign-in Language */}
          <div className="pt-2 flex items-center space-x-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Protected by end-to-end encrypted JWT session validation & RBAC security policies.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
