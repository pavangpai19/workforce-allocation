import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { MOCK_LEARNING_GOALS } from '../../data/mockData';

export const EmployeeLearningPage: React.FC = () => {
  const goals = MOCK_LEARNING_GOALS;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Learning & Professional Growth Pathways"
        description="Upskilling courses and technical certifications aligned with high-priority organizational platform demand."
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'Learning' },
        ]}
        actions={
          <Link
            to="/employee/progress/new"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-glow-indigo transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Completed Course</span>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Active Goals"
          value={goals.filter((g) => g.status === 'IN_PROGRESS').length}
          subtext="In Progress"
          icon={<GraduationCap className="w-5 h-5 text-cyan-400" />}
        />
        <KpiCard
          title="High-Demand Skills"
          value="PySpark & Kafka"
          subtext="Organizational Gaps"
          icon={<Sparkles className="w-5 h-5 text-amber-400" />}
          variant="warning"
        />
        <KpiCard
          title="Completed Paths"
          value="4 Modules"
          subtext="Certified This Year"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          variant="healthy"
        />
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">{goal.category}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{goal.title}</h4>
                <p className="text-xs text-slate-400">{goal.provider} • Target Competency: {goal.target_skill}</p>
              </div>
              <span className="text-xs font-bold font-mono text-cyan-400">{goal.progress_pct}%</span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-cyan-400" style={{ width: `${goal.progress_pct}%` }} />
            </div>

            <div className="flex justify-between text-xs text-slate-400 pt-1">
              <span>Estimated: {goal.estimated_hours} hrs</span>
              <span>Target Completion: {goal.due_date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
