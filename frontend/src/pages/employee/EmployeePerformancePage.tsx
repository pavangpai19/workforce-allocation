import React from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Info,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';

export const EmployeePerformancePage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Personal Performance Telemetry & Delivery Quality"
        description="Objective delivery metrics calculated from milestone completions, code reviews, and SLA adherence."
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'Performance' },
        ]}
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KpiCard
          title="Efficiency"
          value="92%"
          subtext="Turnaround Cadence"
          icon={<Activity className="w-5 h-5 text-emerald-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Consistency"
          value="95%"
          subtext="Predictable Velocity"
          icon={<CheckCircle2 className="w-5 h-5 text-brand-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Reliability"
          value="94%"
          subtext="Milestone Quality"
          icon={<ShieldCheck className="w-5 h-5 text-cyan-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Availability"
          value="88%"
          subtext="Sprint Responsiveness"
          icon={<Clock className="w-5 h-5 text-indigo-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Workload Balance"
          value="85%"
          subtext="Optimal Zone"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          variant="healthy"
        />
      </div>

      <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
        <div className="flex items-center space-x-2 text-white font-bold">
          <Info className="w-4 h-4 text-brand-400" />
          <span>Performance Signal Methodology</span>
        </div>
        <p className="leading-relaxed">
          Performance scores reflect delivery velocity, quality of architecture deliverables, and verified peer code reviews. The system does NOT perform keystroke monitoring or surveillance. All metrics represent aggregated project outcome telemetry.
        </p>
      </div>
    </div>
  );
};
