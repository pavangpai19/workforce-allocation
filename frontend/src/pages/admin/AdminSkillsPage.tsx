import React, { useState } from 'react';
import {
  Award,
  Search,
  CheckCircle2,
  Layers,
  Sparkles,
  ShieldCheck,
  FileCheck,
  HelpCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { MOCK_SKILL_CATALOG } from '../../data/mockData';
import { SkillCategoryDefinition, SkillProficiencyLevel, EvidenceType } from '../../types/workforce';

export const AdminSkillsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategoryDefinition>(MOCK_SKILL_CATALOG[0]);

  const filteredCategories = MOCK_SKILL_CATALOG.filter((cat: SkillCategoryDefinition) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Organization Skill Catalogue & Proficiency Framework"
        description="Standardized technical proficiency levels, validation criteria, and verified evidence schemas."
        breadcrumbs={[{ label: 'Admin Console', path: '/admin/dashboard' }, { label: 'Skills' }]}
      />

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="relative w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skill domains or categories..."
            className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-full"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {MOCK_SKILL_CATALOG.length} Skill Domains Defined
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category List */}
        <div className="space-y-3">
          {filteredCategories.map((cat: SkillCategoryDefinition) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                selectedCategory.id === cat.id
                  ? 'bg-brand-950/20 border-brand-500/50 shadow-glow-indigo'
                  : 'glass-panel border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-brand-300 font-mono font-bold">
                  {cat.skills_count} Skills
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mb-2">{cat.domain}</span>
              <p className="text-[11px] text-slate-400 line-clamp-2">{cat.description}</p>
            </div>
          ))}
        </div>

        {/* Selected Category Detail & Proficiency Framework */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono text-brand-400 font-bold tracking-wider">
                {selectedCategory.domain}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedCategory.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{selectedCategory.description}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-mono block">Validation Refresh</span>
              <span className="text-xs font-bold text-slate-300">Every {selectedCategory.validation_frequency_months} Months</span>
            </div>
          </div>

          {/* 5-Level Proficiency Framework */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4 text-brand-400" />
              <span>5-Level Proficiency Framework</span>
            </h4>

            <div className="space-y-3">
              {selectedCategory.proficiency_levels.map((lvl: SkillProficiencyLevel) => (
                <div key={lvl.level} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-brand-600/20 border border-brand-500/40 text-brand-300 text-[10px] font-bold flex items-center justify-center font-mono">
                        L{lvl.level}
                      </span>
                      <h5 className="text-xs font-bold text-white">{lvl.title}</h5>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300">{lvl.description}</p>
                  <div className="pt-2 border-t border-slate-800/60 flex items-center space-x-2 text-[10px] text-slate-400">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span><strong>Required Evidence:</strong> {lvl.expected_evidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accepted Evidence Types */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <h5 className="text-xs font-bold text-white">Accepted Validation Modalities</h5>
            <div className="flex flex-wrap gap-2">
              {selectedCategory.accepted_evidence_types.map((t: EvidenceType) => (
                <span key={t} className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                  {t.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
