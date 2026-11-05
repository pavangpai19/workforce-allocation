import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  AlertTriangle,
  Flame,
  Clock,
  Layers,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { MOCK_ALERTS } from '../../data/mockData';
import { SystemAlert } from '../../types/workforce';

export const AlertsCenterPage: React.FC = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>(MOCK_ALERTS);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter((a) => a.severity === 'WARNING').length;
  const staffingGapsCount = alerts.filter((a) => a.type === 'STAFFING_GAP').length;
  const burnoutRisksCount = alerts.filter((a) => a.type === 'BURNOUT_RISK').length;

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchesSeverity = selectedSeverity === 'ALL' || a.severity === selectedSeverity;
    const matchesType = selectedType === 'ALL' || a.type === selectedType;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Manager Alerts & Workforce Signals"
        description="Real-time monitoring of team burnout risks, unstaffed project slots, upcoming deadlines, and hiring demands."
        breadcrumbs={[
          { label: 'Manager Dashboard', path: '/manager/dashboard' },
          { label: 'Alerts Center' },
        ]}
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Active Alerts"
          value={alerts.length}
          subtext={`${criticalCount} Critical • ${warningCount} Warnings`}
          icon={<Bell className="w-5 h-5 text-brand-400" />}
        />
        <KpiCard
          title="Burnout Risks"
          value={burnoutRisksCount}
          subtext="Engineers > 85% utilization"
          icon={<Flame className="w-5 h-5 text-rose-400" />}
        />
        <KpiCard
          title="Staffing Gaps"
          value={staffingGapsCount}
          subtext="Projects with unfilled slots"
          icon={<Layers className="w-5 h-5 text-amber-400" />}
        />
        <KpiCard
          title="Upcoming Deadlines"
          value={1}
          subtext="Projects due in < 14 days"
          icon={<Clock className="w-5 h-5 text-cyan-400" />}
        />
      </div>

      {/* Filters Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alerts..."
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-52"
            />
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="WARNING">Warnings</option>
            <option value="INFO">Informational</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Types</option>
            <option value="BURNOUT_RISK">Burnout Risks</option>
            <option value="STAFFING_GAP">Staffing Gaps</option>
            <option value="DEADLINE">Deadlines</option>
            <option value="HIRING_SIGNAL">Hiring Signals</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">Showing {filteredAlerts.length} alerts</span>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isCrit = alert.severity === 'CRITICAL';
          const isWarn = alert.severity === 'WARNING';

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition flex items-start justify-between gap-4 ${
                isCrit
                  ? 'bg-rose-500/10 border-rose-500/30 shadow-glow-rose'
                  : isWarn
                  ? 'bg-amber-500/10 border-amber-500/20'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div
                  className={`p-2.5 rounded-xl border mt-0.5 ${
                    isCrit
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : isWarn
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-brand-500/20 text-brand-400 border-brand-500/30'
                  }`}
                >
                  {alert.type === 'BURNOUT_RISK' ? (
                    <Flame className="w-5 h-5" />
                  ) : alert.type === 'STAFFING_GAP' ? (
                    <Layers className="w-5 h-5" />
                  ) : alert.type === 'DEADLINE' ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <UserPlus className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-white">{alert.title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isCrit
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : isWarn
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {alert.link && (
                  <Link
                    to={alert.link}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition flex items-center space-x-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white text-xs font-semibold hover:bg-slate-800 rounded-lg transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
