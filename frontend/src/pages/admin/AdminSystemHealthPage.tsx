import React from 'react';
import {
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Server,
  Database,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { MOCK_SYSTEM_HEALTH } from '../../data/mockData';
import { ServiceHealthStatus } from '../../types/workforce';

export const AdminSystemHealthPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Enterprise System Health & Service Telemetry"
        description="Real-time uptime monitoring, API latencies, database pools, and diagnostic error logs."
        breadcrumbs={[{ label: 'Admin Console', path: '/admin/dashboard' }, { label: 'System Health' }]}
      />

      {/* Global Status Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 shadow-glow-emerald">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">All Core Services Fully Operational</h3>
            <p className="text-xs text-slate-400 mt-0.5">Continuous telemetry checks passing across REST, ML inference, DB, and Cron schedulers.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
          <div>Last Prediction: <strong className="text-white">{MOCK_SYSTEM_HEALTH.last_successful_prediction}</strong></div>
        </div>
      </div>

      {/* Services Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_SYSTEM_HEALTH.services.map((srv: ServiceHealthStatus) => (
          <div key={srv.name} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-brand-400" />
                <h4 className="text-xs font-bold text-white">{srv.name}</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono">
                {srv.status}
              </span>
            </div>

            <p className="text-[11px] text-slate-400">{srv.details}</p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono">
              <div>
                <span className="text-slate-500 block">Uptime</span>
                <span className="text-slate-200 font-bold">{srv.uptime_pct}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">Latency</span>
                <span className="text-slate-200 font-bold">{srv.latency_ms} ms</span>
              </div>
              <div>
                <span className="text-slate-500 block">Heartbeat</span>
                <span className="text-slate-200 font-bold">{srv.last_heartbeat}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Diagnostic Error Logs Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Diagnostic & Warning Event Stream</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3">Endpoint / Resource</th>
                <th className="py-2.5 px-3">Diagnostic Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {MOCK_SYSTEM_HEALTH.recent_error_logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-2.5 px-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-3 text-white font-semibold">{log.service}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        log.level === 'WARN'
                          ? 'bg-amber-500/10 text-amber-400'
                          : log.level === 'ERROR'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-brand-300">{log.endpoint || '-'}</td>
                  <td className="py-2.5 px-3 text-slate-300">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
