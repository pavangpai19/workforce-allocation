import React, { useState } from 'react';
import { PageHeader } from '../../components/shell/PageHeader';
import { CheckCircle2, Save, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_EMPLOYEES, MOCK_EMPLOYEE_ALLOCATIONS } from '../../data/mockData';

export const EmployeeAvailabilityPage: React.FC = () => {
  const { user } = useAuth();
  const currentEmployee = MOCK_EMPLOYEES.find(
    (e) =>
      e.id === user?.employeeId ||
      (user?.email && (e as any).email?.toLowerCase() === user.email.toLowerCase()) ||
      (user?.name && e.name.toLowerCase() === user.name.toLowerCase())
  ) || MOCK_EMPLOYEES[0];

  const totalAllocated = MOCK_EMPLOYEE_ALLOCATIONS.reduce((acc, a) => acc + a.allocated_hours, 0);
  const baseCapacity = currentEmployee.weekly_capacity_hours || 40;

  const [capacityHours, setCapacityHours] = useState(baseCapacity);
  const [availabilityStatus, setAvailabilityStatus] = useState<'AVAILABLE' | 'PARTIAL' | 'UNAVAILABLE'>('PARTIAL');
  const [availableFromDate, setAvailableFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [preferredDomains, setPreferredDomains] = useState('Cloud Platform, Distributed Systems, AI Infrastructure');
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const availableHours = Math.max(0, capacityHours - totalAllocated);
  const utilizationPct = Math.round((totalAllocated / capacityHours) * 100);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Workload Capacity & Availability"
        description="Manage your weekly capacity, forecast upcoming availability, and declare domain interests for future project matching."
        actions={
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-indigo transition flex items-center space-x-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Update Availability</span>
          </button>
        }
      />

      {isSaved && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Availability preferences saved. ML matching engine will prioritize these signals for upcoming sprint staffing.</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Weekly Capacity</span>
          <div className="text-2xl font-black text-white font-mono">{capacityHours} hrs</div>
          <span className="text-[11px] text-slate-500">Standard enterprise commitment</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Current Committed Load</span>
          <div className="text-2xl font-black text-brand-400 font-mono">{totalAllocated} hrs</div>
          <span className="text-[11px] text-slate-500">{utilizationPct}% Utilization Ratio</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Remaining Available Bandwidth</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">{availableHours} hrs</div>
          <span className="text-[11px] text-emerald-400/80">Available for new team allocation</span>
        </div>
      </div>

      {/* Form Settings */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <form onSubmit={handleSave} className="space-y-5 text-xs max-w-2xl">
          {/* Status Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Availability Status</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setAvailabilityStatus('AVAILABLE')}
                className={`p-3 rounded-xl border text-left transition ${
                  availabilityStatus === 'AVAILABLE'
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">Fully Available</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Ready for immediate project staffing</div>
              </button>

              <button
                type="button"
                onClick={() => setAvailabilityStatus('PARTIAL')}
                className={`p-3 rounded-xl border text-left transition ${
                  availabilityStatus === 'PARTIAL'
                    ? 'bg-brand-950/40 border-brand-500/50 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">Partially Allocated</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Committed to active sprints with spare capacity</div>
              </button>

              <button
                type="button"
                onClick={() => setAvailabilityStatus('UNAVAILABLE')}
                className={`p-3 rounded-xl border text-left transition ${
                  availabilityStatus === 'UNAVAILABLE'
                    ? 'bg-rose-950/40 border-rose-500/50 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">Upcoming Leave</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Planned time off or training block</div>
              </button>
            </div>
          </div>

          {/* Weekly Capacity Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-slate-300">Max Weekly Capacity Hours</label>
              <span className="font-mono text-brand-400 font-bold">{capacityHours} hrs/week</span>
            </div>
            <input
              type="range"
              min="20"
              max="50"
              step="5"
              value={capacityHours}
              onChange={(e) => setCapacityHours(parseInt(e.target.value, 10))}
              className="w-full accent-brand-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 mt-1">Adjust if you have approved flexible working hours or part-time scheduling.</p>
          </div>

          {/* Date Available From */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Effective Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="date"
                value={availableFromDate}
                onChange={(e) => setAvailableFromDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Preferred Domains */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Preferred Domains & Project Interests</label>
            <input
              type="text"
              value={preferredDomains}
              onChange={(e) => setPreferredDomains(e.target.value)}
              placeholder="e.g. Cloud Architecture, Rust Microservices, Distributed Data"
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Additional Notes for Managers</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mention planned PTO dates, timezone preferences, or concurrency limits..."
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-glow-indigo transition"
          >
            Save Availability
          </button>
        </form>
      </div>
    </div>
  );
};
