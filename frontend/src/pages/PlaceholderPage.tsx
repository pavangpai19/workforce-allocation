import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/shell/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';

export const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const title = location.pathname
    .split('/')
    .filter(Boolean)
    .pop()
    ?.replace(/-/g, ' ')
    .replace(/\w/g, (c) => c.toUpperCase()) || 'Module';

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title={title}
        description={`Enterprise ${title} telemetry and management console.`}
      />
      <EmptyState
        title={`${title} Console`}
        description={`The ${title} view is integrated within the enterprise application shell.`}
        actionLabel="Return to Dashboard"
        onAction={() => navigate(-1)}
      />
    </div>
  );
};
