import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Ticket } from '../../types/workforce';

export interface ReviewEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  onApprove: (feedback: string) => void;
  onReject: (feedback: string) => void;
}

export const ReviewEvidenceModal: React.FC<ReviewEvidenceModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onApprove,
  onReject,
}) => {
  const [feedback, setFeedback] = useState('Deliverable verified against acceptance criteria and merged to main.');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-glass overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Review Deliverable Evidence</h3>
            <p className="text-xs text-slate-400 mt-0.5">{ticket.id}: {ticket.title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {ticket.evidence_submission ? (
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-white">{ticket.evidence_submission.title}</h4>
              <p className="text-slate-300">{ticket.evidence_submission.notes}</p>
              {ticket.evidence_submission.url_or_artifact && (
                <a
                  href={ticket.evidence_submission.url_or_artifact}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center space-x-1 pt-1"
                >
                  <span>Inspect Artifact / PR</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : (
            <p className="text-slate-400">Review task completion sign-off for {ticket.assignee_name}.</p>
          )}

          <div className="space-y-1">
            <label className="text-slate-300 font-bold uppercase">Manager Review Feedback / Notes</label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              onClick={() => { onReject(feedback); onClose(); }}
              className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl font-semibold transition"
            >
              Request Revisions
            </button>
            <button
              onClick={() => { onApprove(feedback); onClose(); }}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-glow-emerald transition flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Sign-Off</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
