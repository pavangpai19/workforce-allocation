import React from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Upload,
  Lock,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { MOCK_NON_SELECTION_EVALUATIONS } from '../../data/mockData';

export const EmployeeWhyNotSelectedPage: React.FC = () => {
  const evaluations = MOCK_NON_SELECTION_EVALUATIONS;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Why Wasn't I Selected? (Personal Decision Insights)"
        description="Respectful, transparent, privacy-preserving explanation of project staffing prerequisites and individual eligibility gates."
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'Selection Explanations' },
        ]}
      />

      {/* Strict Privacy Guarantee Banner */}
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start space-x-3 text-xs text-emerald-200">
        <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white block">Strict Privacy Guarantee:</strong>
          This analysis strictly evaluates your individual profile against objective project requirements. In accordance with organizational governance, information regarding other team members, peer scores, or comparative rankings is never displayed.
        </div>
      </div>

      {/* Evaluations Breakdown */}
      <div className="space-y-6">
        {evaluations.map((evalItem) => (
          <div key={evalItem.project_id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div>
                <h3 className="text-base font-bold text-white">{evalItem.project_name}</h3>
                <p className="text-xs text-brand-400 font-mono mt-0.5">
                  Evaluated Role: {evalItem.role} • Evaluated: {evalItem.evaluated_at}
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                {evalItem.domain}
              </span>
            </div>

            {/* Requirement Checklist */}
            <div className="space-y-3">
              {evalItem.requirements.map((req, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex items-start space-x-3.5 ${
                    req.passed
                      ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-200'
                  }`}
                >
                  {req.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-1 text-xs flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-bold text-white">{req.requirement}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          req.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {req.candidate_status}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{req.details}</p>
                    <div className="text-[11px] text-brand-300 font-semibold pt-1">
                      Suggested Next Step: {req.suggested_next_step}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Action CTAs */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-400">Action Pathways:</span>
              {evalItem.suggested_actions.map((act, aIdx) => (
                <Link
                  key={aIdx}
                  to={act.link}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
                >
                  <span>{act.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
