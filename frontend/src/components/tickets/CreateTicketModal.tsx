import React, { useState } from 'react';
import {
  X,
  Plus,
  Briefcase,
  Layers,
  User,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { MOCK_PROJECTS, MOCK_EMPLOYEES } from '../../data/mockData';
import { Ticket, TicketType, TicketPriority, TicketStatus } from '../../types/workforce';

export interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: Partial<Ticket>) => void;
  defaultProjectId?: string;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultProjectId,
}) => {
  const [projectId, setProjectId] = useState(defaultProjectId || MOCK_PROJECTS[0].id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ticketType, setTicketType] = useState<TicketType>('Task');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [status, setStatus] = useState<TicketStatus>('To Do');
  const [assigneeId, setAssigneeId] = useState(MOCK_EMPLOYEES[0].id);
  const [requiredSkill, setRequiredSkill] = useState('Cloud Architecture');
  const [estimatedHours, setEstimatedHours] = useState(10);
  const [storyPoints, setStoryPoints] = useState(3);
  const [deadline, setDeadline] = useState('2026-09-18');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Ticket title is required.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters.';
    }

    if (!estimatedHours || estimatedHours <= 0) {
      newErrors.estimatedHours = 'Estimated hours must be greater than 0.';
    }

    if (!storyPoints || storyPoints <= 0) {
      newErrors.storyPoints = 'Story points must be at least 1.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const proj = MOCK_PROJECTS.find((p) => p.id === projectId);
    const emp = MOCK_EMPLOYEES.find((e) => e.id === assigneeId);

    const newTicket: Partial<Ticket> = {
      id: `TCK-${Math.floor(400 + Math.random() * 500)}`,
      project_id: projectId,
      project_name: proj?.name || 'Project',
      title: title.trim(),
      description: description.trim(),
      ticket_type: ticketType,
      priority,
      status,
      assignee_id: assigneeId,
      assignee_name: emp?.name || 'Unassigned',
      reporter_id: 'mgr-1',
      reporter_name: 'Alex Rivera (Manager)',
      required_skill: requiredSkill,
      estimated_hours: Number(estimatedHours),
      story_points: Number(storyPoints),
      deadline,
      due_date: deadline,
      complexity: 3,
      updated_at: 'Just now',
      created_at: new Date().toISOString().slice(0, 10),
    };

    onSave(newTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-glass overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Create Work-Management Ticket</h3>
            <p className="text-xs text-slate-400 mt-0.5">Define task deliverables, staffing role, and capacity estimate</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition min-w-[32px] min-h-[32px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase">Project *</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                {MOCK_PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase">Ticket Type</label>
              <select
                value={ticketType}
                onChange={(e) => setTicketType(e.target.value as TicketType)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="Task">Task</option>
                <option value="Feature">Feature</option>
                <option value="Bug">Bug</option>
                <option value="Improvement">Improvement</option>
                <option value="Risk">Risk</option>
                <option value="Staffing Request">Staffing Request</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold uppercase">Ticket Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="e.g. Implement Dead Letter Queue for Kafka events"
              className={`w-full p-2.5 bg-slate-950 border rounded-xl text-white placeholder-slate-500 focus:outline-none transition ${
                errors.title ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/50' : 'border-slate-800 focus:border-brand-500'
              }`}
            />
            {errors.title && (
              <p className="text-rose-400 text-[11px] flex items-center space-x-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold uppercase">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed acceptance criteria and technical scope..."
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TicketStatus)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="Backlog">Backlog</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Blocked">Blocked</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                {MOCK_EMPLOYEES.map((e) => (
                  <option key={e.id} value={e.id}>{e.name} ({e.remaining_hours}h left)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase">Story Points</label>
              <input
                type="number"
                min={1}
                max={21}
                value={storyPoints}
                onChange={(e) => {
                  setStoryPoints(Number(e.target.value));
                  if (errors.storyPoints) setErrors((prev) => ({ ...prev, storyPoints: '' }));
                }}
                className={`w-full p-2.5 bg-slate-950 border rounded-xl text-white focus:outline-none font-mono ${
                  errors.storyPoints ? 'border-rose-500' : 'border-slate-800 focus:border-brand-500'
                }`}
              />
              {errors.storyPoints && (
                <p className="text-rose-400 text-[11px] mt-1">{errors.storyPoints}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase">Estimated Hours</label>
              <input
                type="number"
                min={1}
                max={100}
                value={estimatedHours}
                onChange={(e) => {
                  setEstimatedHours(Number(e.target.value));
                  if (errors.estimatedHours) setErrors((prev) => ({ ...prev, estimatedHours: '' }));
                }}
                className={`w-full p-2.5 bg-slate-950 border rounded-xl text-white focus:outline-none font-mono ${
                  errors.estimatedHours ? 'border-rose-500' : 'border-slate-800 focus:border-brand-500'
                }`}
              />
              {errors.estimatedHours && (
                <p className="text-rose-400 text-[11px] mt-1">{errors.estimatedHours}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500"
              />
            </div>
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
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold shadow-glow-indigo transition"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
