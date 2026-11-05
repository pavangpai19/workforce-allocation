import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { MOCK_EMPLOYEE_NOTIFICATIONS } from '../../data/mockData';
import { EmployeeNotification } from '../../types/workforce';

export const EmployeeNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<EmployeeNotification[]>(MOCK_EMPLOYEE_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Employee Notifications & Activity Feed"
        description="Updates on allocation decisions, skill evidence verification, deadline reminders, and learning recommendations."
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'Notifications' },
        ]}
        actions={
          <button
            onClick={markAllRead}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            Mark All as Read
          </button>
        }
      />

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
              notif.is_read ? 'bg-slate-950/60 border-slate-800' : 'bg-brand-950/20 border-brand-500/30'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                  {!notif.is_read && (
                    <span className="w-2 h-2 rounded-full bg-brand-400" />
                  )}
                  <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300">{notif.description}</p>
              </div>
            </div>

            {notif.link && (
              <Link
                to={notif.link}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold shrink-0"
              >
                View
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
