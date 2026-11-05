import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Users,
  Ticket as TicketIcon,
  Bell,
  History,
  Settings,
  Layers,
  Send,
  Calendar,
  User,
  Shield,
  Sliders,
  Cpu,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeAlert?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}) => {
  const { user } = useAuth();
  const role: UserRole = user?.role || 'MANAGER';

  // Strict manager navigation
  const managerNav: NavItem[] = [
    { label: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/manager/projects', icon: FolderKanban },
    { label: 'Allocation Proposals', path: '/manager/proposals', icon: Sparkles, badge: 'Active' },
    { label: 'Team', path: '/manager/team', icon: Users },
    { label: 'Tickets', path: '/manager/tickets', icon: TicketIcon },
    { label: 'Alerts', path: '/manager/alerts', icon: Bell, badgeAlert: true },
    { label: 'Decision History', path: '/manager/decision-history', icon: History },
    { label: 'AI Architecture', path: '/manager/intelligence-pipeline', icon: Cpu, badge: 'ML' },
    { label: 'Settings', path: '/manager/settings', icon: Settings },
  ];

  // Strict employee navigation
  const employeeNav: NavItem[] = [
    { label: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { label: 'My Allocations', path: '/employee/allocations', icon: Layers },
    { label: 'Report Completion', path: '/employee/report-completion', icon: Send },
    { label: 'Availability', path: '/employee/availability', icon: Calendar },
    { label: 'My Profile', path: '/employee/profile', icon: User },
    { label: 'Settings', path: '/employee/settings', icon: Settings },
  ];

  // Admin navigation
  const adminNav: NavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Employees', path: '/admin/employees', icon: Users },
    { label: 'Skills', path: '/admin/skills', icon: Sparkles },
    { label: 'Roles', path: '/admin/roles', icon: Shield },
    { label: 'Alerts', path: '/admin/alerts', icon: Bell },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: History },
    { label: 'Decision Weights', path: '/admin/decision-weights', icon: Sliders },
    { label: 'Model Status', path: '/admin/model-status', icon: Cpu },
    { label: 'System Health', path: '/admin/system-health', icon: HeartPulse },
  ];

  const navItems = role === 'ADMIN' ? adminNav : role === 'EMPLOYEE' ? employeeNav : managerNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-slate-950 border-r border-slate-800/80 transition-all duration-300 flex flex-col ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo & Collapse Toggle */}
        {isCollapsed ? (
          <div className="h-16 flex items-center justify-center border-b border-slate-800/80">
            <button
              onClick={onToggleCollapse}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-glow-indigo flex-shrink-0 hover:scale-105 transition"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <Cpu className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-glow-indigo flex-shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="leading-tight truncate">
                <span className="font-extrabold text-sm text-white tracking-tight">
                  Workforce<span className="text-brand-400">IQ</span>
                </span>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                  {role} PORTAL
                </span>
              </div>
            </div>

            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center ${
                  isCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'
                } py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-glow-indigo'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center relative' : 'space-x-3 truncate'}`}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {isCollapsed && item.badgeAlert && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950" />
                )}
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && (
                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {item.badge}
                    </span>
                  )}
                  {item.badgeAlert && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Role Card & Expand/Collapse Toggle */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <button
            onClick={onToggleCollapse}
            className={`hidden lg:flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-start space-x-2'
            } w-full p-2 text-slate-400 hover:text-white hover:bg-slate-900/80 rounded-xl transition text-xs font-medium`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>

          <div
            className={`p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center ${
              isCollapsed ? 'justify-center' : 'space-x-3'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-brand-300 flex-shrink-0">
              {user?.name ? user.name[0] : 'U'}
            </div>
            {!isCollapsed && (
              <div className="truncate text-xs leading-tight">
                <span className="font-bold text-white block truncate">{user?.name}</span>
                <span className="text-[10px] text-slate-400 truncate block font-mono">{user?.role}</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
