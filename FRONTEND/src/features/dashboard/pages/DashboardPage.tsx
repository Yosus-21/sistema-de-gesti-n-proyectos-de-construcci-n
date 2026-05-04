import React from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <h1>Bienvenido, {user?.nombre}</h1>
      <p>Has iniciado sesión como <strong>{user?.rol}</strong>.</p>
      
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        <h3>Módulos del Sistema</h3>
        <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
          Utiliza la barra lateral para navegar a los distintos casos de uso implementados del sistema SuArq.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
