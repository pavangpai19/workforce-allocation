import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FolderKanban, Users, Star, ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { MOCK_PROJECTS } from '../../data/mockData';
import { api } from '../../services/api';

export const ProjectRequirementsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

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
        <p className="text-xs text-slate-400">Loading project requirements...</p>
      </div>
    );
  }

  const project = projectData || MOCK_PROJECTS[0];
  const requirements = project.staffing_requirements || [];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title={`Staffing Requirements: ${project.name}`}
        description="Detailed specification of engineering competencies, minimum skill proficiencies, and headcount allocations."
        breadcrumbs={[
          { label: 'Projects', path: '/manager/projects' },
          { label: project.name, path: `/manager/projects/${project.id}` },
          { label: 'Requirements' },
        ]}
        actions={
          <button
            onClick={() => navigate(`/manager/projects/${project.id}`)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Workspace</span>
          </button>
        }
      />

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs">
          <div>
            <h3 className="font-bold text-white text-sm">Staffing Slots Matrix</h3>
            <p className="text-slate-400">
              Total Planned Capacity: {project.required_team_size || requirements.length} Engineers
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {requirements.map((req: any, idx: number) => (
            <div key={req.id || idx} className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-white text-sm">
                    Slot {idx + 1}: {req.role || req.required_role}
                  </span>
                  <span className="text-slate-400 ml-2">({req.skill || req.skills?.name || 'General'})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 bg-brand-500/10 text-brand-300 font-semibold rounded-lg border border-brand-500/20">
                    {req.hours_per_week || req.allocation_hours_per_week || 40} hrs/week
                  </span>
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-300 font-semibold rounded-lg border border-slate-700">
                    {req.headcount ? `${req.headcount} Person(s)` : 'Headcount: 1'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/60 text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-400 block">Min Proficiency</span>
                  <div className="flex space-x-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= (req.min_proficiency || req.minimum_proficiency || 1)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Requirement Status</span>
                  <span className="font-bold text-emerald-400">
                    {req.is_mandatory !== false ? 'Mandatory Requirement' : 'Optional'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
