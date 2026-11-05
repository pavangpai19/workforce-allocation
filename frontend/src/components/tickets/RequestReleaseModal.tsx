import React, { useState } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { Ticket } from '../../types/workforce';

export interface RequestReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  onSubmitRelease: (reason: string) => void;
}

export const RequestReleaseModal: React.FC<RequestReleaseModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onSubmitRelease,
}) => {
  const [reason, setReason] = useState('All sprint deliverable tasks completed, tested, and ready for manager verification.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRelease(reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-glass overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Request Allocation Release</h3>
            <p className="text-xs text-slate-400 mt-0.5">{ticket.id}: {ticket.title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-4 bg-brand-950/20 rounded-2xl border border-brand-500/30 text-slate-300 leading-relaxed">
            Submitting this request notifies your project manager that your assigned deliverables are complete. Once confirmed, your weekly capacity allocation ({ticket.estimated_hours}h) will be released back to the available workforce pool.
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold uppercase">Completion Justification / Handover Notes</label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-glow-emerald transition flex items-center space-x-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Submit Release Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
