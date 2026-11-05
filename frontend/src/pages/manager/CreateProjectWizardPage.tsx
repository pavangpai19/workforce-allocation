import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus,
  Users,
  Sliders,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  ShieldCheck,
  Star,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { ProjectStaffingSlot, ProjectConstraints } from '../../types/workforce';
import { api } from '../../services/api';

export const CreateProjectWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Step 1: Project Basics
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('Data Platform');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<number>(4);
  const [estimatedTotalHours, setEstimatedTotalHours] = useState<number>(200);
  const [deadline, setDeadline] = useState('2026-12-15');
  const [requiredTeamSize, setRequiredTeamSize] = useState<number>(4);

  // Step 2: Multi-Row Team Staffing Requirements
  const [staffingRows, setStaffingRows] = useState<ProjectStaffingSlot[]>([
    {
      id: 'slot-1',
      role: 'ML Engineer',
      skill: 'Python',
      min_proficiency: 5,
      headcount: 2,
      hours_per_week: 20,
      preferred_skills: ['PyTorch', 'Feature Engineering'],
      experience_level: 'Lead',
      complexity: 4,
    },
    {
      id: 'slot-2',
      role: 'Database Engineer',
      skill: 'PostgreSQL',
      min_proficiency: 4,
      headcount: 2,
      hours_per_week: 20,
      preferred_skills: ['RLS Policies', 'Indexing', 'Query Optimization'],
      experience_level: 'Senior',
      complexity: 3,
    },
  ]);

  // Step 3: Constraints & Governance
  const [constraints, setConstraints] = useState<ProjectConstraints>({
    availability_window_start: '2026-11-05',
    availability_window_end: '2026-12-15',
    max_workload_ratio: 0.8,
    role_compatibility_strict: true,
    urgency: 'Standard',
    include_available_after_release: true,
    manager_notes: 'Priority deliverable with 9-feature ML scoring and deterministic candidate allocation.',
  });

  // Calculate planned headcount vs required
  const plannedHeadcount = staffingRows.reduce((sum, r) => sum + Number(r.headcount || 1), 0);
  const isHeadcountMatched = plannedHeadcount === requiredTeamSize;
  const isTitleValid = name.trim().length > 0;
  const canSubmit = isHeadcountMatched && isTitleValid && !isSubmitting;

  const addStaffingRow = () => {
    const newSlot: ProjectStaffingSlot = {
      id: `slot-${Date.now()}`,
      role: 'Software Engineer',
      skill: 'Python',
      min_proficiency: 3,
      headcount: 1,
      hours_per_week: 20,
      preferred_skills: [],
      experience_level: 'Mid',
      complexity: 3,
    };
    setStaffingRows([...staffingRows, newSlot]);
  };

  const removeStaffingRow = (id: string) => {
    if (staffingRows.length <= 1) return;
    setStaffingRows(staffingRows.filter((r) => r.id !== id));
  };

  const updateStaffingRow = (id: string, updates: Partial<ProjectStaffingSlot>) => {
    setStaffingRows(staffingRows.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const handleRunAllocation = async () => {
    if (!isTitleValid) {
      setSubmissionError('Project title is required. Please specify a title in Step 1.');
      setCurrentStep(1);
      return;
    }

    if (!isHeadcountMatched) {
      setSubmissionError(
        `Headcount mismatch: Staffing requirements sum to ${plannedHeadcount} person(s), but Required Team Size is ${requiredTeamSize}. Please adjust Step 1 or Step 2 so they match before submitting.`,
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmissionError(null);

      // 1. Create project with staffing requirements and constraints
      const projectPayload = {
        name: name.trim(),
        domain,
        project_priority: priority,
        description: description.trim(),
        estimated_total_hours: estimatedTotalHours,
        deadline,
        end_date: deadline,
        start_date: constraints.availability_window_start || new Date().toISOString().split('T')[0],
        required_team_size: requiredTeamSize,
        staffing_requirements: staffingRows.map((r) => ({
          required_role: r.role,
          skill_name: r.skill,
          minimum_proficiency: r.min_proficiency,
          required_headcount: r.headcount,
          allocation_hours_per_week: r.hours_per_week,
          preferred_skills: r.preferred_skills,
          experience_level: r.experience_level,
          complexity: r.complexity,
        })),
        constraints,
      };

      const createdProject = await api.createProject(projectPayload);

      // 2. Trigger automated multi-person team proposal generation
      await api.generateTeamProposal({
        project_id: createdProject.id,
        include_fairness_adjustment: true,
      });

      // 3. Navigate to the project's real workspace
      navigate(`/manager/projects/${createdProject.id}`);
    } catch (err: any) {
      console.error('Failed to create project and generate allocation:', err);
      setSubmissionError(
        err.message || 'An unexpected error occurred while creating project and running allocation.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Create Project & Staffing Scope"
        description="Four-step enterprise wizard to configure project metadata, multi-row staffing requirements, and governance constraints."
        breadcrumbs={[
          { label: 'Projects', path: '/manager/projects' },
          { label: 'Create Project' },
        ]}
      />

      {/* Global Error Banner */}
      {submissionError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start space-x-3 text-xs text-rose-300 animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-rose-200">Validation / Execution Error</span>
            <p>{submissionError}</p>
          </div>
        </div>
      )}

      {/* Step Indicator Stepper */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {[
          { num: 1, label: '1. Project Basics' },
          { num: 2, label: '2. Staffing Scope' },
          { num: 3, label: '3. Constraints' },
          { num: 4, label: '4. Review & Run' },
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => s.num < currentStep && setCurrentStep(s.num as any)}
            className={`p-3 rounded-2xl border text-center font-bold transition ${
              currentStep === s.num
                ? 'bg-brand-600 text-white border-brand-500 shadow-glow-indigo'
                : currentStep > s.num
                ? 'bg-emerald-950/20 text-emerald-300 border-emerald-500/30 cursor-pointer'
                : 'bg-slate-900/60 text-slate-500 border-slate-800'
            }`}
          >
            {s.label}
          </div>
        ))}
      </div>

      {/* Step 1: Project Basics */}
      {currentStep === 1 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 animate-fadeIn">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-brand-400" />
            Step 1: Project Basics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-medium mb-1.5">
                Project Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (submissionError) setSubmissionError(null);
                }}
                placeholder="e.g. Data Analysis"
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Domain Specialization</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Data Platform">Data Platform</option>
                <option value="Cloud Platform">Cloud Platform</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Security & Auth">Security & Auth</option>
                <option value="Frontend Architecture">Frontend Architecture</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Business Priority (1 to 5)</label>
              <select
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value={5}>Priority 5 (Critical Mission)</option>
                <option value={4}>Priority 4 (High Priority)</option>
                <option value={3}>Priority 3 (Medium Priority)</option>
                <option value={2}>Priority 2 (Standard)</option>
                <option value={1}>Priority 1 (Low)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-medium mb-1.5">Project Description & Scope</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe project scope, architecture goals, and key deliverable milestones..."
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Estimated Total Effort (Hours)</label>
              <input
                type="number"
                min={20}
                max={5000}
                value={estimatedTotalHours}
                onChange={(e) => setEstimatedTotalHours(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Target Delivery Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Required Team Size (Headcount)</label>
              <input
                type="number"
                min={1}
                max={20}
                value={requiredTeamSize}
                onChange={(e) => setRequiredTeamSize(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                if (!name.trim()) {
                  setSubmissionError('Please enter a Project Title before proceeding.');
                  return;
                }
                setSubmissionError(null);
                setCurrentStep(2);
              }}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-indigo transition flex items-center space-x-1.5"
            >
              <span>Next: Team Staffing Scope</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Team Staffing Requirements */}
      {currentStep === 2 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-400" />
                Step 2: Team Staffing Requirements
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Define required roles, skills, minimum proficiency levels, and allocated weekly hours.
              </p>
            </div>
            <button
              onClick={addStaffingRow}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staffing Slot</span>
            </button>
          </div>

          {/* Instant Staffing Summary Pill Bar */}
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-400">Staffing Scope:</span>
            {staffingRows.map((row) => (
              <span
                key={row.id}
                className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-300 border border-brand-500/20 font-semibold"
              >
                {row.role} ({row.skill}): {row.headcount} {row.headcount === 1 ? 'slot' : 'slots'} @ {row.hours_per_week}h/wk
              </span>
            ))}
          </div>

          {/* Multi-Row List */}
          <div className="space-y-4">
            {staffingRows.map((row, idx) => (
              <div key={row.id} className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-brand-300">
                      {idx + 1}
                    </span>
                    Slot Requirement: {row.role}
                  </span>
                  {staffingRows.length > 1 && (
                    <button
                      onClick={() => removeStaffingRow(row.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition"
                      title="Remove Slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Required Role</label>
                    <input
                      type="text"
                      value={row.role}
                      onChange={(e) => updateStaffingRow(row.id, { role: e.target.value })}
                      placeholder="e.g. ML Engineer"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Required Skill / Domain</label>
                    <input
                      type="text"
                      value={row.skill}
                      onChange={(e) => updateStaffingRow(row.id, { skill: e.target.value })}
                      placeholder="e.g. Python"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Min Proficiency (1-5)</label>
                    <select
                      value={row.min_proficiency}
                      onChange={(e) => updateStaffingRow(row.id, { min_proficiency: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <option key={lvl} value={lvl}>
                          Level {lvl} ({lvl === 5 ? 'Master' : lvl === 4 ? 'Expert' : lvl === 3 ? 'Competent' : 'Basic'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Headcount & Hours/Wk</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={row.headcount}
                        onChange={(e) => updateStaffingRow(row.id, { headcount: Number(e.target.value) })}
                        className="w-16 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-brand-500 text-center"
                        title="Headcount"
                      />
                      <input
                        type="number"
                        min={5}
                        max={40}
                        step={5}
                        value={row.hours_per_week}
                        onChange={(e) => updateStaffingRow(row.id, { hours_per_week: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-brand-500"
                        title="Hours per week"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Basics</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-indigo transition flex items-center space-x-1.5"
            >
              <span>Next: Governance Constraints</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Constraints & Governance */}
      {currentStep === 3 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 animate-fadeIn">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sliders className="w-5 h-5 text-brand-400" />
            Step 3: Constraints & Allocation Governance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Availability Window Start</label>
              <input
                type="date"
                value={constraints.availability_window_start}
                onChange={(e) => setConstraints({ ...constraints, availability_window_start: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Availability Window End</label>
              <input
                type="date"
                value={constraints.availability_window_end}
                onChange={(e) => setConstraints({ ...constraints, availability_window_end: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Max Workload Ratio Restriction</label>
              <select
                value={constraints.max_workload_ratio}
                onChange={(e) => setConstraints({ ...constraints, max_workload_ratio: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value={0.75}>75% Max Capacity (Burnout Preventive)</option>
                <option value={0.8}>80% Standard Guardrail</option>
                <option value={0.85}>85% Extended Capacity</option>
                <option value={1.0}>100% Full Capacity</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Staffing Urgency</label>
              <select
                value={constraints.urgency}
                onChange={(e) => setConstraints({ ...constraints, urgency: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Standard">Standard Sprint Schedule</option>
                <option value="Urgent">Urgent Priority</option>
                <option value="Critical">Critical Path Dependency</option>
              </select>
            </div>

            <div className="sm:col-span-2 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center">
                <input
                  id="release-check"
                  type="checkbox"
                  checked={constraints.include_available_after_release}
                  onChange={(e) => setConstraints({ ...constraints, include_available_after_release: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="release-check" className="ml-2 font-bold text-slate-200 cursor-pointer">
                  Include employees who are "Available After Release Confirmation"
                </label>
              </div>
              <p className="text-[11px] text-slate-400 pl-6">
                Enables the engine to consider top-tier talent currently finishing another milestone, pending manager sign-off.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-medium mb-1.5">Manager Allocation Notes</label>
              <textarea
                rows={2}
                value={constraints.manager_notes}
                onChange={(e) => setConstraints({ ...constraints, manager_notes: e.target.value })}
                placeholder="Specific guidance for the deterministic decision engine..."
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Staffing</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-indigo transition flex items-center space-x-1.5"
            >
              <span>Next: Review & Run</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review and Run */}
      {currentStep === 4 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 animate-fadeIn">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Step 4: Review Scope & Run Allocation Analysis
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verify staffing slots and governance rules before triggering the deterministic allocation engine.
            </p>
          </div>

          {/* Headcount Verification Banner */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Headcount Verification
              </span>
              <div className="text-base font-bold text-white mt-0.5">
                Required Team Size: <span className="text-brand-400">{requiredTeamSize}</span> vs Planned Staffing Slots:{' '}
                <span className={isHeadcountMatched ? 'text-emerald-400' : 'text-amber-400'}>
                  {plannedHeadcount}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isHeadcountMatched ? (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 font-bold rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Headcount Validated (Exact Match)</span>
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-500/10 text-amber-300 font-bold rounded-full border border-amber-500/20 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>
                    Mismatch: {Math.abs(requiredTeamSize - plannedHeadcount)} {plannedHeadcount > requiredTeamSize ? 'excess' : 'deficit'} slot(s)
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Blocking Warning if Headcount Does Not Match */}
          {!isHeadcountMatched && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start space-x-3 text-xs text-amber-300">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-200">Headcount Balance Required</span>
                <p className="mt-0.5">
                  The sum of required headcounts across your staffing slots ({plannedHeadcount}) must equal the Required Team Size ({requiredTeamSize}). Please return to Step 1 or Step 2 to align headcount before running allocation.
                </p>
              </div>
            </div>
          )}

          {/* Warning if Title is Missing */}
          {!isTitleValid && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start space-x-3 text-xs text-rose-300">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-200">Missing Project Title</span>
                <p className="mt-0.5">A valid project title is required. Return to Step 1 to enter a title.</p>
              </div>
            </div>
          )}

          {/* Summary Cards with Exact User Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
              <span className="font-bold text-slate-300 block pb-1 border-b border-slate-800">
                Project Basics Summary
              </span>
              <p>
                <strong className="text-slate-400">Title:</strong>{' '}
                <span className="text-white font-semibold">{name || '(No title entered)'}</span>
              </p>
              <p>
                <strong className="text-slate-400">Domain:</strong>{' '}
                <span className="text-slate-200">{domain}</span>
              </p>
              <p>
                <strong className="text-slate-400">Priority:</strong>{' '}
                <span className="text-brand-300 font-bold">{priority} / 5</span>
              </p>
              <p>
                <strong className="text-slate-400">Estimated Effort:</strong>{' '}
                <span className="text-slate-200 font-mono">{estimatedTotalHours} hours</span>
              </p>
              <p>
                <strong className="text-slate-400">Target Delivery Deadline:</strong>{' '}
                <span className="text-indigo-300 font-semibold">{deadline}</span>
              </p>
              <p>
                <strong className="text-slate-400">Required Team Size:</strong>{' '}
                <span className="text-white font-semibold">{requiredTeamSize} Engineers</span>
              </p>
              {description && (
                <div className="pt-1 text-[11px] text-slate-400">
                  <strong>Description:</strong> {description}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
              <span className="font-bold text-slate-300 block pb-1 border-b border-slate-800">
                Governance Constraints
              </span>
              <p>
                <strong className="text-slate-400">Allocation Window:</strong>{' '}
                <span className="text-slate-200">{constraints.availability_window_start} to {constraints.availability_window_end}</span>
              </p>
              <p>
                <strong className="text-slate-400">Max Capacity Ratio:</strong>{' '}
                <span className="text-slate-200">{(constraints.max_workload_ratio * 100).toFixed(0)}%</span>
              </p>
              <p>
                <strong className="text-slate-400">Urgency:</strong>{' '}
                <span className="text-slate-200">{constraints.urgency}</span>
              </p>
              <p>
                <strong className="text-slate-400">Release Confirmations:</strong>{' '}
                <span className="text-slate-200">
                  {constraints.include_available_after_release ? 'Included' : 'Excluded'}
                </span>
              </p>
              {constraints.manager_notes && (
                <div className="pt-1 text-[11px] text-slate-400">
                  <strong>Manager Notes:</strong> {constraints.manager_notes}
                </div>
              )}
            </div>
          </div>

          {/* Configured Staffing Slots Detail */}
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <span className="font-bold text-slate-300 block">
              Configured Staffing Slots ({staffingRows.length} Requirements)
            </span>
            <div className="space-y-2">
              {staffingRows.map((row, idx) => (
                <div
                  key={row.id}
                  className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-brand-300 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-white">{row.role}</span>
                    <span className="text-slate-400">({row.skill})</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Min Prof: {row.min_proficiency}/5
                    </span>
                    <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20 font-semibold">
                      Headcount: {row.headcount}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                      {row.hours_per_week} hrs/wk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentStep(3)}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Constraints</span>
            </button>

            <button
              onClick={handleRunAllocation}
              disabled={!canSubmit}
              className={`px-6 py-3 text-xs font-bold rounded-xl transition flex items-center space-x-2 ${
                canSubmit
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-glow-indigo cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating 9-Feature ML Candidates...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Allocation Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
