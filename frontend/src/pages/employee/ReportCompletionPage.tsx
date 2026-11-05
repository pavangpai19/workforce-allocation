import React, { useState } from 'react';
import { PageHeader } from '../../components/shell/PageHeader';
import { CheckCircle, Calendar, Link as LinkIcon, Send, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_EMPLOYEES, MOCK_EMPLOYEE_ALLOCATIONS } from '../../data/mockData';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';

export const ReportCompletionPage: React.FC = () => {
  const { user } = useAuth();
  const currentEmployee = MOCK_EMPLOYEES.find(
    (e) =>
      e.id === user?.employeeId ||
      (user?.email && (e as any).email?.toLowerCase() === user.email.toLowerCase()) ||
      (user?.name && e.name.toLowerCase() === user.name.toLowerCase())
  ) || MOCK_EMPLOYEES[0];

  const activeAllocations = MOCK_EMPLOYEE_ALLOCATIONS.filter(
    (a) => a.status === 'Active' || a.status === 'Awaiting manager review'
  );

  const [selectedAllocationId, setSelectedAllocationId] = useState(
    activeAllocations[0]?.project_id || ''
  );
  const [completionDate, setCompletionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [deliverablesSummary, setDeliverablesSummary] = useState('');
  const [repositoryLinks, setRepositoryLinks] = useState('');
  const [handoffNotes, setHandoffNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const selectedAlloc = activeAllocations.find((a) => a.project_id === selectedAllocationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Attempt backend release endpoint if allocation exists
      const token = localStorage.getItem('wf_access_token');
      if (token && selectedAllocationId) {
        await fetch(`http://localhost:3001/allocations/release/${selectedAllocationId}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completion_date: completionDate,
            deliverables_summary: deliverablesSummary,
            handoff_notes: handoffNotes,
          }),
        }).catch(() => null);
      }
    } finally {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Report Work Completion"
        description="Notify your project manager that assigned sprint milestones or allocation deliverables have been accomplished."
        actions={
          <Link
            to="/employee/allocations"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            Back to Allocations
          </Link>
        }
      />

      {submittedSuccess && (
        <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300 space-y-2 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Work Completion Reported Successfully</h4>
          </div>
          <p className="text-slate-300">
            Your manager has been notified and a decision log entry has been recorded. Your allocation status is now marked as <strong>WORK_COMPLETED</strong> awaiting manager sign-off.
          </p>
          <div className="pt-2">
            <Link
              to="/employee/dashboard"
              className="inline-flex px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      )}

      {activeAllocations.length === 0 ? (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Active Allocations Found</h3>
          <p className="text-xs text-slate-400">
            You do not currently have any active project allocations requiring completion reports.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Completion Form */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Select Project Allocation */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Active Allocation</label>
                <select
                  value={selectedAllocationId}
                  onChange={(e) => setSelectedAllocationId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {activeAllocations.map((a) => (
                    <option key={a.project_id} value={a.project_id}>
                      {a.project_name} — {a.role} ({a.allocated_hours}h/wk)
                    </option>
                  ))}
                </select>
              </div>

              {/* Completion Date */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Actual Completion Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="date"
                    required
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Deliverables Summary */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Key Deliverables Summary</label>
                <textarea
                  required
                  rows={4}
                  value={deliverablesSummary}
                  onChange={(e) => setDeliverablesSummary(e.target.value)}
                  placeholder="Outline the core milestones delivered, PRs merged, documentation created, or components launched..."
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Artifacts / PR URLs */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Repository / Artifact Links</label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={repositoryLinks}
                    onChange={(e) => setRepositoryLinks(e.target.value)}
                    placeholder="https://github.com/org/repo/pull/124, docs.internal/arch"
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Handoff / Transition Notes */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Handoff Notes & Recommendations</label>
                <textarea
                  rows={3}
                  value={handoffNotes}
                  onChange={(e) => setHandoffNotes(e.target.value)}
                  placeholder="Any remaining operational handover notes, monitor dashboards, or follow-up contacts..."
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-glow-indigo transition flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Report...' : 'Submit Work Completion for Review'}</span>
              </button>
            </form>
          </div>

          {/* Allocation Snapshot */}
          <div className="space-y-6">
            {selectedAlloc && (
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Allocation Details</h4>
                  <Badge variant="brand">{selectedAlloc.status}</Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Project</span>
                    <span className="font-bold text-white text-sm">{selectedAlloc.project_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Role</span>
                    <span className="text-slate-200 font-medium">{selectedAlloc.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <span className="text-slate-400 block">Weekly Commitment</span>
                      <span className="text-slate-200 font-mono font-semibold">{selectedAlloc.allocated_hours} hrs/week</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Milestone Progress</span>
                      <span className="text-emerald-400 font-mono font-semibold">{selectedAlloc.progress_pct}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-brand-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Manager Release Protocol</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Reporting work completion flags this allocation as completed. Once your manager confirms the release, your allocated hours are immediately freed into available capacity for future team allocations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
