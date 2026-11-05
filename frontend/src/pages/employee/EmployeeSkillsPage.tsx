import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Plus,
  ShieldCheck,
  FileCheck,
  Info,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { MOCK_EMPLOYEE_SKILLS } from '../../data/mockData';
import { EmployeeSkillDetail } from '../../types/workforce';

export const EmployeeSkillsPage: React.FC = () => {
  const [skills] = useState<EmployeeSkillDetail[]>(MOCK_EMPLOYEE_SKILLS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const verifiedCount = skills.filter((s) => s.verification_status === 'VERIFIED').length;
  const avgRating = (skills.reduce((acc, s) => acc + s.displayed_rating, 0) / skills.length).toFixed(1);

  const filteredSkills = skills.filter((s) => {
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Verified Skill Competency Portfolio"
        description="1–5 scale competency ratings evaluated via credentials, production code reviews, manager assessments, and verified project outcomes."
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'Skills' },
        ]}
        actions={
          <Link
            to="/employee/progress/new"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-glow-indigo transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Skill Evidence</span>
          </Link>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Total Skills"
          value={skills.length}
          subtext="Across 5 Domains"
          icon={<Award className="w-5 h-5 text-brand-400" />}
        />
        <KpiCard
          title="Verified Proficiencies"
          value={verifiedCount}
          subtext="Credential / Project Validated"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Average Proficiency"
          value={`${avgRating} / 5.0`}
          subtext="Normalized 1–5 Scale"
          icon={<TrendingUp className="w-5 h-5 text-cyan-400" />}
        />
        <KpiCard
          title="High-Demand Signals"
          value="2 Opportunities"
          subtext="PySpark & Kafka Sprints"
          icon={<Sparkles className="w-5 h-5 text-amber-400" />}
          variant="warning"
        />
      </div>

      {/* AI Transparency Disclaimer */}
      <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-start space-x-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Skill Governance & Transparency Note:</span> Displayed proficiency ratings are derived from verified evidence, production code reviews, and certified credentials. AI-derived indicators represent supportive analytical models, not immutable assessments. You can submit new evidence or request review at any time.
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill name..."
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-56"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Cloud">Cloud Architecture</option>
            <option value="DevOps">DevOps & Infrastructure</option>
            <option value="Security">Security & Auth</option>
            <option value="Backend">Backend Services</option>
            <option value="Data">Data & ML</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">Showing {filteredSkills.length} skills</span>
      </div>

      {/* Skill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-brand-400 uppercase tracking-wider block">
                    {skill.category}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{skill.name}</h4>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold font-mono text-emerald-400">
                    {skill.displayed_rating} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{skill.trend}</span>
                </div>
              </div>

              {/* Segmented 5-Block Rating Meter */}
              <div className="space-y-1">
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 rounded-full transition-all ${
                        skill.displayed_rating >= level
                          ? 'bg-emerald-400 shadow-glow-emerald'
                          : skill.displayed_rating >= level - 0.5
                          ? 'bg-emerald-600'
                          : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">{skill.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {skill.evidence_source}
              </span>
              <Link
                to={`/employee/skills/${skill.id}`}
                className="text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-1"
              >
                <span>Inspect Skill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
