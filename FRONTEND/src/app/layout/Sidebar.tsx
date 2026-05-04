import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../router/routes';

export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>SuArq</h2>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-group">
          <span className="nav-group-title">Principal</span>
          <NavLink to={ROUTES.DASHBOARD} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
        </div>

        <div className="nav-group">
          <span className="nav-group-title">Gestión de Proyectos</span>
          <NavLink to={ROUTES.CLIENTES} className="nav-link">Clientes</NavLink>
          <NavLink to={ROUTES.PROYECTOS} className="nav-link">Proyectos</NavLink>
          <NavLink to={ROUTES.CRONOGRAMAS} className="nav-link">Cronogramas</NavLink>
          <NavLink to={ROUTES.TAREAS_OBRA_FINA} className="nav-link">Tareas Obra Fina</NavLink>
          <NavLink to={ROUTES.TAREAS_OBRA_BRUTA} className="nav-link">Tareas Obra Bruta</NavLink>
          <NavLink to={ROUTES.SEGUIMIENTOS} className="nav-link">Seguimientos</NavLink>
        </div>

        <div className="nav-group">
          <span className="nav-group-title">Contratos y Personal</span>
          <NavLink to={ROUTES.CONTRATOS} className="nav-link">Contratos</NavLink>
          <NavLink to={ROUTES.TRABAJADORES} className="nav-link">Trabajadores</NavLink>
          <NavLink to={ROUTES.ASIGNACIONES_OBRA_BRUTA} className="nav-link">Asig. Obra Bruta</NavLink>
          <NavLink to={ROUTES.ASIGNACIONES_OBRA_FINA} className="nav-link">Asig. Obra Fina</NavLink>
          <NavLink to={ROUTES.ASIGNACIONES_CONTRATISTA} className="nav-link">Asig. Contratista</NavLink>
        </div>

        <div className="nav-group">
          <span className="nav-group-title">Compras e Inventario</span>
          <NavLink to={ROUTES.MATERIALES} className="nav-link">Materiales</NavLink>
          <NavLink to={ROUTES.PROVEEDORES} className="nav-link">Proveedores</NavLink>
          <NavLink to={ROUTES.ORDENES_COMPRA} className="nav-link">Órdenes de Compra</NavLink>
          <NavLink to={ROUTES.ENTREGAS_MATERIALES} className="nav-link">Entregas</NavLink>
        </div>

        <div className="nav-group">
          <span className="nav-group-title">Inteligencia Artificial</span>
          <NavLink to={ROUTES.IA_ASIGNACION} className="nav-link">Asignación Materiales</NavLink>
          <NavLink to={ROUTES.IA_PRONOSTICO} className="nav-link">Pronóstico Materiales</NavLink>
        </div>

        <div className="nav-group">
          <span className="nav-group-title">Comunicación y Reportes</span>
          <NavLink to={ROUTES.ALERTAS} className="nav-link">Alertas y Notif.</NavLink>
          <NavLink to={ROUTES.REPORTES} className="nav-link">Reportes</NavLink>
        </div>
      </nav>
    </aside>
  );
};
