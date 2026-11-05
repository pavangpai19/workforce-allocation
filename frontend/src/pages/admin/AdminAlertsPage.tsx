import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  Clock,
  UserCheck,
  CheckCircle2,
  Filter,
  Search,
  Send,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { MOCK_ALERTS, MOCK_EMPLOYEES } from '../../data/mockData';
import { SystemAlert } from '../../types/workforce';

export const AdminAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>(MOCK_ALERTS);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState<SystemAlert | null>(null);
  const [assignee, setAssignee] = useState(MOCK_EMPLOYEES[0].name);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredAlerts = alerts.filter((a) => {
    const matchesType = typeFilter === 'ALL' || a.type === typeFilter;
    const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    return matchesType && matchesSeverity;
  });

  const handleAcknowledge = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
    setActionSuccess('Alert acknowledged.');
  };

  const handleResolve = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'RESOLVED' } : a))
    );
    setActionSuccess('Alert resolved.');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Enterprise Alert & Anomaly Management"
        description="Monitor system-wide burnout warnings, capacity bottlenecks, staffing gap alerts, and hiring signals."
        breadcrumbs={[{ label: 'Admin Console', path: '/admin/dashboard' }, { label: 'Alerts' }]}
      />

      {actionSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 text-xs text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Alert Types</option>
            <option value="BURNOUT_RISK">Burnout Risk</option>
            <option value="CAPACITY">Capacity Overload</option>
            <option value="STAFFING_GAP">Staffing Gap</option>
            <option value="DEADLINE">Deadline Risk</option>
            <option value="HIRING_SIGNAL">Hiring Signal</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {filteredAlerts.length} Alerts Tracked
        </span>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              alert.severity === 'CRITICAL'
                ? 'bg-rose-950/20 border-rose-500/40 shadow-glow-rose'
                : 'glass-panel border-slate-800'
            }`}
          >
            <div className="flex items-start space-x-3.5">
              <div className="mt-0.5">
                {alert.severity === 'CRITICAL' ? (
                  <AlertOctagon className="w-5 h-5 text-rose-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-xs">{alert.title}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {alert.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 max-w-3xl leading-relaxed">{alert.description}</p>
                <span className="text-[10px] text-slate-500 font-mono block pt-1">
                  Detected: {alert.timestamp}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end md:self-center">
              {alert.status !== 'RESOLVED' && (
                <>
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-glow-emerald transition flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve</span>
                  </button>
                </>
              )}
              {alert.status === 'RESOLVED' && (
                <span className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  Resolved
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
