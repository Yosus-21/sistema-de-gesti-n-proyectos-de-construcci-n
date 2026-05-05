import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { AccessDeniedPage } from '../../features/auth/pages/AccessDeniedPage';
import { DashboardLayout } from '../layout/DashboardLayout';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage';
import { Role } from '../../shared/types/roles.types';
import { NotFoundPage } from './NotFoundPage';
import {
  ClientesPage,
  RegistrarClientePage,
  DetalleClientePage,
  EditarClientePage,
} from '../../features/cu01-gestionar-clientes';
import {
  ProyectosPage,
  CrearProyectoPage,
  DetalleProyectoPage,
} from '../../features/cu02-creacion-proyectos';
import {
  CronogramasPage,
  CrearCronogramaPage,
  DetalleCronogramaPage,
} from '../../features/cu05-creacion-cronograma';
import {
  TrabajadoresPage,
  RegistrarTrabajadorPage,
  EditarTrabajadorPage,
  DetalleTrabajadorPage,
} from '../../features/cu08-gestion-trabajador';
import {
  SeguimientosPage,
  RegistrarSeguimientoPage,
  EditarSeguimientoPage,
  DetalleSeguimientoPage,
} from '../../features/cu06-gestion-seguimiento';
import {
  TareasObraFinaPage,
  RegistrarTareaObraFinaPage,
} from '../../features/cu03-gestion-tareas-obra-fina';
import {
  TareasObraBrutaPage,
  RegistrarTareaObraBrutaPage,
} from '../../features/cu04-gestion-tareas-obra-bruta';
import {
  AsignacionesObraBrutaPage,
  CrearAsignacionObraBrutaPage,
  DetalleAsignacionObraBrutaPage,
  EditarAsignacionObraBrutaPage,
} from '../../features/cu09-asignacion-tareas-obra-bruta';
import {
  AsignacionesObraFinaPage,
  CrearAsignacionObraFinaPage,
  DetalleAsignacionObraFinaPage,
  EditarAsignacionObraFinaPage,
} from '../../features/cu10-asignacion-tareas-obra-fina';
import {
  AsignacionesContratistaPage,
  CrearAsignacionContratistaPage,
  DetalleAsignacionContratistaPage,
} from '../../features/cu11-asignacion-tareas-contratista';
import {
  ContratosContratistaPage,
  RegistrarContratoContratistaPage,
  DetalleContratoContratistaPage,
  EditarContratoContratistaPage,
} from '../../features/cu07-gestion-contrato-contratista';
import {
  MaterialesPage,
  RegistrarMaterialPage,
  DetalleMaterialPage,
  EditarMaterialPage,
} from '../../features/cu12-registro-materiales';
import {
  ProveedoresPage,
  RegistrarProveedorPage,
  DetalleProveedorPage,
  EditarProveedorPage,
} from '../../features/cu13-gestion-proveedores';
import {
  OrdenesCompraPage,
  CrearOrdenCompraPage,
  EditarOrdenCompraPage,
  DetalleOrdenCompraPage,
} from '../../features/cu14-gestion-ordenes-compra';
import {
  EntregasMaterialesPage,
  RegistrarEntregaMaterialPage,
  DetalleEntregaMaterialPage,
} from '../../features/cu15-entrega-materiales';
import {
  AsignacionesMaterialIaPage,
  GenerarPropuestaAsignacionMaterialPage,
  DetalleAsignacionMaterialIaPage,
} from '../../features/cu16-asignacion-materiales-ia';
import {
  PronosticosMaterialIaPage,
  GenerarPronosticoMaterialPage,
  DetallePronosticoMaterialIaPage,
} from '../../features/cu17-pronostico-materiales-ia';
import {
  AlertasNotificacionesPage,
  ConfigurarAlertaPage,
  DetalleAlertaPage,
} from '../../features/cu18-alertas-notificaciones';
import {
  ReportesPage,
  GenerarReportePage,
  DetalleReportePage,
} from '../../features/cu19-reportes';
import { useAuth } from '../providers/AuthProvider';

const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/403" element={<AccessDeniedPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* CU01 – Gestionar Clientes */}
            <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.GESTOR_PROYECTO, Role.LECTOR]} />}>
              <Route path="/clientes" element={<ClientesPage />} />
              <Route path="/clientes/nuevo" element={<RegistrarClientePage />} />
              <Route path="/clientes/:idCliente" element={<DetalleClientePage />} />
              <Route path="/clientes/:idCliente/editar" element={<EditarClientePage />} />
            </Route>

            {/* Gestión de Proyectos */}
            <Route path="/proyectos" element={<ProyectosPage />} />
            <Route path="/proyectos/nuevo" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.GESTOR_PROYECTO]} />}>
              <Route index element={<CrearProyectoPage />} />
            </Route>
            <Route path="/proyectos/:idProyecto" element={<DetalleProyectoPage />} />

            <Route path="/cronogramas" element={<CronogramasPage />} />
            <Route path="/cronogramas/nuevo" element={<CrearCronogramaPage />} />
            <Route path="/cronogramas/:idCronograma" element={<DetalleCronogramaPage />} />

            <Route path="/tareas/obra-fina" element={<TareasObraFinaPage />} />
            <Route path="/tareas/obra-fina/nuevo" element={<RegistrarTareaObraFinaPage />} />
            <Route path="/tareas/obra-bruta" element={<TareasObraBrutaPage />} />
            <Route path="/tareas/obra-bruta/nuevo" element={<RegistrarTareaObraBrutaPage />} />
            <Route path="/seguimientos" element={<SeguimientosPage />} />
            <Route path="/seguimientos/nuevo" element={<RegistrarSeguimientoPage />} />
            <Route path="/seguimientos/:idSeguimiento" element={<DetalleSeguimientoPage />} />
            <Route path="/seguimientos/:idSeguimiento/editar" element={<EditarSeguimientoPage />} />

            {/* Contratos y Personal */}
            <Route path="/contratos" element={<ContratosContratistaPage />} />
            <Route path="/contratos/nuevo" element={<RegistrarContratoContratistaPage />} />
            <Route path="/contratos/:idContrato" element={<DetalleContratoContratistaPage />} />
            <Route path="/contratos/:idContrato/editar" element={<EditarContratoContratistaPage />} />
            <Route path="/trabajadores" element={<TrabajadoresPage />} />
            <Route path="/trabajadores/nuevo" element={<RegistrarTrabajadorPage />} />
            <Route path="/trabajadores/:idTrabajador" element={<DetalleTrabajadorPage />} />
            <Route path="/trabajadores/:idTrabajador/editar" element={<EditarTrabajadorPage />} />
            <Route path="/asignaciones/obra-bruta" element={<AsignacionesObraBrutaPage />} />
            <Route path="/asignaciones/obra-bruta/nueva" element={<CrearAsignacionObraBrutaPage />} />
            <Route path="/asignaciones/obra-bruta/:idAsignacionTarea" element={<DetalleAsignacionObraBrutaPage />} />
            <Route path="/asignaciones/obra-bruta/:idAsignacionTarea/editar" element={<EditarAsignacionObraBrutaPage />} />
            
            <Route path="/asignaciones/obra-fina" element={<AsignacionesObraFinaPage />} />
            <Route path="/asignaciones/obra-fina/nueva" element={<CrearAsignacionObraFinaPage />} />
            <Route path="/asignaciones/obra-fina/:idAsignacionTarea" element={<DetalleAsignacionObraFinaPage />} />
            <Route path="/asignaciones/obra-fina/:idAsignacionTarea/editar" element={<EditarAsignacionObraFinaPage />} />

            <Route path="/asignaciones/contratista" element={<AsignacionesContratistaPage />} />
            <Route path="/asignaciones/contratista/nueva" element={<CrearAsignacionContratistaPage />} />
            <Route path="/asignaciones/contratista/:idAsignacionTarea" element={<DetalleAsignacionContratistaPage />} />

            {/* Compras e Inventario */}
            <Route path="/materiales" element={<MaterialesPage />} />
            <Route path="/materiales/nuevo" element={<RegistrarMaterialPage />} />
            <Route path="/materiales/:idMaterial" element={<DetalleMaterialPage />} />
            <Route path="/materiales/:idMaterial/editar" element={<EditarMaterialPage />} />

            <Route path="/proveedores" element={<ProveedoresPage />} />
            <Route path="/proveedores/nuevo" element={<RegistrarProveedorPage />} />
            <Route path="/proveedores/:idProveedor" element={<DetalleProveedorPage />} />
            <Route path="/proveedores/:idProveedor/editar" element={<EditarProveedorPage />} />
            
            <Route path="/ordenes-compra" element={<OrdenesCompraPage />} />
            <Route path="/ordenes-compra/nueva" element={<CrearOrdenCompraPage />} />
            <Route path="/ordenes-compra/:idOrdenCompra" element={<DetalleOrdenCompraPage />} />
            <Route path="/ordenes-compra/:idOrdenCompra/editar" element={<EditarOrdenCompraPage />} />

            <Route path="/entregas-materiales" element={<EntregasMaterialesPage />} />
            <Route path="/entregas-materiales/nueva" element={<RegistrarEntregaMaterialPage />} />
            <Route path="/entregas-materiales/:idEntregaMaterial" element={<DetalleEntregaMaterialPage />} />

            {/* Inteligencia Artificial */}
            <Route path="/ia/asignacion-materiales" element={<AsignacionesMaterialIaPage />} />
            <Route path="/ia/asignacion-materiales/nueva" element={<GenerarPropuestaAsignacionMaterialPage />} />
            <Route path="/ia/asignacion-materiales/:idAsignacionMaterial" element={<DetalleAsignacionMaterialIaPage />} />

            <Route path="/ia/pronostico-materiales" element={<PronosticosMaterialIaPage />} />
            <Route path="/ia/pronostico-materiales/nuevo" element={<GenerarPronosticoMaterialPage />} />
            <Route path="/ia/pronostico-materiales/:idPronosticoMaterial" element={<DetallePronosticoMaterialIaPage />} />

            {/* Comunicación y Reportes */}
            <Route path="/alertas" element={<AlertasNotificacionesPage />} />
            <Route path="/alertas/nueva" element={<ConfigurarAlertaPage />} />
            <Route path="/alertas/:idAlerta" element={<DetalleAlertaPage />} />

            <Route path="/reportes" element={<ReportesPage />} />
            <Route path="/reportes/nuevo" element={<GenerarReportePage />} />
            <Route path="/reportes/:idReporte" element={<DetalleReportePage />} />
          </Route>
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
