import React, { useState } from 'react';
import {
  Settings,
  Clock,
  Briefcase,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';

export const EmployeeSettingsPage: React.FC = () => {
  const [capacity, setCapacity] = useState(40);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Employee Preferences & Profile Settings"
        description="Configure target weekly capacity, preferred project domains, and notification channels."
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'Settings' },
        ]}
      />

      {saved && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 max-w-2xl">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 uppercase">Target Weekly Capacity (Hours)</label>
          <input
            type="number"
            min={10}
            max={50}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase block">Notification Preferences</label>
          <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-brand-500 focus:ring-brand-500"
            />
            <span>Receive email notifications for new project allocations & evidence reviews</span>
          </label>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            type="submit"
            className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-glow-indigo transition"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
