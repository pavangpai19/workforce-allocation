import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Eye,
  FileText,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { MOCK_AUDIT_LOGS } from '../../data/mockData';
import { SystemAuditLog } from '../../types/workforce';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SystemAuditLog[]>(MOCK_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<SystemAuditLog | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || log.action_type === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Immutable System Audit Trail"
        description="Comprehensive immutable record of allocation approvals, score snapshots, weight adjustments, and security role modifications."
        breadcrumbs={[{ label: 'Admin Console', path: '/admin/dashboard' }, { label: 'Audit Logs' }]}
      />

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit records..."
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-64"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Action Types</option>
            <option value="PROPOSAL_APPROVED">Proposal Approved</option>
            <option value="PROPOSAL_GENERATED">Proposal Generated</option>
            <option value="WEIGHTS_UPDATED">Weights Updated</option>
            <option value="ROLE_CHANGED">Role Changed</option>
            <option value="EVIDENCE_VERIFIED">Evidence Verified</option>
            <option value="RELEASE_APPROVED">Release Approved</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredLogs.length} audit entries
        </span>
      </div>

      {/* Audit Logs Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Log ID & Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Scope & Reference</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-brand-400 font-bold">{log.id}</div>
                    <div className="font-mono text-[10px] text-slate-500">{log.timestamp}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{log.actor_name}</div>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                      {log.actor_role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-white text-[11px] block">
                      {log.action_type.replace(/_/g, ' ')}
                    </span>
                    {log.model_version && (
                      <span className="text-[10px] text-brand-400 font-mono">{log.model_version}</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {log.project_name && (
                      <div className="text-white font-semibold line-clamp-1">{log.project_name}</div>
                    )}
                    {log.employee_name && (
                      <div className="text-[10px] text-slate-400">Target: {log.employee_name}</div>
                    )}
                    {log.proposal_id && (
                      <div className="font-mono text-[10px] text-indigo-400">{log.proposal_id}</div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{log.details}</p>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                      title="Inspect Snapshot"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot Modal */}
      {selectedLog && (
        <ConfirmationDialog
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          onConfirm={() => setSelectedLog(null)}
          title={`Audit Snapshot: ${selectedLog.id}`}
          message={`Full audit trail telemetry captured at ${selectedLog.timestamp} by ${selectedLog.actor_name}.`}
          confirmLabel="Close Inspector"
          variant="primary"
        >
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2 max-h-80 overflow-y-auto">
            <div><strong>Action:</strong> {selectedLog.action_type}</div>
            <div><strong>Actor ID:</strong> {selectedLog.actor_id} ({selectedLog.actor_role})</div>
            {selectedLog.project_name && <div><strong>Project:</strong> {selectedLog.project_name}</div>}
            {selectedLog.employee_name && <div><strong>Employee:</strong> {selectedLog.employee_name}</div>}
            {selectedLog.score_snapshot_ref && <div><strong>Score Snapshot Ref:</strong> {selectedLog.score_snapshot_ref}</div>}
            {selectedLog.model_version && <div><strong>Model Version:</strong> {selectedLog.model_version}</div>}
            {selectedLog.previous_state && <div><strong>Previous State:</strong> {selectedLog.previous_state}</div>}
            {selectedLog.new_state && <div><strong>New State:</strong> {selectedLog.new_state}</div>}
            <div className="pt-2 border-t border-slate-800 text-slate-400">
              <strong>Description:</strong> {selectedLog.details}
            </div>
          </div>
        </ConfirmationDialog>
      )}
    </div>
  );
};
