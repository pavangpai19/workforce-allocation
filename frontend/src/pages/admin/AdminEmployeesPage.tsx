import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Shield,
  Award,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { MOCK_EMPLOYEES } from '../../data/mockData';
import { Employee, UserRole } from '../../types/workforce';

export const AdminEmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [targetRole, setTargetRole] = useState<UserRole>('EMPLOYEE');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || emp.department === deptFilter;
    const matchesStatus = statusFilter === 'ALL' || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleOpenRoleModal = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsRoleModalOpen(true);
  };

  const handleConfirmRoleChange = () => {
    if (selectedEmployee) {
      setActionSuccess(`Updated RBAC role for ${selectedEmployee.name} to ${targetRole}.`);
      setIsRoleModalOpen(false);
      setSelectedEmployee(null);
    }
  };

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Employee Management & Governance"
        description="Manage organizational workforce records, capacity allocations, skill verifications, and RBAC roles."
        breadcrumbs={[{ label: 'Admin Console', path: '/admin/dashboard' }, { label: 'Employees' }]}
      />

      {actionSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 text-xs text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, department..."
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-64"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="AVAILABLE_AFTER_CONFIRMATION">Available after release</option>
            <option value="OVERALLOCATED">Overallocated</option>
            <option value="LEAVE">On Leave</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredEmployees.length} of {employees.length} employees
        </span>
      </div>

      {/* Employees Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department & Role</th>
                <th className="py-3 px-4">Capacity & Allocation</th>
                <th className="py-3 px-4">Top Skills</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEmployees.map((emp) => {
                const utilPct = Math.round((emp.allocated_hours / emp.weekly_capacity_hours) * 100);
                return (
                  <tr key={emp.id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-brand-300">
                          {emp.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-white">{emp.name}</div>
                          <div className="font-mono text-[10px] text-slate-400">{emp.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{emp.role}</div>
                      <div className="text-[10px] text-slate-400">{emp.department}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">
                          {emp.allocated_hours}h / {emp.weekly_capacity_hours}h
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            utilPct > 90
                              ? 'bg-rose-500/10 text-rose-400'
                              : utilPct > 75
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}
                        >
                          {utilPct}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">Available: {emp.remaining_hours}h</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {emp.skills.slice(0, 2).map((s) => (
                          <span
                            key={s.skill_id}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
                          >
                            {s.skill_name} (L{s.proficiency_level})
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold border ${
                          emp.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : emp.status === 'OVERALLOCATED'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenRoleModal(emp)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center space-x-1"
                        >
                          <Shield className="w-3 h-3" />
                          <span>Role</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Management Dialog */}
      {selectedEmployee && (
        <ConfirmationDialog
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          onConfirm={handleConfirmRoleChange}
          title={`Modify RBAC Role: ${selectedEmployee.name}`}
          message={`Select organizational access role for ${selectedEmployee.name} (${selectedEmployee.department}). This will immediately update portal routing and action permissions.`}
          confirmLabel="Apply Role Permission"
          variant="primary"
        >
          <div className="space-y-3 pt-3">
            <label className="text-xs font-bold text-slate-300">Assign Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['EMPLOYEE', 'MANAGER', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTargetRole(r)}
                  className={`p-3 rounded-xl border text-xs font-bold transition text-center ${
                    targetRole === r
                      ? 'bg-brand-600/20 border-brand-500 text-brand-300 shadow-glow-indigo'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </ConfirmationDialog>
      )}
    </div>
  );
};
