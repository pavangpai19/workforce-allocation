import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Award,
  Layers,
  CheckCircle2,
  Calendar,
  ExternalLink,
  GitPullRequest,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { ContributionActivityMap } from '../../components/employee/ContributionActivityMap';
import {
  MOCK_EMPLOYEES,
  MOCK_EMPLOYEE_SKILLS,
  MOCK_EMPLOYEE_ALLOCATIONS,
  MOCK_EVIDENCE_HISTORY,
} from '../../data/mockData';

export const EmployeePortfolioPage: React.FC = () => {
  const employee = MOCK_EMPLOYEES[0];
  const skills = MOCK_EMPLOYEE_SKILLS;
  const allocations = MOCK_EMPLOYEE_ALLOCATIONS;
  const evidenceList = MOCK_EVIDENCE_HISTORY;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Engineering Portfolio & Verified Deliverables"
        description="Chronological record of completed project initiatives, assigned roles, architecture contributions, and credentials."
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'Portfolio' },
        ]}
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Completed Projects"
          value="8 Sprints"
          subtext="100% On-Time Delivery"
          icon={<Briefcase className="w-5 h-5 text-brand-400" />}
        />
        <KpiCard
          title="Verified Artifacts"
          value={evidenceList.length}
          subtext="Certificates & Repositories"
          icon={<Award className="w-5 h-5 text-emerald-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Story Points Shipped"
          value="184 SP"
          subtext="Q1–Q3 Engineering Volume"
          icon={<Layers className="w-5 h-5 text-cyan-400" />}
        />
        <KpiCard
          title="Architecture Commits"
          value="42 PRs"
          subtext="Peer Reviewed & Merged"
          icon={<GitPullRequest className="w-5 h-5 text-indigo-400" />}
        />
      </div>

      {/* Heatmap */}
      <ContributionActivityMap title="Engineering Contribution History" />

      {/* Projects Showcase */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-brand-400" />
          <span>Major Project Contributions & Assigned Roles</span>
        </h3>

        <div className="space-y-4">
          {allocations.map((alloc) => (
            <div key={alloc.project_id} className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{alloc.project_name}</h4>
                  <p className="text-xs text-brand-400 font-mono mt-0.5">Role: {alloc.role} • {alloc.domain}</p>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {alloc.status}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Shipped Sprint Tickets:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {alloc.assigned_tickets.map((t) => (
                    <div key={t.id} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                      <div className="flex justify-between items-center text-[10px] text-brand-400 font-mono">
                        <span>{t.id}</span>
                        <span className="text-emerald-400">{t.status}</span>
                      </div>
                      <h6 className="font-semibold text-white truncate mt-1">{t.title}</h6>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
