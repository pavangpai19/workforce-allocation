import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  RotateCcw,
  LayoutGrid,
  List as ListIcon,
  User,
  FolderKanban,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { KanbanBoard } from '../../components/tickets/KanbanBoard';
import { CreateTicketModal } from '../../components/tickets/CreateTicketModal';
import { MOCK_TICKETS, MOCK_PROJECTS, MOCK_EMPLOYEES } from '../../data/mockData';
import { Ticket, TicketStatus, TicketPriority } from '../../types/workforce';

export const ManagerTicketsHubPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL');

  // KPI calculations
  const totalCount = tickets.length;
  const blockedCount = tickets.filter((t) => t.status === 'Blocked' || t.status === 'BLOCKED').length;
  const inReviewCount = tickets.filter((t) => t.status === 'In Review' || t.status === 'REVIEW').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress' || t.status === 'IN_PROGRESS').length;
  const doneCount = tickets.filter((t) => t.status === 'Done' || t.status === 'DONE').length;

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'ALL' ||
        t.status.toLowerCase().replace(/_/g, ' ') === statusFilter.toLowerCase().replace(/_/g, ' ');

      const matchesPriority =
        priorityFilter === 'ALL' || t.priority.toUpperCase() === priorityFilter.toUpperCase();

      const matchesProject =
        projectFilter === 'ALL' || t.project_id === projectFilter || t.project_name === projectFilter;

      const matchesAssignee =
        assigneeFilter === 'ALL' ||
        t.assignee_id === assigneeFilter ||
        t.assignee_name === assigneeFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssignee;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter, projectFilter, assigneeFilter]);

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    projectFilter !== 'ALL' ||
    assigneeFilter !== 'ALL';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setProjectFilter('ALL');
    setAssigneeFilter('ALL');
  };

  const handleCreateTicket = (newT: Partial<Ticket>) => {
    setTickets((prev) => [newT as Ticket, ...prev]);
  };

  const handleTicketStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header with Title, Subtitle, and Primary Actions */}
      <PageHeader
        title="Enterprise Work & Ticket Management Hub"
        description="Unified issue tracking, cross-project sprint allocations, blocker resolutions, and completion evidence reviews."
        breadcrumbs={[
          { label: 'Manager Dashboard', path: '/manager/dashboard' },
          { label: 'Tickets' },
        ]}
        actions={
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  viewMode === 'board' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Kanban Board View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Board</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Table List View"
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-glow-indigo transition flex items-center space-x-1.5 min-h-[36px]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Ticket</span>
            </button>
          </div>
        }
      />

      {/* 2. Summary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard
          title="Total Tickets"
          value={totalCount}
          subtext="Active in Sprints"
          icon={<Layers className="w-4 h-4 text-brand-400" />}
        />
        <KpiCard
          title="In Progress"
          value={inProgressCount}
          subtext="Under active development"
          icon={<Clock className="w-4 h-4 text-cyan-400" />}
        />
        <KpiCard
          title="Review Pending"
          value={inReviewCount}
          subtext="Evidence verification"
          icon={<CheckCircle2 className="w-4 h-4 text-amber-400" />}
          variant={inReviewCount > 0 ? 'warning' : 'default'}
        />
        <KpiCard
          title="Blockers"
          value={blockedCount}
          subtext={blockedCount > 0 ? 'Critical intervention' : 'All Clear'}
          icon={<AlertOctagon className={`w-4 h-4 ${blockedCount > 0 ? 'text-rose-400' : 'text-slate-400'}`} />}
          variant={blockedCount > 0 ? 'critical' : 'default'}
        />
        <KpiCard
          title="Completed"
          value={doneCount}
          subtext="Verified & Delivered"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          variant="healthy"
        />
      </div>

      {/* 3. Comprehensive Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[180px] sm:max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket ID, title, or keywords..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Backlog">Backlog</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Blocked">Blocked</option>
              <option value="Done">Done</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Project Filter */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer max-w-[180px] truncate"
            >
              <option value="ALL">All Projects</option>
              {MOCK_PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Assignee Filter */}
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer max-w-[180px] truncate"
            >
              <option value="ALL">All Assignees</option>
              {MOCK_EMPLOYEES.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters CTA & Match Count */}
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span>
              Showing <strong className="text-white font-mono">{filteredTickets.length}</strong> of{' '}
              <strong className="text-slate-300 font-mono">{tickets.length}</strong>
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Tickets Display (Board or List View) */}
      {viewMode === 'board' ? (
        <KanbanBoard
          tickets={filteredTickets}
          basePath="/manager/tickets"
          onTicketStatusChange={handleTicketStatusChange}
          onCreateTicket={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">ID & Type</th>
                  <th className="pb-3 font-semibold">Project</th>
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Priority</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Assignee</th>
                  <th className="pb-3 font-semibold font-mono">Estimate</th>
                  <th className="pb-3 font-semibold font-mono">Created</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5">
                        <span className="font-mono text-brand-400 font-bold">{t.id}</span>
                        <span className="text-[10px] text-slate-400 block">{t.ticket_type}</span>
                      </td>
                      <td className="py-3.5 font-semibold text-white max-w-[160px] truncate">
                        {t.project_name}
                      </td>
                      <td className="py-3.5 text-slate-200 font-semibold max-w-xs">
                        <Link to={`/manager/tickets/${t.id}`} className="hover:text-brand-300 transition line-clamp-1">
                          {t.title}
                        </Link>
                      </td>
                      <td className="py-3.5 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.priority === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : t.priority === 'URGENT' || t.priority === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                            t.status === 'Done'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : t.status === 'Blocked'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : t.status === 'In Review'
                              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-300 max-w-[140px] truncate">
                        {t.assignee_name || 'Unassigned'}
                      </td>
                      <td className="py-3.5 font-mono text-slate-400">
                        {t.estimated_hours}h / {t.story_points || 3}sp
                      </td>
                      <td className="py-3.5 font-mono text-slate-500 text-[11px]">
                        {t.created_at || 'Recently'}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          to={`/manager/tickets/${t.id}`}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition inline-block"
                        >
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500">
                      No tickets match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Clean Modal Creation Form */}
      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateTicket}
      />
    </div>
  );
};
