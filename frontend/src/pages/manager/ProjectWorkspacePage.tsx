import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Users,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Play,
  Settings,
  Flame,
  Briefcase,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  FileCheck,
  Plus,
  BarChart3,
  Calendar,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Tabs, TabItem } from '../../components/ui/Tabs';
import { WorkloadIndicator } from '../../components/ui/WorkloadIndicator';
import { RiskIndicator } from '../../components/ui/RiskIndicator';
import {
  MOCK_PROJECTS,
  MOCK_PROPOSALS,
  MOCK_EMPLOYEES,
  MOCK_TICKETS,
} from '../../data/mockData';
import { api } from '../../services/api';

export const ProjectWorkspacePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProject() {
      if (!projectId) return;
      setIsLoading(true);
      setLoadError(null);

      try {
        const liveProj = await api.getProject(projectId);
        if (isMounted && liveProj) {
          setProjectData(liveProj);
          setIsLoading(false);
          return;
        }
      } catch (err: any) {
        // Fallback to mock data if UUID not in database
        const mockProj = MOCK_PROJECTS.find((p) => p.id === projectId);
        if (isMounted) {
          if (mockProj) {
            setProjectData(mockProj);
          } else {
            setLoadError(`Project with ID "${projectId}" could not be found.`);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading project workspace...</p>
      </div>
    );
  }

  if (loadError || !projectData) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Project Not Found</h3>
        <p className="text-xs text-slate-400">{loadError || 'The requested project could not be located.'}</p>
        <button
          onClick={() => navigate('/manager/projects')}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  const project = projectData;
  const allocations = project.allocations || [];
  const assignedTeam =
    allocations.length > 0
      ? allocations.map((a: any) => ({
          id: a.employee_id,
          name: a.employees?.name || 'Assigned Engineer',
          role: a.employees?.role || 'Staff Engineer',
          allocated_hours: a.allocated_hours,
        }))
      : (MOCK_EMPLOYEES.filter((e) => project.assigned_team_ids?.includes(e.id)) || []);

  const projectTickets = MOCK_TICKETS.filter((t) => t.project_id === project.id);
  const pendingProposal =
    project.latest_proposal ||
    (project.proposals && project.proposals[0]) ||
    MOCK_PROPOSALS.find((p: any) => p.project_id === project.id);

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'board', label: 'Board', count: projectTickets.length },
    { id: 'backlog', label: 'Backlog' },
    { id: 'team', label: 'Team', count: assignedTeam.length },
    { id: 'requirements', label: 'Requirements' },
    { id: 'allocation', label: 'Allocation', count: pendingProposal ? 1 : 0 },
    { id: 'risks', label: 'Risks' },
    { id: 'activity', label: 'Activity' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <PageHeader
        title={project.name}
        description={project.description || 'Enterprise project with deterministic staffing governance.'}
        badge={<StatusBadge status={project.status || 'ACTIVE'} />}
        breadcrumbs={[
          { label: 'Manager Dashboard', path: '/manager/dashboard' },
          { label: 'Projects', path: '/manager/projects' },
          { label: project.name },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate(`/manager/projects/${project.id}/requirements`)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-brand-400" />
              <span>Edit Requirements</span>
            </button>
            <button
              onClick={() => navigate(`/manager/projects/${project.id}/team`)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Staffing Matrix</span>
            </button>
            <button
              onClick={() => navigate(`/manager/projects/${project.id}/allocation`)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-indigo transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run Allocation</span>
            </button>
          </div>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Staffing Coverage"
          value={`${project.current_team_size ?? assignedTeam.length}/${project.required_team_size ?? 4}`}
          subtext={`${project.staffing_coverage_pct ?? 0}% filled`}
          icon={<Users className="w-5 h-5 text-brand-400" />}
          variant={(project.staffing_coverage_pct ?? 0) === 100 ? 'healthy' : 'warning'}
        />
        <KpiCard
          title="Health Score"
          value={`${project.health_score ?? 95}/100`}
          subtext="Composite delivery index"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
          variant="healthy"
        />
        <KpiCard
          title="Delivery Risk"
          value={`${project.delivery_risk_pct ?? 12}%`}
          subtext="ML delivery delay estimate"
          icon={<Flame className="w-5 h-5 text-amber-400" />}
          variant={(project.delivery_risk_pct ?? 12) > 30 ? 'critical' : 'default'}
        />
        <KpiCard
          title="Deadline"
          value={`${project.deadline_days ?? 30} days`}
          subtext={project.deadline || project.end_date}
          icon={<Calendar className="w-5 h-5 text-indigo-400" />}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Project Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Metadata</span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Domain</span>
                    <span className="text-white font-semibold">{project.domain || 'Cloud Platform'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Priority Level</span>
                    <span className="text-brand-300 font-bold">Level {project.priority || project.project_priority} / 5</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Target Deadline</span>
                    <span className="text-indigo-300 font-semibold">{project.deadline || project.end_date}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Estimated Total Hours</span>
                    <span className="text-white font-mono">{project.estimated_total_hours} hrs</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 p-5 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Assigned Team Members ({assignedTeam.length})
                  </span>
                  <button
                    onClick={() => navigate(`/manager/projects/${project.id}/team`)}
                    className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
                  >
                    View Staffing Matrix
                  </button>
                </div>
                {assignedTeam.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {assignedTeam.map((emp: any) => (
                      <div key={emp.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-white">{emp.name}</h5>
                          <p className="text-[11px] text-slate-400">{emp.role}</p>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400">{emp.allocated_hours}h / wk</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                    No team members committed yet. Check proposed allocations under the Allocation tab.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Board */}
        {activeTab === 'board' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Project Work Tickets</h3>
              <button className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1">
                <Plus className="w-3.5 h-3.5" />
                <span>Create Ticket</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map((col) => {
                const tickets = projectTickets.filter((t) => t.status === col);
                return (
                  <div key={col} className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                      <span>{col.replace('_', ' ')}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {tickets.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {tickets.map((t) => (
                        <div key={t.id} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5 hover:border-slate-700 transition">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono text-brand-400">{t.id}</span>
                            <span className="text-[10px] font-bold text-slate-400">{t.story_points} SP</span>
                          </div>
                          <h5 className="text-xs font-semibold text-white line-clamp-2">{t.title}</h5>
                          <div className="text-[11px] text-slate-400 pt-1 flex justify-between">
                            <span>{t.assignee_name || 'Unassigned'}</span>
                            <span className="text-[10px] text-slate-500">{t.updated_at}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Other Tabs Placeholder */}
        {activeTab !== 'overview' && activeTab !== 'board' && (
          <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80 space-y-2 animate-fadeIn">
            <h4 className="text-sm font-bold text-white capitalize">{activeTab} Workspace Module</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Real-time telemetry and management controls for {project.name}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
