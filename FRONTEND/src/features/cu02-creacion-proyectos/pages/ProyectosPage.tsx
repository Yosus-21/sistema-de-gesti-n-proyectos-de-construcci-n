import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, EmptyState, Can } from '../../../shared/components';
import { Role } from '../../../shared/types/roles.types';
import { useProyectos } from '../hooks/useProyectos';
import { useCambiarEstadoProyecto } from '../hooks/useCambiarEstadoProyecto';
import { ProyectosTable } from '../components/ProyectosTable';
import { ProyectoFilters } from '../components/ProyectoFilters';
import { CambiarEstadoProyectoDialog } from '../components/CambiarEstadoProyectoDialog';
import type { Proyecto, EstadoProyecto } from '../types/proyecto.types';
import '../styles/proyectos.css';

export function ProyectosPage() {
  const navigate = useNavigate();
  const { proyectos, loading, error, setFiltros, refetch } = useProyectos();
  const { cambiarEstadoProyecto, loading: updating } = useCambiarEstadoProyecto();
  
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const writeRoles = [Role.ADMIN, Role.GESTOR_PROYECTO];

  const handleBuscar = (busqueda: string, idCliente?: number) => {
    setFiltros({ busqueda, idCliente });
  };

  const handleLimpiar = () => {
    setFiltros({});
  };

  const handleOpenStatusDialog = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto);
    setDialogOpen(true);
  };

  const handleConfirmStatus = async (nuevoEstado: EstadoProyecto) => {
    if (!selectedProyecto) return;
    try {
      await cambiarEstadoProyecto(selectedProyecto.idProyecto, nuevoEstado);
      setDialogOpen(false);
      refetch();
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="proyectos-container">
      <header className="proyectos-header">
        <h1>Gestión de Proyectos</h1>
        <Can roles={writeRoles}>
          <Button onClick={() => navigate('/proyectos/nuevo')}>
            Nuevo Proyecto
          </Button>
        </Can>
      </header>

      {error && <div className="feedback-banner error">{error}</div>}

      <ProyectoFilters onBuscar={handleBuscar} onLimpiar={handleLimpiar} />

      {loading && !proyectos.length ? (
        <Loader text="Cargando proyectos..." />
      ) : proyectos.length > 0 ? (
        <ProyectosTable 
          proyectos={proyectos} 
          loading={loading} 
          onCambiarEstado={handleOpenStatusDialog}
        />
      ) : (
        <EmptyState
          title="Sin proyectos"
          description="No se encontraron proyectos registrados con los criterios de búsqueda."
          action={
            <Can roles={writeRoles}>
              <Button onClick={() => navigate('/proyectos/nuevo')}>
                Registrar primer proyecto
              </Button>
            </Can>
          }
        />
      )}

      {selectedProyecto && (
        <CambiarEstadoProyectoDialog
          open={dialogOpen}
          actualEstado={selectedProyecto.estadoProyecto}
          onConfirm={handleConfirmStatus}
          onCancel={() => setDialogOpen(false)}
          loading={updating}
        />
      )}
    </div>
  );
}
