import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Layers,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Clock,
  User,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { CreateTicketModal } from '../../components/tickets/CreateTicketModal';
import { MOCK_PROJECTS, MOCK_TICKETS } from '../../data/mockData';
import { Ticket } from '../../types/workforce';

export const ProjectBacklogPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const project = MOCK_PROJECTS.find((p) => p.id === projectId) || MOCK_PROJECTS[0];
  const projectTickets = tickets.filter((t) => t.project_id === project.id);
  const totalSP = projectTickets.reduce((acc, t) => acc + (t.story_points || 0), 0);
  const totalHours = projectTickets.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);

  const filteredTickets = projectTickets.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTicket = (newT: Partial<Ticket>) => {
    setTickets((prev) => [newT as Ticket, ...prev]);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title={`Project Backlog & Sprint Planning: ${project.name}`}
        description="Prioritize engineering backlog tickets, assign sprint story points, and monitor capacity allocations."
        breadcrumbs={[
          { label: 'Manager Dashboard', path: '/manager/dashboard' },
          { label: 'Projects', path: '/manager/projects' },
          { label: project.name, path: `/manager/projects/${project.id}` },
          { label: 'Backlog' },
        ]}
        actions={
          <div className="flex items-center space-x-3">
            <Link
              to={`/manager/projects/${project.id}/board`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              Open Kanban Board
            </Link>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-glow-indigo transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Ticket</span>
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Backlog Size"
          value={`${projectTickets.length} Tickets`}
          subtext={`${totalSP} Total Story Points`}
          icon={<Layers className="w-5 h-5 text-brand-400" />}
        />
        <KpiCard
          title="Estimated Workload"
          value={`${totalHours} hrs`}
          subtext="Engineering Bandwidth"
          icon={<Clock className="w-5 h-5 text-emerald-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Sprint Cadence"
          value={`${project.deadline_days} Days Left`}
          subtext={`Target: ${project.deadline}`}
          icon={<Sparkles className="w-5 h-5 text-cyan-400" />}
        />
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Backlog Queue</h3>
            <p className="text-xs text-slate-400 mt-0.5">Drag, re-order, and triage project requirements</p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search backlog..."
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">ID & Type</th>
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Priority</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Assignee</th>
                <th className="pb-3 font-semibold font-mono">Estimate</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5">
                    <span className="font-mono text-brand-400 font-bold">{ticket.id}</span>
                    <span className="text-[10px] text-slate-400 block">{ticket.ticket_type}</span>
                  </td>
                  <td className="py-3.5 font-semibold text-white max-w-sm">
                    <Link to={`/manager/tickets/${ticket.id}`} className="hover:text-brand-300 transition">
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="py-3.5">
                    <span className="font-mono font-bold text-slate-300">{ticket.priority}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-300">{ticket.assignee_name || 'Unassigned'}</td>
                  <td className="py-3.5 font-mono">{ticket.estimated_hours}h ({ticket.story_points} SP)</td>
                  <td className="py-3.5 text-right">
                    <Link
                      to={`/manager/tickets/${ticket.id}`}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateTicket}
        defaultProjectId={project.id}
      />
    </div>
  );
};
