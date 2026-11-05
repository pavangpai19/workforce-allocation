import React, { useState } from 'react';
import { PageHeader } from '../../components/shell/PageHeader';
import { Search, Filter, Mail, Briefcase } from 'lucide-react';
import { MOCK_EMPLOYEES } from '../../data/mockData';
import { Badge } from '../../components/common/Badge';

export const ManagerTeamPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  const departments = ['ALL', ...Array.from(new Set(MOCK_EMPLOYEES.map((e) => e.department)))];

  const filteredEmployees = MOCK_EMPLOYEES.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.skills.some((s) => (s.skill_name || s.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Engineering Workforce & Team Directory"
        description="Comprehensive capacity, skill distribution, and workload allocation status across all team members."
        actions={
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="font-semibold text-white">{MOCK_EMPLOYEES.length}</span> Total Engineers
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search engineers by name, role, skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Dept:</span>
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedDept === dept
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmployees.map((emp) => {
          const capacity = emp.weekly_capacity_hours || 40;
          const workload = emp.allocated_hours || 0;
          const utilization = Math.round((workload / capacity) * 100);

          const statusVariant =
            utilization > 100 ? 'danger' : utilization >= 85 ? 'warning' : 'success';

          const email = (emp as any).email || `${emp.name.toLowerCase().replace(/[^a-z]/g, '.')}@workforce.io`;

          return (
            <div
              key={emp.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition"
            >
              {/* Member Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
                    {emp.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{emp.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{emp.role}</p>
                  </div>
                </div>
                <Badge variant={statusVariant}>{utilization}% Load</Badge>
              </div>

              {/* Department & Email */}
              <div className="text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span>{emp.department}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{email}</span>
                </div>
              </div>

              {/* Workload Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Capacity Ratio</span>
                  <span className="font-mono text-slate-200 font-semibold">{workload}h / {capacity}h</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      utilization > 100
                        ? 'bg-rose-500'
                        : utilization >= 85
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(utilization, 100)}%` }}
                  />
                </div>
              </div>

              {/* Top Skills */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Verified Capabilities</span>
                <div className="flex flex-wrap gap-1.5">
                  {emp.skills.slice(0, 3).map((s, idx) => (
                    <span
                      key={s.skill_name || s.name || idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono"
                    >
                      {s.skill_name || s.name} (L{s.proficiency_level ?? s.proficiency ?? 3})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
