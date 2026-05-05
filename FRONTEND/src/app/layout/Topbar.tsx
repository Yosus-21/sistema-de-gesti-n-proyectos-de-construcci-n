import { useAuth } from '../providers/AuthProvider';
import { Badge } from '../../shared/components';
import './layout.css';

export const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="system-status">Sistema de Gestión SuArq</span>
      </div>
      <div className="topbar-right">
        {user && (
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user.nombre}</span>
              <Badge variant="info">{user.rol}</Badge>
            </div>
            <button className="logout-btn" onClick={logout}>Cerrar Sesión</button>
          </div>
        )}
      </div>
    </header>
  );
};
