import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  FileCheck,
  AlertTriangle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { MOCK_EVIDENCE_HISTORY } from '../../data/mockData';
import { ProgressEvidence } from '../../types/workforce';

export const EmployeeProgressPage: React.FC = () => {
  const [evidenceList] = useState<ProgressEvidence[]>(MOCK_EVIDENCE_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const verifiedCount = evidenceList.filter((e) => e.status === 'Verified').length;
  const reviewCount = evidenceList.filter((e) => e.status === 'Under Review' || e.status === 'Submitted').length;

  const filtered = evidenceList.filter((e) => {
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Skill Evidence & Progress Submission Ledger"
        description="Transparent record of certificate credentials, repository code artifacts, course completions, and allocation release requests."
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'Progress & Evidence' },
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
          title="Total Submissions"
          value={evidenceList.length}
          subtext="Logged in Evidence Ledger"
          icon={<TrendingUp className="w-5 h-5 text-brand-400" />}
        />
        <KpiCard
          title="Verified Outcomes"
          value={verifiedCount}
          subtext="Validated by Reviewer"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Under Review"
          value={reviewCount}
          subtext="Awaiting Manager Action"
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          variant={reviewCount > 0 ? 'warning' : 'default'}
        />
        <KpiCard
          title="Approval Rate"
          value="100%"
          subtext="Zero Rejected Items"
          icon={<Sparkles className="w-5 h-5 text-indigo-400" />}
        />
      </div>

      {/* Search and Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search evidence title..."
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-56"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Verified">Verified Only</option>
            <option value="Under Review">Under Review</option>
            <option value="Submitted">Submitted</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">Showing {filtered.length} submissions</span>
      </div>

      {/* Evidence Ledger Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Title & Evidence Type</th>
                <th className="pb-3 font-semibold">Related Skill / Project</th>
                <th className="pb-3 font-semibold">Submission Date</th>
                <th className="pb-3 font-semibold">Verification Status</th>
                <th className="pb-3 font-semibold">Reviewer Feedback</th>
                <th className="pb-3 font-semibold text-right">Link / Artifact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4">
                    <div className="font-semibold text-white">{item.title}</div>
                    <div className="text-[10px] text-brand-400 font-mono mt-0.5">{item.evidence_type}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-white">{item.related_skill || item.related_project || 'General'}</div>
                  </td>
                  <td className="py-4 font-mono text-slate-400">{item.submission_date}</td>
                  <td className="py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        item.status === 'Verified'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : item.status === 'Under Review' || item.status === 'Submitted'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 text-slate-300 max-w-xs truncate">{item.reviewer_feedback || 'Pending review'}</td>
                  <td className="py-4 text-right">
                    {item.url_or_file && (
                      <a
                        href={item.url_or_file}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center space-x-1"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
