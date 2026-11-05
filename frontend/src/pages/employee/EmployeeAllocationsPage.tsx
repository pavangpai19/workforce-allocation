import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Clock,
  Briefcase,
  CheckCircle2,
  Send,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { MOCK_EMPLOYEE_ALLOCATIONS } from '../../data/mockData';

export const EmployeeAllocationsPage: React.FC = () => {
  const allocations = MOCK_EMPLOYEE_ALLOCATIONS;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="My Allocation Schedule & Capacity Balance"
        description="Comprehensive weekly hours commitment, release states, and available bandwidth."
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'Allocations' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Total Weekly Capacity"
          value="40 hrs"
          subtext="Standard Bandwidth"
          icon={<Clock className="w-5 h-5 text-brand-400" />}
        />
        <KpiCard
          title="Currently Committed"
          value="25 hrs"
          subtext="62.5% Utilization"
          icon={<Layers className="w-5 h-5 text-emerald-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Available Bandwidth"
          value="15 hrs"
          subtext="Open for New Assignments"
          icon={<CheckCircle2 className="w-5 h-5 text-cyan-400" />}
        />
        <KpiCard
          title="Active Projects"
          value="2 Projects"
          subtext="Cloud Modernization & Security"
          icon={<Briefcase className="w-5 h-5 text-indigo-400" />}
        />
      </div>

      <div className="space-y-4">
        {allocations.map((alloc) => (
          <div key={alloc.project_id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-white">{alloc.project_name}</h4>
                <p className="text-xs text-brand-400 font-mono mt-0.5">{alloc.role} • {alloc.allocated_hours}h / wk</p>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                {alloc.status}
              </span>
            </div>
            <p className="text-xs text-slate-400">Scheduled Sprint Deadline: {alloc.deadline}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
