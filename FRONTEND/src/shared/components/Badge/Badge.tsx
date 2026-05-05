import type { ReactNode } from 'react';
import './badge.css';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`}>{children}</span>
  );
}
