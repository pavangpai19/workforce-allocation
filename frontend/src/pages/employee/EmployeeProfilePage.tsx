import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Clock,
  Briefcase,
  Award,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Mail,
  Building,
  GraduationCap,
  Info,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import {
  MOCK_EMPLOYEES,
  MOCK_EMPLOYEE_SKILLS,
  MOCK_EMPLOYEE_ALLOCATIONS,
  MOCK_LEARNING_GOALS,
} from '../../data/mockData';

export const EmployeeProfilePage: React.FC = () => {
  const employee = MOCK_EMPLOYEES[0];
  const skills = MOCK_EMPLOYEE_SKILLS;
  const allocations = MOCK_EMPLOYEE_ALLOCATIONS;
  const goals = MOCK_LEARNING_GOALS;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Employee Profile & Intelligence Overview"
        description="Personal identity, verified skill competencies, workload metrics, and supportive workforce intelligence."
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'My Profile' },
        ]}
        actions={
          <Link
            to="/employee/settings"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            Edit Profile Preferences
          </Link>
        }
      />

      {/* Identity Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 flex items-center justify-center text-white text-xl font-extrabold shadow-glow-indigo">
            {employee.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">{employee.name}</h2>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                {employee.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{employee.role}</p>
            <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1.5">
              <span className="flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>{employee.department}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>sarah.chen@enterprise.iq</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Weekly Bandwidth</span>
            <span className="text-sm font-bold font-mono text-white">40 hrs / wk</span>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Allocated Hours</span>
            <span className="text-sm font-bold font-mono text-emerald-400">25 hrs (62.5%)</span>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Availability</span>
            <span className="text-sm font-bold font-mono text-brand-300">15 hrs Available</span>
          </div>
        </div>
      </div>

      {/* Careful Employee Intelligence Summary */}
      <div className="p-5 bg-brand-950/20 rounded-2xl border border-brand-500/30 space-y-2.5">
        <div className="flex items-center space-x-2 text-brand-300 text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Workforce Intelligence & Growth Guidance</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The platform evaluates employee capability signals to support optimal project staffing and growth. Machine learning models produce objective predictive signals regarding workload balance and delivery cadence.
          All allocation assignments are governed by human managers, and AI signals serve purely as supportive reflection aids.
        </p>
      </div>

      {/* Performance Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Efficiency Score"
          value="92%"
          subtext="Task turnaround velocity"
          icon={<Activity className="w-5 h-5 text-emerald-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Consistency Index"
          value="95%"
          subtext="Delivery predictability"
          icon={<CheckCircle2 className="w-5 h-5 text-brand-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Reliability Index"
          value="94%"
          subtext="Quality milestone score"
          icon={<ShieldCheck className="w-5 h-5 text-cyan-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Burnout Protection"
          value="0.15 (Safe)"
          subtext="Workload within limits"
          icon={<Clock className="w-5 h-5 text-indigo-400" />}
          variant="healthy"
        />
      </div>

      {/* Skills & Allocations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verified Skills Summary */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Verified Competency Profiles</span>
            </h3>
            <Link to="/employee/skills" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
              Manage Skills
            </Link>
          </div>

          <div className="space-y-3">
            {skills.map((skill) => (
              <div key={skill.id} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-semibold text-white">{skill.name}</h5>
                  <p className="text-[11px] text-slate-400">{skill.evidence_source} • {skill.category}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400 text-sm">{skill.displayed_rating} / 5.0</div>
                  <span className="text-[10px] text-slate-500">{skill.verification_status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active & Past Projects */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-brand-400" />
              <span>Project History & Current Commitments</span>
            </h3>
            <Link to="/employee/portfolio" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
              Full Portfolio
            </Link>
          </div>

          <div className="space-y-3">
            {allocations.map((alloc) => (
              <div key={alloc.project_id} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <h5 className="font-semibold text-white">{alloc.project_name}</h5>
                    <p className="text-[11px] text-brand-400">{alloc.role}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {alloc.allocated_hours}h / wk
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Deadline: {alloc.deadline}</span>
                  <span className="text-emerald-400 font-semibold">{alloc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
