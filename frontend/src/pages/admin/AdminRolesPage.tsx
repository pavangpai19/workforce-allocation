import React from 'react';
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  UserCheck,
  Key,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { MOCK_ROLE_PERMISSIONS } from '../../data/mockData';

export const AdminRolesPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Role-Based Access Control (RBAC) & Security Policy"
        description="System authorization matrix, endpoint security guardrails, and privacy boundaries."
        breadcrumbs={[{ label: 'Admin Console', path: '/admin/dashboard' }, { label: 'Roles & Permissions' }]}
      />

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 bg-indigo-950/10 space-y-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white uppercase font-mono">MANAGER</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Project requirements definition, candidate team proposal review, human approval sign-off, backlog triage, ticket delegation, and evidence verification.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-brand-500/20 bg-brand-950/10 space-y-2">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-brand-400" />
            <h4 className="text-xs font-bold text-white uppercase font-mono">EMPLOYEE</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Personal profile & portfolio, skills self-reporting, progress ledger submissions, assigned ticket execution, deliverable PR attachments, and allocation release requests.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 bg-purple-950/10 space-y-2">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold text-white uppercase font-mono">ADMIN</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            System-wide user governance, decision engine scoring weights calibration, skills framework cataloguing, immutable audit logs inspection, and ML telemetry health.
          </p>
        </div>
      </div>

      {/* RBAC Matrix Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-2">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Role Permission Matrix</h3>
            <p className="text-xs text-slate-400">Strict backend-enforced RBAC authorizations across all feature boundaries</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Feature Area</th>
                <th className="py-3 px-4">Permission Name & Scope</th>
                <th className="py-3 px-4 text-center">Manager</th>
                <th className="py-3 px-4 text-center">Employee</th>
                <th className="py-3 px-4 text-center">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {MOCK_ROLE_PERMISSIONS.map((perm, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition">
                  <td className="py-3 px-4 font-bold text-slate-300">{perm.feature_area}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{perm.permission}</div>
                    <div className="text-[10px] text-slate-400">{perm.description}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.manager ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.employee ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.admin ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unauthorized Access Security Architecture */}
      <div className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Unauthorized Access & Privacy Guardrails</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <h5 className="font-bold text-white">Backend-Enforced Authorization</h5>
            <p>Every REST endpoint validates the incoming JWT signature and extracts the user claim role. Any privilege escalation attempt yields HTTP 403 Forbidden with automatic client redirection to <code>/unauthorized</code>.</p>
          </div>
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <h5 className="font-bold text-white">Strict Employee Privacy Isolation</h5>
            <p>Employee views strictly filter and isolate records to the authenticated user ID. Employees never receive competing candidate scores, peer non-selection rationales, or organization-wide salary metrics.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
