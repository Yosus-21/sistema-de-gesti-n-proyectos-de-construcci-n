import React from 'react';
import { useAuth } from '../providers/AuthProvider';

export const Topbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Placeholder para barra de busqueda u otras herramientas */}
      </div>
      <div className="topbar-right">
        <div className="user-info">
          <span className="user-name">{user?.nombre || 'Cargando...'}</span>
          <span className="user-role">{user?.rol}</span>
        </div>
        <button className="logout-btn" onClick={logout}>Cerrar Sesión</button>
      </div>
    </header>
  );
};
