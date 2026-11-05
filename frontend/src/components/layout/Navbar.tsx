import React, { useState } from 'react';
import { LayoutDashboard, Users, Cpu, ShieldCheck, Activity, LogIn, LogOut, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoginModal } from '../auth/LoginModal';

interface NavbarProps {
  activeTab: 'manager' | 'employee';
  onTabChange: (tab: 'manager' | 'employee') => void;
  selectedEmployeeName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  selectedEmployeeName,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-glow-indigo text-white font-bold text-lg">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Workforce<span className="text-brand-400">IQ</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                  v2.0
                </span>
              </span>
              <p className="text-xs text-slate-400 hidden sm:block">Intelligent Allocation & Quantifier Engine</p>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onTabChange('manager')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'manager'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Manager Dashboard</span>
            </button>
            <button
              onClick={() => onTabChange('employee')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'employee'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Employee Hub</span>
            </button>
          </div>

          {/* Engine Status & Profile */}
          <div className="flex items-center space-x-3">
            
            {/* Status Badges */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400">Backend API:</span>
              <span className="font-semibold text-emerald-400">Port 3001 Connected</span>
            </div>

            {/* Auth User Info & Login / Logout Button */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-brand-300">
                  {user.role === 'ADMIN' ? 'AD' : user.role === 'MANAGER' ? 'MG' : 'EP'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                    <span>{user.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      user.role === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-300' :
                      user.role === 'MANAGER' ? 'bg-brand-500/20 text-brand-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {user.email}
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-glow-indigo transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={() => setIsLoginModalOpen(true)}
              title="Switch RBAC Role"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <KeyRound className="w-4 h-4 text-slate-400" />
            </button>

          </div>

        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};
