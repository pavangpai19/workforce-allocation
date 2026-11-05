import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  User,
  Paperclip,
  MessageSquare,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
} from 'lucide-react';
import { Ticket } from '../../types/workforce';

export interface TicketCardProps {
  ticket: Ticket;
  basePath?: string; // '/manager/tickets' or '/employee/tickets'
  onStatusChange?: (ticketId: string, newStatus: any) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  basePath = '/manager/tickets',
}) => {
  const isBlocked = ticket.status === 'Blocked' || ticket.status === 'BLOCKED';
  const isDone = ticket.status === 'Done' || ticket.status === 'DONE';

  const typeColors = {
    Task: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    Bug: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    Feature: 'bg-brand-500/10 text-brand-300 border-brand-500/20',
    Improvement: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    Risk: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    'Staffing Request': 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  };

  const priorityColors = {
    LOW: 'text-slate-400',
    MEDIUM: 'text-cyan-400',
    HIGH: 'text-amber-400',
    URGENT: 'text-orange-400',
    CRITICAL: 'text-rose-400 font-bold',
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-200 space-y-3 ${
        isBlocked
          ? 'bg-rose-950/20 border-rose-500/40 shadow-glow-rose'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-lg'
      }`}
    >
      {/* Header Badges */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] text-brand-400 font-bold">{ticket.id}</span>
          {ticket.ticket_type && (
            <span
              className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                typeColors[ticket.ticket_type] || 'bg-slate-800 text-slate-300'
              }`}
            >
              {ticket.ticket_type}
            </span>
          )}
        </div>
        <span className={`text-[10px] uppercase font-mono font-bold ${priorityColors[ticket.priority]}`}>
          {ticket.priority}
        </span>
      </div>

      {/* Title & Description */}
      <div>
        <Link
          to={`${basePath}/${ticket.id}`}
          className="text-xs font-bold text-white hover:text-brand-300 transition line-clamp-2 leading-relaxed"
        >
          {ticket.title}
        </Link>
        {ticket.description && (
          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{ticket.description}</p>
        )}
      </div>

      {/* Blocker Alert Banner */}
      {isBlocked && ticket.blocker_details && (
        <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start space-x-2 text-[10px] text-rose-300">
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2">Blocker: {ticket.blocker_details}</span>
        </div>
      )}

      {/* Release Request Alert */}
      {ticket.release_request && ticket.release_request.status === 'PENDING' && (
        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-300 flex items-center justify-between">
          <span className="font-semibold">Release Request Pending</span>
          <span className="font-mono text-[9px]">Awaiting Manager</span>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3 text-slate-500" />
            <span className="text-slate-300 truncate max-w-[100px]">
              {ticket.assignee_name || 'Unassigned'}
            </span>
          </div>
          {ticket.story_points > 0 && (
            <span className="font-mono text-slate-400 font-semibold">{ticket.story_points} SP</span>
          )}
        </div>

        <div className="flex items-center space-x-2.5">
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="flex items-center space-x-0.5 text-slate-400">
              <Paperclip className="w-3 h-3" />
              <span>{ticket.attachments.length}</span>
            </div>
          )}
          {ticket.comments && ticket.comments.length > 0 && (
            <div className="flex items-center space-x-0.5 text-slate-400">
              <MessageSquare className="w-3 h-3" />
              <span>{ticket.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
