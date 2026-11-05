import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Layers,
  Plus,
  ArrowLeft,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  FolderKanban,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KanbanBoard } from '../../components/tickets/KanbanBoard';
import { CreateTicketModal } from '../../components/tickets/CreateTicketModal';
import { MOCK_PROJECTS, MOCK_TICKETS } from '../../data/mockData';
import { Ticket, TicketStatus } from '../../types/workforce';

export const ProjectBoardPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const project = MOCK_PROJECTS.find((p) => p.id === projectId) || MOCK_PROJECTS[0];
  const projectTickets = tickets.filter((t) => t.project_id === project.id);

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
      <PageHeader
        title={`Kanban Sprint Board: ${project.name}`}
        description={`Domain: ${project.domain} • Priority: Level ${project.priority} • ${projectTickets.length} active sprint tickets`}
        breadcrumbs={[
          { label: 'Manager Dashboard', path: '/manager/dashboard' },
          { label: 'Projects', path: '/manager/projects' },
          { label: project.name, path: `/manager/projects/${project.id}` },
          { label: 'Kanban Board' },
        ]}
        actions={
          <div className="flex items-center space-x-3">
            <Link
              to={`/manager/projects/${project.id}/backlog`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              Backlog View
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

      {/* Kanban Board Component */}
      <KanbanBoard
        tickets={projectTickets}
        basePath="/manager/tickets"
        onTicketStatusChange={handleTicketStatusChange}
        onCreateTicket={() => setIsCreateOpen(true)}
      />

      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateTicket}
        defaultProjectId={project.id}
      />
    </div>
  );
};
