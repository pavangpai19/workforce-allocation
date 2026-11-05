import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  FileCheck,
  Paperclip,
  MessageSquare,
  Sparkles,
  Send,
  ExternalLink,
  ShieldCheck,
  Edit3,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { ReviewEvidenceModal } from '../../components/tickets/ReviewEvidenceModal';
import { MOCK_TICKETS, MOCK_EMPLOYEES } from '../../data/mockData';
import { Ticket, TicketStatus } from '../../types/workforce';

export const ManagerTicketDetailPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const ticket = tickets.find((t) => t.id === ticketId) || tickets[0];

  const [commentText, setCommentText] = useState('');
  const [isReviewEvidenceOpen, setIsReviewEvidenceOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const assignee = MOCK_EMPLOYEES.find((e) => e.name === ticket.assignee_name) || MOCK_EMPLOYEES[0];

  const handleApproveEvidence = (feedback: string) => {
    setActionSuccess(`Evidence verified and deliverable approved. Status updated to Done.`);
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticket.id
          ? {
              ...t,
              status: 'Done',
              evidence_submission: t.evidence_submission
                ? { ...t.evidence_submission, status: 'VERIFIED', reviewer_feedback: feedback }
                : undefined,
            }
          : t
      )
    );
  };

  const handleRejectEvidence = (feedback: string) => {
    setActionSuccess(`Revisions requested from ${ticket.assignee_name}.`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author_name: 'Alex Rivera (Manager)',
      author_role: 'Engineering Manager',
      content: commentText,
      created_at: 'Just now',
    };
    ticket.comments = [...(ticket.comments || []), newComment];
    setCommentText('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title={`${ticket.id}: ${ticket.title}`}
        description={`Project: ${ticket.project_name} • Type: ${ticket.ticket_type} • Status: ${ticket.status}`}
        breadcrumbs={[
          { label: 'Manager Dashboard', path: '/manager/dashboard' },
          { label: 'Tickets', path: '/manager/tickets' },
          { label: ticket.id },
        ]}
        actions={
          <div className="flex items-center space-x-3">
            {ticket.evidence_submission && (
              <button
                onClick={() => setIsReviewEvidenceOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-glow-emerald transition flex items-center space-x-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>Review Completion Evidence</span>
              </button>
            )}
          </div>
        }
      />

      {actionSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Ticket Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details, Description, Evidence, Comments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description & Scope */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Scope & Acceptance Criteria</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {ticket.description || 'No detailed description provided.'}
            </p>

            {ticket.blocker_details && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-1 text-xs text-rose-300">
                <div className="font-bold flex items-center space-x-2 text-rose-400">
                  <AlertOctagon className="w-4 h-4" />
                  <span>Active Blocker Telemetry</span>
                </div>
                <p>{ticket.blocker_details}</p>
              </div>
            )}
          </div>

          {/* Completion Evidence Section */}
          {ticket.evidence_submission && (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Submitted Work Completion Artifact</span>
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono">
                  {ticket.evidence_submission.status}
                </span>
              </div>
              <p className="text-xs text-slate-300">{ticket.evidence_submission.notes}</p>
              {ticket.evidence_submission.url_or_artifact && (
                <a
                  href={ticket.evidence_submission.url_or_artifact}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center space-x-1"
                >
                  <span>Inspect Code Repository PR / Artifact</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Comments & Activity Log */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-brand-400" />
              <span>Discussion & Handover Notes</span>
            </h3>

            <div className="space-y-3">
              {ticket.comments?.map((comment) => (
                <div key={comment.id} className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{comment.author_name} ({comment.author_role})</span>
                    <span className="text-[10px] text-slate-500">{comment.created_at}</span>
                  </div>
                  <p className="text-slate-300">{comment.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="space-y-2 pt-2">
              <textarea
                rows={2}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a message or manager direction..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold shadow-glow-indigo transition"
              >
                Post Note
              </button>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Metadata, Assignee Capacity, Telemetry */}
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ticket Telemetry</h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Assignee</span>
                <span className="text-white font-semibold">{ticket.assignee_name || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Required Skill</span>
                <span className="text-brand-300 font-mono">{ticket.required_skill}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Story Points</span>
                <span className="text-white font-mono">{ticket.story_points} SP</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Estimated Hours</span>
                <span className="text-white font-mono">{ticket.estimated_hours} hrs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Deadline</span>
                <span className="text-white font-mono">{ticket.deadline || 'Sprint End'}</span>
              </div>
            </div>
          </div>

          {/* Assignee Capacity Context */}
          {assignee && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-brand-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Assignee Capacity Context</h4>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Weekly Bandwidth:</span>
                  <span className="font-mono text-white">{assignee.weekly_capacity_hours} hrs / wk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Remaining Bandwidth:</span>
                  <span className="font-mono text-emerald-400 font-bold">{assignee.remaining_hours} hrs available</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Burnout Signal:</span>
                  <span className="font-mono text-slate-300">{(assignee.burnout_risk_signal * 100).toFixed(0)}% (Low Risk)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ReviewEvidenceModal
        isOpen={isReviewEvidenceOpen}
        onClose={() => setIsReviewEvidenceOpen(false)}
        ticket={ticket}
        onApprove={handleApproveEvidence}
        onReject={handleRejectEvidence}
      />
    </div>
  );
};
