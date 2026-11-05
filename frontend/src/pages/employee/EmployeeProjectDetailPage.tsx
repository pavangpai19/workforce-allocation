import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Briefcase,
  Layers,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Plus,
  Send,
  AlertTriangle,
  AlertOctagon,
  ExternalLink,
  Paperclip,
  MessageSquare,
  FileCheck,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { MOCK_EMPLOYEE_ALLOCATIONS, MOCK_TICKETS, MOCK_EMPLOYEES } from '../../data/mockData';
import { Ticket, TicketStatus } from '../../types/workforce';

export const EmployeeProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const alloc = MOCK_EMPLOYEE_ALLOCATIONS.find((a) => a.project_id === projectId) || MOCK_EMPLOYEE_ALLOCATIONS[0];
  const currentEmployee = MOCK_EMPLOYEES[0]; // Dr. Sarah Chen
  const [isReleaseOpen, setIsReleaseOpen] = useState(false);
  const [releaseRequested, setReleaseRequested] = useState(alloc.release_requested);
  const [activeTab, setActiveTab] = useState<'tickets' | 'evidence'>('tickets');

  // Filter tickets for this employee on this project
  const projectTickets = MOCK_TICKETS.filter(
    (t) => t.project_id === (projectId || 'proj-1') && (t.assignee_id === currentEmployee.id || t.assignee_name === currentEmployee.name)
  );

  const displayTickets = projectTickets.length > 0 ? projectTickets : alloc.assigned_tickets;

  const handleConfirmRelease = () => {
    setIsReleaseOpen(false);
    setReleaseRequested(true);
  };

  const typeColors: Record<string, string> = {
    Task: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    Bug: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    Feature: 'bg-brand-500/10 text-brand-300 border-brand-500/20',
    Improvement: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    Risk: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    'Staffing Request': 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title={`Project Workspace: ${alloc.project_name}`}
        description={`Role: ${alloc.role} • ${alloc.allocated_hours} hrs/wk • Domain: ${alloc.domain}`}
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'Projects', path: '/employee/projects' },
          { label: alloc.project_name },
        ]}
        actions={
          <div className="flex items-center space-x-3">
            <Link
              to="/employee/progress/new"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Progress / Evidence</span>
            </Link>
            <button
              onClick={() => setIsReleaseOpen(true)}
              disabled={releaseRequested}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
                releaseRequested
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-emerald'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{releaseRequested ? 'Release Request Pending' : 'Request Allocation Release'}</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Allocated Hours"
          value={`${alloc.allocated_hours}h / wk`}
          subtext="Sprint Capacity Commitment"
          icon={<Clock className="w-5 h-5 text-brand-400" />}
        />
        <KpiCard
          title="Assigned Tickets"
          value={displayTickets.length}
          subtext="Active Sprint Tasks"
          icon={<Layers className="w-5 h-5 text-cyan-400" />}
        />
        <KpiCard
          title="Milestone Delivery"
          value={`${alloc.progress_pct}%`}
          subtext="Completion Progress"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Target Deadline"
          value={alloc.deadline}
          subtext="Sprint Sign-off Date"
          icon={<Sparkles className="w-5 h-5 text-indigo-400" />}
        />
      </div>

      {/* Workspace Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'tickets'
              ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          My Assigned Tickets ({displayTickets.length})
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'evidence'
              ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Deliverable Evidence & PRs
        </button>
      </div>

      {/* Assigned Tickets List */}
      {activeTab === 'tickets' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Sprint Tasks & Work Items</h3>
            <span className="text-xs text-slate-400">Click any ticket to update status or submit artifacts</span>
          </div>

          <div className="space-y-3">
            {displayTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 bg-slate-900/80 hover:bg-slate-800/80 transition rounded-xl border border-slate-800 flex items-center justify-between group"
              >
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        ticket.status === 'Done' || ticket.status === 'DONE'
                          ? 'text-emerald-400'
                          : ticket.status === 'In Review' || ticket.status === 'REVIEW'
                          ? 'text-cyan-400'
                          : ticket.status === 'Blocked' || ticket.status === 'BLOCKED'
                          ? 'text-rose-400'
                          : 'text-slate-500'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/employee/tickets/${ticket.id}`}
                        className="font-mono text-xs font-bold text-brand-400 hover:text-brand-300"
                      >
                        {ticket.id}
                      </Link>
                      {ticket.ticket_type && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            typeColors[ticket.ticket_type] || 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {ticket.ticket_type}
                        </span>
                      )}
                      <Link
                        to={`/employee/tickets/${ticket.id}`}
                        className="text-xs font-bold text-white group-hover:text-brand-300 transition"
                      >
                        {ticket.title}
                      </Link>
                    </div>

                    <div className="flex items-center space-x-4 text-[11px] text-slate-400">
                      <span>Points: <strong className="text-slate-300">{ticket.story_points || 3} SP</strong></span>
                      <span>Est: <strong className="text-slate-300">{ticket.estimated_hours || 16}h</strong></span>
                      <span>Priority: <strong className="text-slate-300">{ticket.priority}</strong></span>
                      {ticket.due_date && <span>Due: <strong className="text-slate-300">{ticket.due_date}</strong></span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold ${
                      ticket.status === 'Done' || ticket.status === 'DONE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : ticket.status === 'In Review' || ticket.status === 'REVIEW'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : ticket.status === 'Blocked' || ticket.status === 'BLOCKED'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {ticket.status}
                  </span>
                  <Link
                    to={`/employee/tickets/${ticket.id}`}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition"
                    title="View Ticket Details"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deliverable Evidence Tab */}
      {activeTab === 'evidence' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Submitted Deliverables & Verification Evidence</h3>
              <p className="text-xs text-slate-400 mt-0.5">Manager review status for completed project milestones</p>
            </div>
            <Link
              to="/employee/progress/new"
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold transition"
            >
              + Submit Evidence
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Terraform Remote Backend & DynamoDB Lock Implementation</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    VERIFIED
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">PR #142 merged with 100% CI pass rate. Verified by Alex Rivera.</p>
              </div>
              <a
                href="https://github.com/enterprise/cloud-infra/pull/142"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center space-x-1"
              >
                <span>View PR</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={isReleaseOpen}
        onClose={() => setIsReleaseOpen(false)}
        onConfirm={handleConfirmRelease}
        title="Request Allocation Release"
        message={`Submit early sprint release request for "${alloc.project_name}". Your manager will receive notification to verify deliverables and return your capacity to the available pool.`}
        confirmLabel="Submit Release Request"
        variant="primary"
      />
    </div>
  );
};
