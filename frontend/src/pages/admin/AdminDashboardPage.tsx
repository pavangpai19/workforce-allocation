import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FolderKanban,
  AlertTriangle,
  FileCheck,
  Sparkles,
  History,
  Cpu,
  HeartPulse,
  Sliders,
  Shield,
  Award,
  TrendingUp,
  Clock,
  ArrowRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import {
  MOCK_EMPLOYEES,
  MOCK_PROJECTS,
  MOCK_ALERTS,
  MOCK_AUDIT_LOGS,
  MOCK_MODEL_TELEMETRY,
  MOCK_SYSTEM_HEALTH,
  MOCK_PROPOSALS,
} from '../../data/mockData';
import { ServiceHealthStatus, ModelTelemetry, SystemAuditLog } from '../../types/workforce';

export const AdminDashboardPage: React.FC = () => {
  const totalEmployees = MOCK_EMPLOYEES.length;
  const totalCapacity = MOCK_EMPLOYEES.reduce((acc, e) => acc + e.weekly_capacity_hours, 0);
  const totalAllocated = MOCK_EMPLOYEES.reduce((acc, e) => acc + e.allocated_hours, 0);
  const avgUtilization = Math.round((totalAllocated / totalCapacity) * 100);

  const activeProjects = MOCK_PROJECTS.filter((p) => p.status === 'ACTIVE').length;
  const staffingGapsCount = MOCK_PROJECTS.filter((p) => p.staffing_state === 'STAFFING_GAPS').length;
  const criticalAlerts = MOCK_ALERTS.filter((a) => a.severity === 'CRITICAL').length;
  const pendingProposalsCount = MOCK_PROPOSALS.filter((p) => p.status === 'PENDING_APPROVAL').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Admin Control Center"
        description="System-wide workforce governance, model status, decision weights, and operational telemetry."
        breadcrumbs={[{ label: 'Admin Console', path: '/admin/dashboard' }, { label: 'Overview' }]}
        actions={
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/decision-weights"
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Decision Weights</span>
            </Link>
            <Link
              to="/admin/system-health"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-glow-emerald transition flex items-center space-x-1.5"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>System Health</span>
            </Link>
          </div>
        }
      />

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Workforce"
          value={totalEmployees}
          subtext={`${totalAllocated}h / ${totalCapacity}h Capacity (${avgUtilization}% Utilized)`}
          icon={<Users className="w-5 h-5 text-brand-400" />}
        />
        <KpiCard
          title="Active Projects"
          value={activeProjects}
          subtext={`${staffingGapsCount} Projects with Staffing Gaps`}
          icon={<FolderKanban className="w-5 h-5 text-cyan-400" />}
          variant={staffingGapsCount > 0 ? 'warning' : 'healthy'}
        />
        <KpiCard
          title="System Alerts"
          value={MOCK_ALERTS.length}
          subtext={`${criticalAlerts} Critical Burnout / Capacity Alerts`}
          icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
          variant={criticalAlerts > 0 ? 'critical' : 'default'}
        />
        <KpiCard
          title="Pending Proposals"
          value={pendingProposalsCount}
          subtext="Awaiting Manager Sign-off"
          icon={<Sparkles className="w-5 h-5 text-indigo-400" />}
        />
      </div>

      {/* System Status & ML Telemetry Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ML Model Status Summary */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-bold text-white">ML Model Runtime</h3>
            </div>
            <Link to="/admin/model-status" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_MODEL_TELEMETRY.map((mod: ModelTelemetry) => (
              <div key={mod.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{mod.name}</span>
                    <span className="font-mono text-[10px] text-brand-400">{mod.version}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">P95: {mod.latency_p95_ms}ms • Throughput: {mod.inference_throughput_rps} rps</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {mod.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure Health Summary */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Infrastructure Health</h3>
            </div>
            <Link to="/admin/system-health" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-1">
              <span>Diagnostics</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_SYSTEM_HEALTH.services.map((srv: ServiceHealthStatus) => (
              <div key={srv.name} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-white">{srv.name}</h5>
                  <span className="text-[10px] text-slate-400">Uptime: {srv.uptime_pct}% • Latency: {srv.latency_ms}ms</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {srv.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Admin Navigation */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Governance & Configuration</h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              to="/admin/employees"
              className="p-3 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 rounded-xl transition text-left group"
            >
              <Users className="w-4 h-4 text-cyan-400 mb-1.5 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-white">Employees</div>
              <div className="text-[10px] text-slate-400">Manage roles & RBAC</div>
            </Link>

            <Link
              to="/admin/skills"
              className="p-3 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 rounded-xl transition text-left group"
            >
              <Award className="w-4 h-4 text-amber-400 mb-1.5 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-white">Skills Catalogue</div>
              <div className="text-[10px] text-slate-400">Proficiency matrix</div>
            </Link>

            <Link
              to="/admin/roles"
              className="p-3 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 rounded-xl transition text-left group"
            >
              <Shield className="w-4 h-4 text-purple-400 mb-1.5 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-white">Role Matrix</div>
              <div className="text-[10px] text-slate-400">Permissions & policy</div>
            </Link>

            <Link
              to="/admin/audit-logs"
              className="p-3 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 rounded-xl transition text-left group"
            >
              <History className="w-4 h-4 text-emerald-400 mb-1.5 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-white">Audit Logs</div>
              <div className="text-[10px] text-slate-400">Immutable trace</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent System Audit Events */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-white">Recent System & Audit Events</h3>
          </div>
          <Link to="/admin/audit-logs" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-1">
            <span>View Full Log Stream</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-slate-800/80">
          {MOCK_AUDIT_LOGS.slice(0, 4).map((log: SystemAuditLog) => (
            <div key={log.id} className="py-3 flex items-start justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] text-brand-400 font-bold">{log.id}</span>
                  <span className="font-bold text-white">{log.action_type.replace(/_/g, ' ')}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {log.actor_name} ({log.actor_role})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{log.details}</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap ml-4">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
