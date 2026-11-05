import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customItems }) => {
  const location = useLocation();

  const items = React.useMemo(() => {
    if (customItems) return customItems;

    const segments = location.pathname.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [];

    let currentPath = '';
    segments.forEach((seg, index) => {
      currentPath += `/${seg}`;
      const isLast = index === segments.length - 1;
      const formattedLabel = seg
        .replace(/-/g, ' ')
        .replace(/\w/g, (c) => c.toUpperCase());

      crumbs.push({
        label: formattedLabel,
        path: isLast ? undefined : currentPath,
      });
    });

    return crumbs;
  }, [location.pathname, customItems]);

  if (items.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-400">
      <Link to="/" className="hover:text-slate-200 transition">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((crumb, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          {crumb.path ? (
            <Link to={crumb.path} className="hover:text-brand-300 transition">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-slate-200 font-semibold">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
