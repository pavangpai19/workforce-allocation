import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { TicketCard } from './TicketCard';
import { Ticket, TicketStatus } from '../../types/workforce';

export interface KanbanBoardProps {
  tickets: Ticket[];
  basePath?: string;
  onTicketStatusChange?: (ticketId: string, newStatus: TicketStatus) => void;
  onCreateTicket?: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tickets,
  basePath = '/manager/tickets',
  onTicketStatusChange,
  onCreateTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const columns: { id: TicketStatus; label: string; dot: string }[] = [
    { id: 'Backlog', label: 'Backlog', dot: 'bg-slate-500' },
    { id: 'To Do', label: 'To Do', dot: 'bg-indigo-400' },
    { id: 'In Progress', label: 'In Progress', dot: 'bg-brand-400' },
    { id: 'In Review', label: 'In Review', dot: 'bg-cyan-400' },
    { id: 'Blocked', label: 'Blocked', dot: 'bg-rose-500' },
    { id: 'Done', label: 'Done', dot: 'bg-emerald-400' },
  ];

  const normalizeStatus = (status: string): TicketStatus => {
    const norm = status.toLowerCase().replace(/_/g, ' ');
    if (norm.includes('progress')) return 'In Progress';
    if (norm.includes('review')) return 'In Review';
    if (norm.includes('done')) return 'Done';
    if (norm.includes('blocked')) return 'Blocked';
    if (norm.includes('backlog')) return 'Backlog';
    return 'To Do';
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.ticket_type === typeFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesSearch && matchesType && matchesPriority;
  });

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets by ID or title..."
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-60"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Types</option>
            <option value="Task">Task</option>
            <option value="Feature">Feature</option>
            <option value="Bug">Bug</option>
            <option value="Improvement">Improvement</option>
            <option value="Risk">Risk</option>
            <option value="Staffing Request">Staffing Request</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {onCreateTicket && (
          <button
            onClick={onCreateTicket}
            className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-glow-indigo transition flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Ticket</span>
          </button>
        )}
      </div>

      {/* 6-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 min-h-[600px] overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTickets = filteredTickets.filter(
            (t) => normalizeStatus(t.status) === col.id
          );

          return (
            <div
              key={col.id}
              className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/90 flex flex-col space-y-3 min-w-[220px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{col.label}</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 font-mono font-bold">
                  {colTickets.length}
                </span>
              </div>

              {/* Column Cards Stream */}
              <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5">
                {colTickets.length > 0 ? (
                  colTickets.map((t) => (
                    <TicketCard
                      key={t.id}
                      ticket={t}
                      basePath={basePath}
                    />
                  ))
                ) : (
                  <div className="p-6 text-center text-[11px] text-slate-500 italic border border-dashed border-slate-800/80 rounded-xl">
                    No tickets in {col.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
