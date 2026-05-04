import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
