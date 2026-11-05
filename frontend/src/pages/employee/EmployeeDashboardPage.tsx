import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Briefcase,
  Layers,
  Award,
  Sparkles,
  AlertTriangle,
  Send,
  Calendar,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  FileCheck,
  GraduationCap,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { ContributionActivityMap } from '../../components/employee/ContributionActivityMap';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import {
  MOCK_EMPLOYEES,
  MOCK_EMPLOYEE_SKILLS,
  MOCK_EMPLOYEE_ALLOCATIONS,
  MOCK_EVIDENCE_HISTORY,
  MOCK_LEARNING_GOALS,
  MOCK_DECISION_LOGS,
} from '../../data/mockData';

export const EmployeeDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dynamically resolve logged-in employee (no hardcoded identity)
  const employee =
    MOCK_EMPLOYEES.find(
      (e) =>
        e.id === user?.employeeId ||
        (user?.email && (e as any).email?.toLowerCase() === user.email.toLowerCase()) ||
        (user?.name && e.name.toLowerCase() === user.name.toLowerCase())
    ) || {
      id: user?.employeeId || 'emp-101',
      name: user?.name || 'Dr. Sarah Chen',
      role: 'Lead Cloud Architect',
      department: 'Cloud Platform Engineering',
      weekly_capacity_hours: 40,
      allocated_hours: 25,
      remaining_hours: 15,
      efficiency_score: 94,
      consistency_score: 92,
      reliability_score: 96,
      availability_score: 85,
      workload_tolerance: 40,
      burnout_risk_signal: 25,
      status: 'ACTIVE' as const,
      skills: [],
    };

  // Allocations assigned to this employee
  const [allocations, setAllocations] = useState(MOCK_EMPLOYEE_ALLOCATIONS);

  useEffect(() => {
    api.getMyAllocations().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const liveAllocations: any[] = data.map((a: any) => ({
          project_id: a.project_id,
          project_name: a.projects?.name || 'Enterprise Project',
          domain: 'Engineering',
          role: a.assigned_role || 'Senior Distributed Engineer',
          allocated_hours: a.allocated_hours || 40,
          allocated_pct: a.allocation_percentage || 100,
          deadline: a.planned_end_date || a.projects?.end_date || '2026-12-31',
          status: (a.status === 'ACTIVE' ? 'Active' : a.status === 'RELEASED' ? 'Released' : 'Pending') as any,
          progress_pct: 65,
          assigned_tickets: [],
          release_requested: false,
        }));
        setAllocations(liveAllocations);
      }
    }).catch(() => {});
  }, []);

  const skills = MOCK_EMPLOYEE_SKILLS;
  const evidenceList = MOCK_EVIDENCE_HISTORY;
  const learningGoals = MOCK_LEARNING_GOALS;

  // Workload and Utilization calculations
  const totalAllocatedHours = allocations.reduce((acc, a) => acc + a.allocated_hours, 0);
  const totalCapacity = employee.weekly_capacity_hours || 40;
  const currentWorkload = employee.allocated_hours || totalAllocatedHours;
  const utilizationPct = Math.round((currentWorkload / totalCapacity) * 100);

  // Burnout / Risk Signal Presentation
  let riskSignal: { label: string; variant: 'success' | 'warning' | 'danger' | 'brand'; desc: string };
  if (utilizationPct > 100) {
    riskSignal = {
      label: 'CAPACITY EXCEEDED',
      variant: 'danger',
      desc: 'Workload exceeds maximum capacity. Burnout risk detected. Request manager re-balancing.',
    };
  } else if (utilizationPct >= 90) {
    riskSignal = {
      label: 'CAPACITY WARNING',
      variant: 'warning',
      desc: 'Workload is approaching upper limits. Limit further sprint commitments.',
    };
  } else if (utilizationPct >= 50) {
    riskSignal = {
      label: 'OPTIMAL UTILIZATION',
      variant: 'success',
      desc: 'Balanced workload allocation aligned with sprint delivery milestones.',
    };
  } else {
    riskSignal = {
      label: 'HIGH AVAILABILITY',
      variant: 'brand',
      desc: 'Spare bandwidth available for upcoming project staffing assignments.',
    };
  }

  const pendingEvidence = evidenceList.filter((e) => e.status === 'Submitted' || e.status === 'Under Review');
  const allTickets = allocations.flatMap((a) => a.assigned_tickets || []);

  // Filter decision history relating to this employee
  const recentDecisions = MOCK_DECISION_LOGS.filter(
    (d) => d.employee_id === employee.id || d.employee_name === employee.name
  ).slice(0, 3);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Welcome Page Header with Action Buttons */}
      <PageHeader
        title={`Welcome back, ${employee.name}`}
        description={`Role: ${employee.role} • Department: ${employee.department}. Review your active sprint commitments, capacity signals, and submit milestone completion reports.`}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/employee/report-completion"
              className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-indigo transition flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Report Work Completion</span>
            </Link>

            <Link
              to="/employee/availability"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Update Availability</span>
            </Link>

            <Link
              to="/employee/why-not-selected"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition flex items-center space-x-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
              <span>Why Wasn't I Selected?</span>
            </Link>
          </div>
        }
      />

      {/* Burnout & Risk Banner */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          riskSignal.variant === 'danger'
            ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
            : riskSignal.variant === 'warning'
            ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
            : riskSignal.variant === 'success'
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-slate-950/50">
            {riskSignal.variant === 'danger' || riskSignal.variant === 'warning' ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xs tracking-wider">{riskSignal.label}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/60">
                {currentWorkload}h / {totalCapacity}h ({utilizationPct}%)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{riskSignal.desc}</p>
          </div>
        </div>

        <Link
          to="/employee/availability"
          className="text-xs font-semibold underline underline-offset-2 hover:opacity-80 flex-shrink-0"
        >
          Manage Capacity Settings &rarr;
        </Link>
      </div>

      {/* 6 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <KpiCard
          title="Current Workload"
          value={`${currentWorkload}h / ${totalCapacity}h`}
          subtext={`${utilizationPct}% Utilization`}
          icon={<Clock className="w-5 h-5 text-emerald-400" />}
          variant={utilizationPct > 100 ? 'critical' : utilizationPct >= 90 ? 'warning' : 'healthy'}
          onClick={() => navigate('/employee/availability')}
        />
        <KpiCard
          title="Active Allocations"
          value={allocations.length}
          subtext="Assigned Projects"
          icon={<Briefcase className="w-5 h-5 text-brand-400" />}
          onClick={() => navigate('/employee/allocations')}
        />
        <KpiCard
          title="Assigned Deliverables"
          value={allTickets.length}
          subtext="Sprint Tasks"
          icon={<Layers className="w-5 h-5 text-indigo-400" />}
          onClick={() => navigate('/employee/projects')}
        />
        <KpiCard
          title="Verified Skills"
          value={skills.filter((s) => s.verification_status === 'VERIFIED').length}
          subtext="Level 4+ Verified"
          icon={<Award className="w-5 h-5 text-cyan-400" />}
          onClick={() => navigate('/employee/skills')}
        />
        <KpiCard
          title="Pending Evidence"
          value={pendingEvidence.length}
          subtext="Awaiting Review"
          icon={<FileCheck className="w-5 h-5 text-amber-400" />}
          variant={pendingEvidence.length > 0 ? 'warning' : 'default'}
          onClick={() => navigate('/employee/progress')}
        />
        <KpiCard
          title="Availability"
          value={`${Math.max(0, totalCapacity - currentWorkload)}h`}
          subtext="Free Weekly Hours"
          icon={<Sparkles className="w-5 h-5 text-emerald-400" />}
          onClick={() => navigate('/employee/availability')}
        />
      </div>

      {/* Contribution Activity Map Heatmap */}
      <ContributionActivityMap />

      {/* Main Two-Column Layout: Active Allocations & Skills Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Active Allocations & Recent Decision Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Allocations Widget */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-400" />
                  <span>My Active Allocations</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Assigned weekly hours, sprint milestones, and release actions
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  to="/employee/report-completion"
                  className="px-2.5 py-1 bg-brand-600/20 text-brand-300 hover:bg-brand-600 hover:text-white rounded-lg text-xs font-semibold transition"
                >
                  Report Completion
                </Link>
                <Link
                  to="/employee/allocations"
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {allocations.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800 space-y-2">
                <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300">No Active Project Allocations</h4>
                <p className="text-xs text-slate-500">
                  You are currently not allocated to any active projects. Check back once managers initiate new sprint staffing.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {allocations.map((alloc) => (
                  <div
                    key={alloc.project_id}
                    className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-3 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-white">{alloc.project_name}</h4>
                          <span className="text-[10px] text-brand-400 font-mono">({alloc.domain})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Role: <strong className="text-slate-300">{alloc.role}</strong> • {alloc.allocated_hours} hrs/wk ({alloc.allocated_pct}%) • Deadline: {alloc.deadline || 'Sprint Close'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                          {alloc.status}
                        </span>
                        <Link
                          to="/employee/report-completion"
                          className="px-2.5 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold transition"
                        >
                          Complete
                        </Link>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Milestone Progress</span>
                        <span className="font-mono text-white">{alloc.progress_pct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-500"
                          style={{ width: `${alloc.progress_pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Decision / Allocation History Widget */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Recent Allocation Decision Trail</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Audit records of staffing approvals and ML match explanations
                </p>
              </div>
              <Link
                to="/employee/why-not-selected"
                className="text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                Fairness Logs
              </Link>
            </div>

            {recentDecisions.length === 0 ? (
              <div className="p-4 text-center bg-slate-900/30 rounded-xl border border-slate-800 text-xs text-slate-500">
                No recent decision logs recorded for this account.
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentDecisions.map((dec) => (
                  <div
                    key={dec.id}
                    className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-start justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] text-brand-400 font-semibold">{dec.project_name}</span>
                        <span className="text-[10px] text-slate-500">{dec.created_at}</span>
                      </div>
                      <p className="text-slate-300 mt-1 font-medium">{dec.explanation}</p>
                    </div>
                    <Badge variant={dec.approved_by ? 'success' : 'brand'}>
                      {dec.approved_by ? 'APPROVED' : 'RECOMMENDED'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Top Skills & Growth */}
        <div className="space-y-6">
          {/* Top Verified Skills Widget */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Top Verified Skills</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Verified competency levels</p>
              </div>
              <Link
                to="/employee/skills"
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1"
              >
                <span>All Skills</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {skills.slice(0, 4).map((skill) => (
                <div key={skill.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white truncate max-w-[170px]">{skill.name}</span>
                    <span className="font-mono font-bold text-emerald-400">{skill.displayed_rating} / 5.0</span>
                  </div>

                  <div className="grid grid-cols-5 gap-1">
                    {[1, 2, 3, 4, 5].map((block) => (
                      <div
                        key={block}
                        className={`h-1.5 rounded-full ${
                          skill.displayed_rating >= block
                            ? 'bg-emerald-400 shadow-glow-emerald'
                            : skill.displayed_rating >= block - 0.5
                            ? 'bg-emerald-600'
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>{skill.evidence_source}</span>
                    <span className="text-emerald-400 font-semibold">{skill.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning & Growth Recommendations */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>Growth & Learning</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Target skill goals</p>
              </div>
              <Link
                to="/employee/learning"
                className="text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                View
              </Link>
            </div>

            <div className="space-y-3">
              {learningGoals.map((goal) => (
                <div key={goal.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <h5 className="font-semibold text-white truncate max-w-[180px]">{goal.title}</h5>
                    <span className="font-mono text-cyan-400">{goal.progress_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${goal.progress_pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{goal.provider}</span>
                    <span>Due: {goal.due_date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
