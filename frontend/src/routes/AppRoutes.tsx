import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/shell/AppLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

// Common Pages
import { NotFoundPage } from '../pages/common/NotFoundPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage';
import { SessionExpiredPage } from '../pages/auth/SessionExpiredPage';

// Manager Pages
import { ManagerDashboardPage } from '../pages/manager/ManagerDashboardPage';
import { ProjectsListPage } from '../pages/manager/ProjectsListPage';
import { CreateProjectWizardPage } from '../pages/manager/CreateProjectWizardPage';
import { ProjectWorkspacePage } from '../pages/manager/ProjectWorkspacePage';
import { ProjectRequirementsPage } from '../pages/manager/ProjectRequirementsPage';
import { ProjectTeamPage } from '../pages/manager/ProjectTeamPage';
import { ProjectAllocationAnalysisPage } from '../pages/manager/ProjectAllocationAnalysisPage';
import { ProposalReviewPage } from '../pages/manager/ProposalReviewPage';
import { AlertsCenterPage } from '../pages/manager/AlertsCenterPage';
import { DecisionHistoryPage } from '../pages/manager/DecisionHistoryPage';
import { ProjectBoardPage } from '../pages/manager/ProjectBoardPage';
import { ProjectBacklogPage } from '../pages/manager/ProjectBacklogPage';
import { ManagerTicketsHubPage } from '../pages/manager/ManagerTicketsHubPage';
import { ManagerTicketDetailPage } from '../pages/manager/ManagerTicketDetailPage';
import { ManagerTeamPage } from '../pages/manager/ManagerTeamPage';
import { ManagerSettingsPage } from '../pages/manager/ManagerSettingsPage';
import { IntelligencePipelinePage } from '../pages/manager/IntelligencePipelinePage';

// Employee Pages
import { EmployeeDashboardPage } from '../pages/employee/EmployeeDashboardPage';
import { EmployeeProfilePage } from '../pages/employee/EmployeeProfilePage';
import { EmployeePortfolioPage } from '../pages/employee/EmployeePortfolioPage';
import { EmployeeSkillsPage } from '../pages/employee/EmployeeSkillsPage';
import { EmployeeSkillDetailPage } from '../pages/employee/EmployeeSkillDetailPage';
import { EmployeeProgressPage } from '../pages/employee/EmployeeProgressPage';
import { EmployeeProgressNewPage } from '../pages/employee/EmployeeProgressNewPage';
import { EmployeeProjectsPage } from '../pages/employee/EmployeeProjectsPage';
import { EmployeeProjectDetailPage } from '../pages/employee/EmployeeProjectDetailPage';
import { EmployeeAllocationsPage } from '../pages/employee/EmployeeAllocationsPage';
import { EmployeePerformancePage } from '../pages/employee/EmployeePerformancePage';
import { EmployeeLearningPage } from '../pages/employee/EmployeeLearningPage';
import { EmployeeNotificationsPage } from '../pages/employee/EmployeeNotificationsPage';
import { EmployeeWhyNotSelectedPage } from '../pages/employee/EmployeeWhyNotSelectedPage';
import { EmployeeSettingsPage } from '../pages/employee/EmployeeSettingsPage';
import { EmployeeTicketDetailPage } from '../pages/employee/EmployeeTicketDetailPage';
import { ReportCompletionPage } from '../pages/employee/ReportCompletionPage';
import { EmployeeAvailabilityPage } from '../pages/employee/EmployeeAvailabilityPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminEmployeesPage } from '../pages/admin/AdminEmployeesPage';
import { AdminSkillsPage } from '../pages/admin/AdminSkillsPage';
import { AdminRolesPage } from '../pages/admin/AdminRolesPage';
import { AdminAlertsPage } from '../pages/admin/AdminAlertsPage';
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage';
import { AdminDecisionWeightsPage } from '../pages/admin/AdminDecisionWeightsPage';
import { AdminModelStatusPage } from '../pages/admin/AdminModelStatusPage';
import { AdminSystemHealthPage } from '../pages/admin/AdminSystemHealthPage';

/**
 * Intelligent root redirect handler based on authenticated user role.
 */
const RootRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'EMPLOYEE') {
    return <Navigate to="/employee/dashboard" replace />;
  }

  return <Navigate to="/manager/dashboard" replace />;
};

/**
 * Fallback handler: unauthenticated goes to /login, authenticated sees 404 inside layout.
 */
const GlobalFallback: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <NotFoundPage />
    </AppLayout>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/session-expired" element={<SessionExpiredPage />} />

      {/* Protected Manager Routes */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/manager/dashboard" replace />} />
        <Route path="dashboard" element={<ManagerDashboardPage />} />
        <Route path="projects" element={<ProjectsListPage />} />
        <Route path="projects/new" element={<CreateProjectWizardPage />} />
        <Route path="projects/:projectId" element={<ProjectWorkspacePage />} />
        <Route path="projects/:projectId/requirements" element={<ProjectRequirementsPage />} />
        <Route path="projects/:projectId/team" element={<ProjectTeamPage />} />
        <Route path="projects/:projectId/allocation" element={<ProjectAllocationAnalysisPage />} />
        <Route path="projects/:projectId/board" element={<ProjectBoardPage />} />
        <Route path="projects/:projectId/backlog" element={<ProjectBacklogPage />} />
        <Route path="proposals" element={<ProposalReviewPage />} />
        <Route path="proposals/:proposalId" element={<ProposalReviewPage />} />
        <Route path="allocations" element={<Navigate to="/manager/proposals" replace />} />
        <Route path="team" element={<ManagerTeamPage />} />
        <Route path="tickets" element={<ManagerTicketsHubPage />} />
        <Route path="tickets/:ticketId" element={<ManagerTicketDetailPage />} />
        <Route path="alerts" element={<AlertsCenterPage />} />
        <Route path="decision-history" element={<DecisionHistoryPage />} />
        <Route path="intelligence-pipeline" element={<IntelligencePipelinePage />} />
        <Route path="settings" element={<ManagerSettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Protected Employee Routes */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN', 'MANAGER']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboardPage />} />
        <Route path="allocations" element={<EmployeeAllocationsPage />} />
        <Route path="report-completion" element={<ReportCompletionPage />} />
        <Route path="availability" element={<EmployeeAvailabilityPage />} />
        <Route path="profile" element={<EmployeeProfilePage />} />
        <Route path="portfolio" element={<EmployeePortfolioPage />} />
        <Route path="skills" element={<EmployeeSkillsPage />} />
        <Route path="skills/:skillId" element={<EmployeeSkillDetailPage />} />
        <Route path="progress" element={<EmployeeProgressPage />} />
        <Route path="progress/new" element={<EmployeeProgressNewPage />} />
        <Route path="projects" element={<EmployeeProjectsPage />} />
        <Route path="projects/:projectId" element={<EmployeeProjectDetailPage />} />
        <Route path="tickets/:ticketId" element={<EmployeeTicketDetailPage />} />
        <Route path="performance" element={<EmployeePerformancePage />} />
        <Route path="learning" element={<EmployeeLearningPage />} />
        <Route path="notifications" element={<EmployeeNotificationsPage />} />
        <Route path="why-not-selected" element={<EmployeeWhyNotSelectedPage />} />
        <Route path="settings" element={<EmployeeSettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="employees" element={<AdminEmployeesPage />} />
        <Route path="skills" element={<AdminSkillsPage />} />
        <Route path="roles" element={<AdminRolesPage />} />
        <Route path="alerts" element={<AdminAlertsPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="decision-weights" element={<AdminDecisionWeightsPage />} />
        <Route path="model-status" element={<AdminModelStatusPage />} />
        <Route path="system-health" element={<AdminSystemHealthPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Root redirect to appropriate portal or login */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<GlobalFallback />} />
    </Routes>
  );
};
