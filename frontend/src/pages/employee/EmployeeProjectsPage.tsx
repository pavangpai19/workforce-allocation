import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Layers,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { MOCK_EMPLOYEE_ALLOCATIONS } from '../../data/mockData';

export const EmployeeProjectsPage: React.FC = () => {
  const allocations = MOCK_EMPLOYEE_ALLOCATIONS;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="My Project Allocations & Sprints"
        description="Assigned engineering roles, capacity commitments, sprint deliverables, and release status."
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'Projects' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Active Allocations"
          value={allocations.length}
          subtext="2 Sprints Committed"
          icon={<Briefcase className="w-5 h-5 text-brand-400" />}
        />
        <KpiCard
          title="Total Weekly Hours"
          value="25 hrs / wk"
          subtext="62.5% Workload Utilization"
          icon={<Clock className="w-5 h-5 text-emerald-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Release Pending"
          value="1 Project"
          subtext="Identity Guardrails"
          icon={<CheckCircle2 className="w-5 h-5 text-cyan-400" />}
        />
      </div>

      <div className="space-y-4">
        {allocations.map((alloc) => (
          <div key={alloc.project_id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white">{alloc.project_name}</h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 font-mono border border-brand-500/20">
                    {alloc.domain}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Role: <strong className="text-white">{alloc.role}</strong> • {alloc.allocated_hours} hrs/wk ({alloc.allocated_pct}%) • Deadline: {alloc.deadline}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                  {alloc.status}
                </span>
                <Link
                  to={`/employee/projects/${alloc.project_id}`}
                  className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-glow-indigo transition flex items-center space-x-1"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Milestone Progress</span>
                <span>{alloc.progress_pct}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${alloc.progress_pct}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
