import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import type { Role } from '../../shared/types/roles.types';
import { hasRole } from '../../shared/utils/permissions';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed = user && hasRole(user.rol, allowedRoles);
    if (!isAllowed) {
      return <Navigate to="/403" replace />;
    }
  }

  return <Outlet />;
};
