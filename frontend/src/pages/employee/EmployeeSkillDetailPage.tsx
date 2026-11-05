import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowLeft,
  FileCheck,
  TrendingUp,
  Plus,
  Briefcase,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { MOCK_EMPLOYEE_SKILLS } from '../../data/mockData';

export const EmployeeSkillDetailPage: React.FC = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const skill = MOCK_EMPLOYEE_SKILLS.find((s) => s.id === skillId) || MOCK_EMPLOYEE_SKILLS[0];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title={`Skill Profile: ${skill.name}`}
        description={`Domain: ${skill.category} • Current Rating: ${skill.displayed_rating} / 5.0 (Normalized: ${skill.normalized_score})`}
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'Skills', path: '/employee/skills' },
          { label: skill.name },
        ]}
        actions={
          <Link
            to="/employee/progress/new"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-glow-indigo transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Evidence</span>
          </Link>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Proficiency Rating"
          value={`${skill.displayed_rating} / 5.0`}
          subtext={`Raw Normalized: ${skill.normalized_score}`}
          icon={<Award className="w-5 h-5 text-emerald-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Evidence Status"
          value={skill.verification_status}
          subtext={`Source: ${skill.evidence_source}`}
          icon={<FileCheck className="w-5 h-5 text-brand-400" />}
        />
        <KpiCard
          title="Growth Trend"
          value={skill.trend.toUpperCase()}
          subtext={`Updated: ${skill.last_updated}`}
          icon={<TrendingUp className="w-5 h-5 text-cyan-400" />}
        />
        <KpiCard
          title="Organizational Demand"
          value="High (Q3 Critical)"
          subtext="Required in 3 Active Sprints"
          icon={<Sparkles className="w-5 h-5 text-indigo-400" />}
        />
      </div>

      {/* Deep-Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verified Credentials & Evidence */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Credentials & Evidence History</span>
          </h3>

          <div className="space-y-3">
            {skill.related_certificates.length > 0 ? (
              skill.related_certificates.map((cert) => (
                <div key={cert} className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <h5 className="font-semibold text-white">{cert}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">Issued by Credly Verification API</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono">
                    Verified
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No external certificates currently attached.</p>
            )}
          </div>
        </div>

        {/* Projects Utilizing Skill & Target Milestones */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-brand-400" />
            <span>Active Project Deployments & Milestones</span>
          </h3>

          <div className="space-y-3">
            {skill.related_projects.map((proj) => (
              <div key={proj} className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{proj}</span>
                <span className="text-[10px] text-brand-300 font-mono">Primary Architecture Slot</span>
              </div>
            ))}

            {skill.growth_milestones && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Target Growth Milestones:
                </span>
                {skill.growth_milestones.map((m, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
