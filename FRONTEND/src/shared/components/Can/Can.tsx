import type { ReactNode } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { hasRole } from '../../utils/permissions';
import type { Role } from '../../types/roles.types';

interface CanProps {
  roles?: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component for conditional rendering based on user roles.
 */
export function Can({ roles, children, fallback = null }: CanProps) {
  const { user } = useAuth();

  if (!roles || roles.length === 0) {
    return <>{children}</>;
  }

  const isAllowed = user && hasRole(user.rol, roles);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
