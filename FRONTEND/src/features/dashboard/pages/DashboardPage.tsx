import { useAuth } from '../../../app/providers/AuthProvider';
import { Card, Loader, Badge, Button } from '../../../shared/components';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { getSidebarConfig } from '../../../shared/utils/permissions';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    proyectosCount, 
    tareasFinaCount, 
    tareasBrutaCount, 
    materialesCount, 
    ordenesCompraCount, 
    alertasCount, 
    reportesCount, 
    loading, 
    errors 
  } = useDashboardSummary();

  const sidebarConfig = getSidebarConfig(user?.rol);

  const stats = [
    { label: 'Proyectos', value: proyectosCount, error: errors.proyectosCount, icon: '🏗️' },
    { label: 'Tareas Obra Fina', value: tareasFinaCount, error: errors.tareasFinaCount, icon: '🎨' },
    { label: 'Tareas Obra Bruta', value: tareasBrutaCount, error: errors.tareasBrutaCount, icon: '🧱' },
    { label: 'Materiales', value: materialesCount, error: errors.materialesCount, icon: '📦' },
    { label: 'Órdenes de Compra', value: ordenesCompraCount, error: errors.ordenesCompraCount, icon: '🛒' },
    { label: 'Alertas', value: alertasCount, error: errors.alertasCount, icon: '🔔' },
    { label: 'Reportes', value: reportesCount, error: errors.reportesCount, icon: '📊' },
  ];

  if (loading) return <Loader />;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard Principal</h1>
        <div className="welcome-message">
          <p>Bienvenido, <strong>{user?.nombre}</strong>. Tienes el rol de <Badge variant="info">{user?.rol}</Badge></p>
        </div>
      </header>

      <section className="stats-grid">
        {stats.map((stat, index) => (
          <Card key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.label}</h3>
              {stat.error ? (
                <span className="stat-error">{stat.error}</span>
              ) : (
                <span className="stat-value">{stat.value ?? 0}</span>
              )}
            </div>
          </Card>
        ))}
      </section>

      <section className="dashboard-sections">
        <Card title="Accesos Rápidos" className="quick-links-card">
          <div className="quick-links-grid">
            {sidebarConfig.map(group => 
              group.items.map((item, idx) => (
                <Button 
                  key={`${group.title}-${idx}`} 
                  variant="ghost" 
                  onClick={() => navigate(item.to)}
                  className="quick-link-btn"
                >
                  {item.label}
                </Button>
              ))
            ).flat().slice(0, 8)}
          </div>
        </Card>

        <Card title="Resumen de Módulos" className="modules-summary-card">
          <ul className="modules-list">
            {sidebarConfig.map((group, idx) => (
              <li key={idx}>
                <strong>{group.title}:</strong> {group.items.length} módulos disponibles
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
};
