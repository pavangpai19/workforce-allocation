import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  LogOut,
  ShieldCheck,
  User,
  AlertTriangle,
  Sparkles,
  CheckCheck,
  ExternalLink,
  Info,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface TopNavProps {
  onMobileMenuOpen: () => void;
  isSidebarCollapsed: boolean;
}

interface TransientNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'ticket' | 'proposal' | 'milestone' | 'system';
  is_read: boolean;
  link?: string;
}

const INITIAL_TRANSIENT_NOTIFICATIONS: TransientNotification[] = [
  {
    id: 'notif-1',
    title: 'Ticket TCK-402 in Review',
    description: 'David Zhang submitted completion evidence for Kafka DLQ implementation.',
    timestamp: '12m ago',
    type: 'ticket',
    is_read: false,
    link: '/manager/tickets/TCK-402',
  },
  {
    id: 'notif-2',
    title: 'Proposal Formed for Cloud Migration',
    description: 'Deterministic allocation generated candidate rankings for 2 vacant slots.',
    timestamp: '45m ago',
    type: 'proposal',
    is_read: false,
    link: '/manager/proposals/prop-101',
  },
  {
    id: 'notif-3',
    title: 'Sprint Milestone Reached',
    description: 'Sprint 24 velocity achieved 94% on-time milestone delivery.',
    timestamp: '2h ago',
    type: 'milestone',
    is_read: true,
  },
  {
    id: 'notif-4',
    title: 'ML Inference Health Check',
    description: '9 feature vectors registered, model latency optimal at 42ms.',
    timestamp: '5h ago',
    type: 'system',
    is_read: true,
  },
];

export const TopNav: React.FC<TopNavProps> = ({ onMobileMenuOpen, isSidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<TransientNotification[]>(INITIAL_TRANSIENT_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close popovers on route change
  useEffect(() => {
    setIsNotificationsOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Handle outside clicks and Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNotificationsOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleNotificationClick = (item: TransientNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
    );
    if (item.link) {
      setIsNotificationsOpen(false);
      navigate(item.link);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const rolePrefix = user?.role === 'EMPLOYEE' ? '/employee' : '/manager';

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 min-w-[36px] min-h-[36px] flex items-center justify-center transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="relative hidden md:block w-72 lg:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search projects, skills, employees, tickets..."
            className="w-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs rounded-xl pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-brand-500 transition"
          />
        </div>
      </div>

      {/* Right: Telemetry pill, Notifications, User Menu */}
      <div className="flex items-center space-x-3">
        {/* Backend & ML Status Indicator */}
        <div className="hidden xl:flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400">ML Engine:</span>
          <span className="font-semibold text-emerald-400">9 Features Active</span>
        </div>

        {/* Notifications Popover Trigger */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl relative transition min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-slate-950">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Window */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-white block">Event Notifications</span>
                  <span className="text-[10px] text-slate-400">Workflow updates & status changes</span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-1 px-2 py-1 rounded hover:bg-brand-500/10 transition"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-2.5 rounded-xl border text-xs space-y-1 transition cursor-pointer ${
                        item.is_read
                          ? 'bg-slate-950/40 border-slate-800/60 opacity-75 hover:opacity-100 hover:bg-slate-800/40'
                          : 'bg-slate-950/90 border-brand-500/30 hover:border-brand-500/60'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className={`font-bold truncate ${item.is_read ? 'text-slate-300' : 'text-white'}`}>
                          {item.title}
                        </span>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                          {!item.is_read && (
                            <span className="w-2 h-2 rounded-full bg-brand-400" />
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{item.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                    No notifications right now.
                  </div>
                )}
              </div>

              {/* Distinction Footer: Link to Full Operational Alerts */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Looking for capacity alerts?</span>
                <Link
                  to={`${rolePrefix}/alerts`}
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-1"
                >
                  <span>Go to Alerts Hub</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Menu & Role */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-900 transition min-h-[36px]"
            aria-label="User profile menu"
            aria-expanded={isUserMenuOpen}
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-brand-300">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div className="hidden sm:block text-left text-xs max-w-[120px] truncate">
              <span className="font-bold text-white block leading-tight truncate">{user?.name}</span>
              <span className="text-[10px] uppercase font-semibold text-brand-400 bg-brand-500/10 px-1.5 py-0.2 rounded inline-block truncate">
                {user?.role}
              </span>
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn text-xs">
              <div className="p-2 border-b border-slate-800 mb-1">
                <span className="font-bold text-white block truncate">{user?.name}</span>
                <span className="text-slate-400 text-[11px] block truncate">{user?.email}</span>
                <span className="inline-block mt-1 text-[10px] font-mono text-emerald-400">
                  Role: {user?.role} (JWT Validated)
                </span>
              </div>
              <Link
                to={user?.role === 'EMPLOYEE' ? '/employee/profile' : '/manager/settings'}
                onClick={() => setIsUserMenuOpen(false)}
                className="w-full flex items-center space-x-2 p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition font-medium"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Account Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 p-2 text-rose-300 hover:bg-rose-950/30 rounded-xl transition font-medium mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
