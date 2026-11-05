import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  BarChart3,
  User,
  Briefcase,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CandidateDetailsDrawer } from '../../components/manager/CandidateDetailsDrawer';
import { MOCK_DECISION_LOGS, MOCK_EMPLOYEES } from '../../data/mockData';
import { AllocationDecisionLog, Employee } from '../../types/workforce';

export const DecisionHistoryPage: React.FC = () => {
  const [logs] = useState<AllocationDecisionLog[]>(MOCK_DECISION_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredLogs = logs.filter(
    (l) =>
      l.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.allocation_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInspect = (employeeName: string) => {
    const found = MOCK_EMPLOYEES.find((e) => e.name === employeeName);
    if (found) {
      setSelectedEmployee(found);
      setIsDrawerOpen(true);
    }
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workforce-allocation-decision-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Allocation Decision Audit Trail"
        description="Immutable log of deterministic allocation scores, model signals, and human manager sign-offs."
        breadcrumbs={[
          { label: 'Manager Dashboard', path: '/manager/dashboard' },
          { label: 'Decision History' },
        ]}
        actions={
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center space-x-2"
          >
            <Download className="w-4 h-4 text-brand-400" />
            <span>Export Audit Trail (JSON)</span>
          </button>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Total Decisions Logged"
          value={logs.length}
          subtext="Durable DB Records"
          icon={<FileText className="w-5 h-5 text-brand-400" />}
        />
        <KpiCard
          title="Average Final Score"
          value="87.8%"
          subtext="Composite Ranking Score"
          icon={<BarChart3 className="w-5 h-5 text-emerald-400" />}
        />
        <KpiCard
          title="Governance Compliance"
          value="100%"
          subtext="All Records Manager-Approved"
          icon={<ShieldCheck className="w-5 h-5 text-cyan-400" />}
        />
        <KpiCard
          title="Active Model Version"
          value="v1.0.0"
          subtext="9-Feature Quantifier"
          icon={<Clock className="w-5 h-5 text-indigo-400" />}
        />
      </div>

      {/* Search and Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Historical Decision Records</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dual-written to `allocation_decisions` table upon manager approval.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project, employee, or ID..."
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Allocation ID & Time</th>
                <th className="pb-3 font-semibold">Project</th>
                <th className="pb-3 font-semibold">Assigned Engineer</th>
                <th className="pb-3 font-semibold">Role & Hours</th>
                <th className="pb-3 font-semibold font-mono">Score Breakdown</th>
                <th className="pb-3 font-semibold font-mono">Composite Score</th>
                <th className="pb-3 font-semibold">Approved By</th>
                <th className="pb-3 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4">
                    <div className="font-mono text-brand-400 font-bold">{log.allocation_id}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{log.created_at}</div>
                  </td>
                  <td className="py-4 font-semibold text-white">
                    <Link
                      to={`/manager/projects/${log.project_id}`}
                      className="hover:text-brand-400 transition"
                    >
                      {log.project_name}
                    </Link>
                  </td>
                  <td className="py-4">
                    <div className="font-semibold text-white">{log.employee_name}</div>
                    <div className="text-[10px] text-slate-400">{log.employee_id}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-white">{log.team_role || 'Core Specialist'}</div>
                    <div className="text-[11px] font-mono text-slate-400">{log.allocated_hours} hrs / week</div>
                  </td>
                  <td className="py-4 font-mono text-[11px] text-slate-400">
                    <div>F: {(log.fairness * 100).toFixed(0)}% • P: {(log.performance * 100).toFixed(0)}%</div>
                    <div>S: {(log.skill_score * 100).toFixed(0)}% • R: {(log.risk_score * 100).toFixed(0)}%</div>
                  </td>
                  <td className="py-4 font-extrabold font-mono text-brand-400 text-sm">
                    {(log.final_score * 100).toFixed(1)}%
                  </td>
                  <td className="py-4">
                    <div className="text-white text-xs">{log.approved_by}</div>
                    {log.manager_comment && (
                      <div className="text-[10px] text-slate-400 italic truncate max-w-xs">
                        "{log.manager_comment}"
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleInspect(log.employee_name)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Deep-Dive Drawer */}
      <CandidateDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        candidate={selectedEmployee}
      />
    </div>
  );
};
