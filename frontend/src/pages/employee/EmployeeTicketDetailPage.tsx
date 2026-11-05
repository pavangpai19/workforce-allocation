import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Layers,
  Clock,
  CheckCircle2,
  Send,
  ExternalLink,
  MessageSquare,
  Upload,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { RequestReleaseModal } from '../../components/tickets/RequestReleaseModal';
import { MOCK_TICKETS } from '../../data/mockData';
import { Ticket, TicketStatus } from '../../types/workforce';

export const EmployeeTicketDetailPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const ticket = tickets.find((t) => t.id === ticketId) || tickets[0];

  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [isReleaseOpen, setIsReleaseOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleStatusChange = (newStatus: TicketStatus) => {
    setStatus(newStatus);
    setActionSuccess(`Status updated to ${newStatus}.`);
  };

  const handleSubmitEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    ticket.evidence_submission = {
      id: `ev-${Date.now()}`,
      title: evidenceTitle,
      url_or_artifact: evidenceUrl,
      notes: evidenceNotes,
      submitted_at: 'Just now',
      status: 'PENDING',
    };
    ticket.status = 'In Review';
    setStatus('In Review');
    setActionSuccess('Work artifact submitted for manager review!');
    setEvidenceTitle('');
    setEvidenceUrl('');
    setEvidenceNotes('');
  };

  const handleReleaseSubmitted = (reason: string) => {
    ticket.release_request = {
      id: `rel-${Date.now()}`,
      requested_at: 'Just now',
      reason,
      status: 'PENDING',
    };
    setActionSuccess('Allocation release request submitted to project manager.');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title={`${ticket.id}: ${ticket.title}`}
        description={`Project: ${ticket.project_name} • Assigned Hours: ${ticket.estimated_hours}h • Story Points: ${ticket.story_points} SP`}
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'Projects', path: '/employee/projects' },
          { label: ticket.id },
        ]}
        actions={
          <button
            onClick={() => setIsReleaseOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-glow-emerald transition flex items-center space-x-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Request Allocation Release</span>
          </button>
        }
      />

      {actionSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Scope */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Deliverable Scope & Task Details</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{ticket.description}</p>
          </div>

          {/* Submit Work Artifact / Evidence Form */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2">
              <Upload className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-bold text-white">Submit Work Completion Artifact / PR Evidence</h3>
            </div>

            <form onSubmit={handleSubmitEvidence} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">Artifact Title / PR Name</label>
                <input
                  type="text"
                  required
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  placeholder="e.g. Terraform State Migration PR #418"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">Pull Request / Repository URL</label>
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://github.internal/enterprise/.../pull/..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">Completion Handover Notes</label>
                <textarea
                  rows={2}
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  placeholder="Summarize changes made and testing validation steps..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold shadow-glow-indigo transition"
              >
                Submit Artifact for Review
              </button>
            </form>
          </div>
        </div>

        {/* Status Actions Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Update Sprint Status</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {(['To Do', 'In Progress', 'In Review', 'Done'] as TicketStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`p-2 rounded-xl border transition ${
                    status === st
                      ? 'bg-brand-600 text-white border-brand-500 shadow-glow-indigo'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RequestReleaseModal
        isOpen={isReleaseOpen}
        onClose={() => setIsReleaseOpen(false)}
        ticket={ticket}
        onSubmitRelease={handleReleaseSubmitted}
      />
    </div>
  );
};
