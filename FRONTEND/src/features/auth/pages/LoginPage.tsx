import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../../../app/providers/AuthProvider';
import { ROUTES } from '../../../app/router/routes';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="login-page">
      <div className="login-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, color: 'var(--color-primary)' }}>SuArq</h1>
        <p style={{ color: 'var(--color-text-muted)', margin: '0.5rem 0 0' }}>Ingresa a tu cuenta para continuar</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
