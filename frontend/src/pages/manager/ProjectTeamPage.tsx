import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  Filter,
  Eye,
  PlusCircle,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CandidateDetailsDrawer } from '../../components/manager/CandidateDetailsDrawer';
import { MOCK_PROJECTS, MOCK_EMPLOYEES, MOCK_TEAM_PROPOSALS } from '../../data/mockData';
import { Employee } from '../../types/workforce';
import { api } from '../../services/api';

export const ProjectTeamPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!projectId) return;
      setIsLoading(true);
      try {
        const liveProj = await api.getProject(projectId);
        if (isMounted && liveProj) {
          setProjectData(liveProj);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        const mockProj = MOCK_PROJECTS.find((p) => p.id === projectId);
        if (isMounted) setProjectData(mockProj || MOCK_PROJECTS[0]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading team staffing matrix...</p>
      </div>
    );
  }

  const project = projectData || MOCK_PROJECTS[0];
  const proposal =
    (project.proposals && project.proposals[0]) ||
    project.latest_proposal ||
    MOCK_TEAM_PROPOSALS.find((prop) => prop.project_id === project.id);

  const proposalMembers = proposal?.allocation_proposal_members || [];

  const slots = (project.staffing_requirements || []).map((s: any) => {
    const assignedMembers = proposalMembers.filter(
      (m: any) => m.staffing_requirement_id === s.id,
    );
    return {
      id: s.id,
      role: s.role || s.required_role,
      skill: s.skill || s.skills?.name || 'General',
      min_proficiency: s.min_proficiency || s.minimum_proficiency || 1,
      headcount: s.headcount || s.required_headcount || 1,
      hours_per_week: s.hours_per_week || s.allocation_hours_per_week || 40,
      filled_headcount: assignedMembers.length,
      assigned_employees: assignedMembers.map((m: any) => m.employees?.name || 'Assigned Candidate'),
    };
  });

  const totalHeadcountRequired =
    slots.reduce((acc: number, s: any) => acc + Number(s.headcount || 1), 0) ||
    project.required_team_size ||
    1;
  const totalHeadcountFilled = slots.reduce((acc: number, s: any) => acc + (s.filled_headcount || 0), 0);
  const totalGaps = Math.max(totalHeadcountRequired - totalHeadcountFilled, 0);
  const coveragePct =
    totalHeadcountRequired > 0
      ? Math.round((totalHeadcountFilled / totalHeadcountRequired) * 100)
      : 100;

  const handleInspectEmployee = (empName: string) => {
    const found = MOCK_EMPLOYEES.find((e) => e.name === empName);
    if (found) {
      setSelectedEmployee(found);
      setIsDrawerOpen(true);
    }
  };

  const filteredSlots = slots.filter(
    (slot: any) =>
      slot.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.skill.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title={`Team Staffing Matrix: ${project.name}`}
        description="Multi-person role coverage, required proficiencies, and slot assignment governance."
        breadcrumbs={[
          { label: 'Manager Dashboard', path: '/manager/dashboard' },
          { label: 'Projects', path: '/manager/projects' },
          { label: project.name, path: `/manager/projects/${project.id}` },
          { label: 'Team Staffing' },
        ]}
        actions={
          <div className="flex items-center space-x-3">
            {proposal && (
              <Link
                to={`/manager/proposals/${proposal.id}`}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center space-x-2"
              >
                <Eye className="w-3.5 h-3.5 text-brand-400" />
                <span>View Allocation Proposal</span>
              </Link>
            )}
            <Link
              to={`/manager/projects/${project.id}/allocation`}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-glow-indigo transition flex items-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run Team Allocation</span>
            </Link>
          </div>
        }
      />

      {/* Staffing KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KpiCard
          title="Staffing Slots"
          value={slots.length}
          subtext="Distinct Role Profiles"
          icon={<Layers className="w-5 h-5 text-indigo-400" />}
        />
        <KpiCard
          title="Required Headcount"
          value={totalHeadcountRequired}
          subtext="Total Engineers Needed"
          icon={<Users className="w-5 h-5 text-brand-400" />}
        />
        <KpiCard
          title="Filled Positions"
          value={totalHeadcountFilled}
          subtext="Approved or Proposed"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        />
        <KpiCard
          title="Open Staffing Gaps"
          value={totalGaps}
          subtext={totalGaps > 0 ? 'Requires Allocation' : 'Fully Covered'}
          icon={<AlertTriangle className={`w-5 h-5 ${totalGaps > 0 ? 'text-amber-400' : 'text-slate-400'}`} />}
        />
        <KpiCard
          title="Coverage Rate"
          value={`${coveragePct}%`}
          subtext="Capacity Commitment"
          icon={<Clock className="w-5 h-5 text-cyan-400" />}
        />
      </div>

      {/* Slots Table Panel */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Staffing Matrix Slots</h3>
            <p className="text-xs text-slate-400">Governance and current assignment status for all project roles.</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by role or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-brand-500 w-64"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredSlots.map((slot: any, idx: number) => (
            <div key={slot.id || idx} className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-brand-300 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    {slot.role} <span className="text-slate-400 font-normal">({slot.skill})</span>
                  </h4>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
                    Min Prof: {slot.min_proficiency}/5
                  </span>
                  <span className="px-2.5 py-1 bg-brand-500/10 text-brand-300 rounded-lg border border-brand-500/20 font-semibold">
                    Headcount: {slot.headcount}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 rounded-lg border border-emerald-500/20 font-mono">
                    {slot.hours_per_week} hrs/wk
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">Assigned / Proposed:</span>
                  {slot.assigned_employees?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {slot.assigned_employees.map((name: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleInspectEmployee(name)}
                          className="px-2 py-0.5 rounded bg-brand-600/20 text-brand-300 border border-brand-500/30 text-[11px] font-semibold hover:bg-brand-600/30 transition"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-amber-400 italic">No candidates assigned yet</span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400">
                  Status:{' '}
                  <span
                    className={
                      slot.filled_headcount >= slot.headcount
                        ? 'text-emerald-400 font-bold'
                        : 'text-amber-400 font-bold'
                    }
                  >
                    {slot.filled_headcount >= slot.headcount ? 'Filled' : `${slot.headcount - slot.filled_headcount} Open`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Details Drawer */}
      {selectedEmployee && (
        <CandidateDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          candidate={selectedEmployee}
        />
      )}
    </div>
  );
};
