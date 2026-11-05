import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowLeft,
  Upload,
  Link2,
  Sparkles,
  Info,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { MOCK_EMPLOYEE_SKILLS, MOCK_PROJECTS } from '../../data/mockData';
import { EvidenceType } from '../../types/workforce';

export const EmployeeProgressNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('CERTIFICATE_UPLOAD');
  const [title, setTitle] = useState('');
  const [targetSkill, setTargetSkill] = useState(MOCK_EMPLOYEE_SKILLS[0].name);
  const [relatedProject, setRelatedProject] = useState(MOCK_PROJECTS[0].name);
  const [urlOrFile, setUrlOrFile] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/employee/progress');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Submit Skill Evidence or Progress Update"
        description="Upload official certifications, credential URLs, course completion transcripts, repository pull requests, or sprint release requests."
        breadcrumbs={[
          { label: 'Employee Portal', path: '/employee/dashboard' },
          { label: 'Progress Ledger', path: '/employee/progress' },
          { label: 'New Submission' },
        ]}
      />

      {submitted ? (
        <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3 animate-fadeIn">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Evidence Submitted Successfully!</h3>
          <p className="text-xs text-slate-300">
            Your submission has been logged to the verification queue and assigned to your manager for review.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 max-w-3xl">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase">Evidence Type</label>
            <select
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value as EvidenceType)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="CERTIFICATE_UPLOAD">Certificate Upload (PDF / Credly Token)</option>
              <option value="CREDENTIAL_URL">Credential Verification URL</option>
              <option value="COURSE_COMPLETION">Course Completion Transcript</option>
              <option value="PROJECT_REPO_LINK">Internal Repository / PR Link</option>
              <option value="WORK_ARTIFACT">Technical Architecture Work Artifact</option>
              <option value="INTERNAL_CONTRIBUTION">Internal Platform Contribution</option>
              <option value="SELF_REPORTED_UPDATE">Self-Reported Proficiency Update</option>
              <option value="LEARNING_GOAL">Add New Learning Goal</option>
              <option value="AVAILABILITY_UPDATE">Availability Window Update</option>
              <option value="TASK_COMPLETION_NOTE">Sprint Task Completion Note</option>
              <option value="ALLOCATION_RELEASE_REQUEST">Request Sprint Allocation Release</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase">Submission Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AWS Solutions Architect Professional Badge Verification"
              className="w-full p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Related Competency / Skill</label>
              <select
                value={targetSkill}
                onChange={(e) => setTargetSkill(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              >
                {MOCK_EMPLOYEE_SKILLS.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Related Project</label>
              <select
                value={relatedProject}
                onChange={(e) => setRelatedProject(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              >
                {MOCK_PROJECTS.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase">Evidence Link / Document URL</label>
            <input
              type="url"
              value={urlOrFile}
              onChange={(e) => setUrlOrFile(e.target.value)}
              placeholder="https://credly.com/badges/... or internal Git repository link"
              className="w-full p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase">Description & Reviewer Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide technical context, scope of contribution, and self-assessed proficiency change..."
              className="w-full p-3 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/employee/progress')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-glow-indigo transition"
            >
              Submit for Manager Review
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
