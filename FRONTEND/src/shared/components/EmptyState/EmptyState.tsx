import type { ReactNode } from 'react';
import './empty-state.css';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-content">
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-description">{description}</p>
        {action && <div className="empty-state-action">{action}</div>}
      </div>
    </div>
  );
}
