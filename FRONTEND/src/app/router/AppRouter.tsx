import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from './routes';
import { DashboardLayout } from '../layout/DashboardLayout';
import { AuthLayout } from '../layout/AuthLayout';
import LoginPage from '../../features/auth/pages/LoginPage';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ padding: '2rem' }}>
    <h2>{title}</h2>
    <p>Módulo pendiente de implementación.</p>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            
            {/* Placeholders CU01 - CU19 */}
            <Route path={ROUTES.CLIENTES} element={<PlaceholderPage title="Clientes" />} />
            <Route path={ROUTES.PROYECTOS} element={<PlaceholderPage title="Proyectos" />} />
            <Route path={ROUTES.CRONOGRAMAS} element={<PlaceholderPage title="Cronogramas" />} />
            <Route path={ROUTES.TAREAS_OBRA_FINA} element={<PlaceholderPage title="Tareas Obra Fina" />} />
            <Route path={ROUTES.TAREAS_OBRA_BRUTA} element={<PlaceholderPage title="Tareas Obra Bruta" />} />
            <Route path={ROUTES.SEGUIMIENTOS} element={<PlaceholderPage title="Seguimientos" />} />
            <Route path={ROUTES.CONTRATOS} element={<PlaceholderPage title="Contratos" />} />
            <Route path={ROUTES.TRABAJADORES} element={<PlaceholderPage title="Trabajadores" />} />
            <Route path={ROUTES.ASIGNACIONES_OBRA_BRUTA} element={<PlaceholderPage title="Asignaciones Obra Bruta" />} />
            <Route path={ROUTES.ASIGNACIONES_OBRA_FINA} element={<PlaceholderPage title="Asignaciones Obra Fina" />} />
            <Route path={ROUTES.ASIGNACIONES_CONTRATISTA} element={<PlaceholderPage title="Asignaciones Contratista" />} />
            <Route path={ROUTES.MATERIALES} element={<PlaceholderPage title="Materiales" />} />
            <Route path={ROUTES.PROVEEDORES} element={<PlaceholderPage title="Proveedores" />} />
            <Route path={ROUTES.ORDENES_COMPRA} element={<PlaceholderPage title="Órdenes de Compra" />} />
            <Route path={ROUTES.ENTREGAS_MATERIALES} element={<PlaceholderPage title="Entregas de Materiales" />} />
            <Route path={ROUTES.IA_ASIGNACION} element={<PlaceholderPage title="Asignación Inteligente de Materiales" />} />
            <Route path={ROUTES.IA_PRONOSTICO} element={<PlaceholderPage title="Pronóstico de Materiales (IA)" />} />
            <Route path={ROUTES.ALERTAS} element={<PlaceholderPage title="Alertas y Notificaciones" />} />
            <Route path={ROUTES.REPORTES} element={<PlaceholderPage title="Reportes PDF" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
