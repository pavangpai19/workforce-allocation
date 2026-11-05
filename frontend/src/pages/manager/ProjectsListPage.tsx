import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  LayoutGrid,
  List,
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  Clock,
  Users,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { FilterToolbar, FilterGroup } from '../../components/ui/FilterToolbar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ApiErrorState } from '../../components/ui/ApiErrorState';
import { DataTable, Column } from '../../components/ui/DataTable';
import { MOCK_PROJECTS } from '../../data/mockData';
import { Project } from '../../types/workforce';
import { api } from '../../services/api';

export const ProjectsListPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [staffingFilter, setStaffingFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [liveProjects, setLiveProjects] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchLiveProjects() {
      setIsLoading(true);
      try {
        const projs = await api.getProjects();
        if (isMounted && projs && projs.length > 0) {
          setLiveProjects(projs);
        }
      } catch (err: any) {
        console.warn('Could not fetch live projects from backend:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchLiveProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const allProjects = useMemo(() => {
    const liveIds = new Set(liveProjects.map((p) => p.id));
    const merged = [...liveProjects];
    for (const mock of MOCK_PROJECTS) {
      if (!liveIds.has(mock.id)) {
        merged.push(mock);
      }
    }
    return merged;
  }, [liveProjects]);

  const filterGroups: FilterGroup[] = [
    {
      id: 'status',
      label: 'Status',
      selectedValue: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'All Statuses', value: 'ALL' },
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Planning', value: 'PLANNING' },
        { label: 'Completed', value: 'COMPLETED' },
      ],
    },
    {
      id: 'priority',
      label: 'Priority',
      selectedValue: priorityFilter,
      onChange: setPriorityFilter,
      options: [
        { label: 'All Priorities', value: 'ALL' },
        { label: 'Priority 5 (Critical)', value: '5' },
        { label: 'Priority 4 (High)', value: '4' },
        { label: 'Priority 3 (Medium)', value: '3' },
      ],
    },
    {
      id: 'staffing',
      label: 'Staffing State',
      selectedValue: staffingFilter,
      onChange: setStaffingFilter,
      options: [
        { label: 'All Staffing', value: 'ALL' },
        { label: 'Staffed (100%)', value: 'STAFFED' },
        { label: 'Staffing Gaps', value: 'STAFFING_GAPS' },
        { label: 'Overallocated', value: 'OVERALLOCATED' },
      ],
    },
    {
      id: 'risk',
      label: 'Risk State',
      selectedValue: riskFilter,
      onChange: setRiskFilter,
      options: [
        { label: 'All Risks', value: 'ALL' },
        { label: 'Low Risk', value: 'LOW' },
        { label: 'Medium Risk', value: 'MEDIUM' },
        { label: 'High Risk', value: 'HIGH' },
      ],
    },
  ];

  const hasActiveFilters =
    searchQuery !== '' || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || staffingFilter !== 'ALL' || riskFilter !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setStaffingFilter('ALL');
    setRiskFilter('ALL');
  };

  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const pName = p.name || '';
      const pDomain = p.domain || '';
      const pDesc = p.description || '';
      const pPriority = (p.priority ?? p.project_priority ?? 3).toString();
      const pStatus = p.status || 'ACTIVE';
      const pStaffing = p.staffing_state || (p.staffing_coverage_pct === 100 ? 'STAFFED' : 'STAFFING_GAPS');
      const pRisk = p.risk_state || 'LOW';

      const matchSearch =
        pName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pDomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pDesc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || pStatus === statusFilter;
      const matchPriority = priorityFilter === 'ALL' || pPriority === priorityFilter;
      const matchStaffing = staffingFilter === 'ALL' || pStaffing === staffingFilter;
      const matchRisk = riskFilter === 'ALL' || pRisk === riskFilter;

      return matchSearch && matchStatus && matchPriority && matchStaffing && matchRisk;
    });
  }, [allProjects, searchQuery, statusFilter, priorityFilter, staffingFilter, riskFilter]);

  // Table Columns
  const tableColumns: Column<Project>[] = [
    {
      key: 'name',
      header: 'Project Title & Domain',
      sortable: true,
      render: (p: any) => (
        <div>
          <span className="font-bold text-white block hover:text-brand-300">{p.name}</span>
          <span className="text-[10px] text-slate-400">{p.domain || 'Platform'}</span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (p: any) => (
        <span className="font-semibold text-brand-300 font-mono">
          {p.priority ?? p.project_priority ?? 3} / 5
        </span>
      ),
    },
    {
      key: 'deadline',
      header: 'Deadline',
      sortable: true,
      render: (p: any) => (
        <span className="text-slate-300 font-mono text-[11px]">{p.deadline || p.end_date}</span>
      ),
    },
    {
      key: 'staffing_coverage_pct',
      header: 'Staffing Coverage',
      sortable: true,
      render: (p: any) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-500 h-full rounded-full"
              style={{ width: `${p.staffing_coverage_pct || 0}%` }}
            />
          </div>
          <span className="font-mono text-[11px] text-slate-300">
            {p.current_team_size || 0}/{p.required_team_size || 4}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: any) => <StatusBadge status={p.status || 'ACTIVE'} />,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <PageHeader
        title="Engineering Projects Portfolio"
        description="Active delivery roadmap, multi-person staffing coverage, and team allocation governance across all project initiatives."
        breadcrumbs={[
          { label: 'Manager Dashboard', path: '/manager/dashboard' },
          { label: 'Projects' },
        ]}
        actions={
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => navigate('/manager/projects/new')}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-indigo transition flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Project</span>
            </button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <FilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search projects by title, domain, keywords..."
        filterGroups={filterGroups}
        onResetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Error State if triggered */}
      {apiError && <ApiErrorState message={apiError} onRetry={() => setApiError(null)} />}

      {/* Loading Skeleton State */}
      {isLoading && allProjects.length === 0 ? (
        <LoadingSkeleton type={viewMode === 'grid' ? 'card' : 'table'} count={4} />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title="No Matching Projects Found"
          description="Try modifying your search criteria or resetting filters to see all enterprise projects."
          actionLabel="Clear Filters"
          onAction={resetFilters}
        />
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project: any) => (
            <div
              key={project.id}
              onClick={() => navigate(`/manager/projects/${project.id}`)}
              className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-brand-500/40 transition cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                      {project.domain || 'Platform'}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5 hover:text-brand-300 transition">
                      {project.name}
                    </h3>
                  </div>
                  <StatusBadge status={project.status || 'ACTIVE'} />
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {project.description || 'Enterprise project with deterministic staffing governance.'}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
                {/* Staffing Coverage Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Staffing Coverage:</span>
                    <span className="font-bold text-white">
                      {project.current_team_size || 0} / {project.required_team_size || 4} Staffed ({project.staffing_coverage_pct || 0}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (project.staffing_coverage_pct || 0) === 100
                          ? 'bg-emerald-500'
                          : (project.staffing_coverage_pct || 0) >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${project.staffing_coverage_pct || 0}%` }}
                    />
                  </div>
                </div>

                {/* Footer Info Meta */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Due {project.deadline || project.end_date}
                  </span>
                  <StatusBadge
                    status={project.risk_state || 'LOW'}
                    label={`${project.risk_state || 'LOW'} Risk`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <DataTable
          columns={tableColumns}
          data={filteredProjects}
          keyExtractor={(p: any) => p.id}
          onRowClick={(p: any) => navigate(`/manager/projects/${p.id}`)}
        />
      )}
    </div>
  );
};
