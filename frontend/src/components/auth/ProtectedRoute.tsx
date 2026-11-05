import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, Loader2, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Wait for session resolution before evaluating access
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <h4 className="text-sm font-bold text-white">Validating Security Session</h4>
          <p className="text-xs text-slate-400">Verifying enterprise JWT credentials and role permissions...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Redirect to login preserving destination
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. User authenticated but missing role: Show profile setup required, DO NOT redirect to login
  if (!user.role) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl border border-amber-500/30 text-center max-w-md mx-auto space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <Badge variant="warning">Setup Required</Badge>
            <h3 className="text-lg font-bold text-white mt-2">Profile Setup Required</h3>
            <p className="text-xs text-slate-400 mt-1">
              Your account (<span className="text-slate-200 font-mono">{user.email}</span>) is authenticated, but no enterprise role has been assigned yet.
            </p>
          </div>
          <p className="text-[11px] text-slate-500">
            Please contact your platform administrator or HR manager to assign your role.
          </p>
        </div>
      </div>
    );
  }

  // 4. Role-Based Access Control check
  const isRoleAllowed = allowedRoles.includes(user.role);

  if (!isRoleAllowed) {
    const isEmployee = user.role === 'EMPLOYEE';
    const fallbackPath = isEmployee ? '/employee/dashboard' : '/manager/dashboard';
    const fallbackLabel = isEmployee ? 'Employee Portal' : 'Manager Portal';

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl border border-rose-500/30 bg-rose-950/10 text-center max-w-lg mx-auto space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex justify-center mb-1">
              <Badge variant="danger">RBAC Forbidden (403)</Badge>
            </div>
            <h3 className="text-lg font-bold text-white">Access Restricted</h3>
            <p className="text-xs text-slate-400 mt-1">
              Your active role is <span className="font-mono text-rose-300 font-semibold">{user.role}</span> ({user.name}).
              This route requires <span className="text-slate-200 font-semibold">{allowedRoles.join(' or ')}</span> privileges.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to={fallbackPath}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-indigo transition"
            >
              <span>Return to {fallbackLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
