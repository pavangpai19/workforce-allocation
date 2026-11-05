import React, { useState } from 'react';
import {
  User,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Star,
  Award,
  BookOpen,
  Send,
  Sparkles,
  Flame,
  Clock
} from 'lucide-react';
import { MOCK_EMPLOYEES, MOCK_PROJECTS } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';

export const EmployeeHub: React.FC = () => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>('emp-101');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  const employee = MOCK_EMPLOYEES.find((e) => e.id === selectedEmpId) || MOCK_EMPLOYEES[0];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackComment('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Employee Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-md border border-brand-500/20">
            Talent Experience Portal
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Employee Profile & Workload Hub
          </h1>
          <p className="text-sm text-slate-400">
            View allocated projects, proficiency matrix, workload health, and submit task completion signals.
          </p>
        </div>

        {/* Switch Active Employee View */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 pl-2">View As:</span>
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-brand-500"
          >
            {MOCK_EMPLOYEES.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Profile Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card & Core Quantified Metrics */}
        <div className="space-y-5">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center font-extrabold text-xl text-white shadow-glow-indigo">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{employee.name}</h2>
                <p className="text-xs text-brand-300 font-medium">{employee.role}</p>
                <p className="text-xs text-slate-400">{employee.department}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quantified Performance Profile (ML Signals)
              </h4>
              
              <div className="space-y-2.5">
                <ProgressBar
                  value={employee.efficiency_score * 100}
                  label="Efficiency Score"
                  sublabel="Speed & Delivery"
                  variant="brand"
                />
                <ProgressBar
                  value={employee.consistency_score * 100}
                  label="Consistency Score"
                  sublabel="Sprint Steadiness"
                  variant="emerald"
                />
                <ProgressBar
                  value={employee.reliability_score * 100}
                  label="Reliability Score"
                  sublabel="Commitment adherence"
                  variant="brand"
                />
                <ProgressBar
                  value={employee.availability_score * 100}
                  label="Availability Index"
                  sublabel="Bandwidth availability"
                  variant="brand"
                />
              </div>
            </div>
          </div>

          {/* Workload Health Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Workload Capacity Health</h4>
              <Badge variant={employee.burnout_risk_signal > 0.5 ? 'danger' : 'success'}>
                {employee.burnout_risk_signal > 0.5 ? 'High Risk Alert' : 'Balanced'}
              </Badge>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Weekly Capacity:</span>
                <span className="font-semibold text-white">{employee.weekly_capacity_hours} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Allocated This Week:</span>
                <span className="font-semibold text-brand-300">{employee.allocated_hours} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Remaining Available:</span>
                <span className="font-semibold text-emerald-400">{employee.remaining_hours} hrs</span>
              </div>
            </div>

            <ProgressBar
              value={(employee.allocated_hours / employee.weekly_capacity_hours) * 100}
              label="Utilization Ratio"
              variant={employee.allocated_hours / employee.weekly_capacity_hours > 0.8 ? 'rose' : 'brand'}
            />
          </div>

        </div>

        {/* Right Column: Skills Matrix & Project Assignments & Feedback Loop */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Skills & Proficiency Badges */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-400" />
                Verified Skills & Proficiency Matrix
              </h3>
              <span className="text-xs text-slate-400">1 to 5 Star Rating</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {employee.skills.map((skill) => (
                <div
                  key={skill.skill_id}
                  className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{skill.skill_name}</h4>
                    <span className="text-[10px] text-slate-400">Level {skill.proficiency_level} / 5 Expert</span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= (skill.proficiency_level ?? (typeof skill.proficiency === 'number' ? skill.proficiency : 4))
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Active Allocations */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-400" />
                Active Project Allocations
              </h3>
              <Badge variant="brand">Current Week</Badge>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">Cloud Infrastructure Modernization</h4>
                  <p className="text-slate-400 mt-0.5">Assigned Effort: <span className="text-brand-300 font-semibold">25 hrs / week</span></p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">In Progress</Badge>
                  <span className="text-slate-400 text-[11px]">Due in 14 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback & Retraining Loop Form */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-brand-400" />
                Task Outcome Feedback (Learning Loop Input)
              </h3>
              <Badge variant="brand">H-4 & H-6 Connected</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Submit realised project outcomes to update the decision engine weights via feedback reinforcement.
            </p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Allocation Satisfaction Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFeedbackRating(rating)}
                      className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                        feedbackRating === rating
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {rating} Star{rating > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Outcome Notes & Skill Feedback</label>
                <textarea
                  rows={2}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="e.g. Allocation matched project complexity well; completed milestone within estimated hours..."
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>

              <div className="flex justify-between items-center">
                {feedbackSubmitted ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Feedback recorded for model retraining!
                  </span>
                ) : <span />}

                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition shadow-glow-indigo"
                >
                  Submit Realised Outcome
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
