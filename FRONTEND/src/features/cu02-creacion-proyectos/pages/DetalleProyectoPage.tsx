import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, Card } from '../../../shared/components';
import { useProyecto } from '../hooks/useProyecto';
import { useCambiarEstadoProyecto } from '../hooks/useCambiarEstadoProyecto';
import { ProyectoDetailCard } from '../components/ProyectoDetailCard';
import { CambiarEstadoProyectoDialog } from '../components/CambiarEstadoProyectoDialog';
import type { EstadoProyecto } from '../types/proyecto.types';
import '../styles/proyectos.css';

export function DetalleProyectoPage() {
  const { idProyecto } = useParams<{ idProyecto: string }>();
  const navigate = useNavigate();
  const id = idProyecto ? Number(idProyecto) : null;
  
  const { proyecto, loading, error, refetch } = useProyecto(id);
  const { cambiarEstadoProyecto, loading: updating } = useCambiarEstadoProyecto();
  
  const [dialogOpen, setDialogOpen] = useState(false);

  if (loading && !proyecto) return <Loader text="Cargando detalles del proyecto..." />;
  if (error) return <div className="feedback-banner error">{error}</div>;
  if (!proyecto) return <Card>Proyecto no encontrado</Card>;

  const handleConfirmStatus = async (nuevoEstado: EstadoProyecto) => {
    try {
      await cambiarEstadoProyecto(proyecto.idProyecto, nuevoEstado);
      setDialogOpen(false);
      refetch();
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="proyectos-container">
      <header className="proyectos-header">
        <div className="header-titles">
          <h1>Detalle de Proyecto</h1>
        </div>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => navigate('/proyectos')}>
            Volver
          </Button>
          <Button variant="secondary" onClick={() => setDialogOpen(true)}>
            Cambiar Estado
          </Button>
        </div>
      </header>

      <ProyectoDetailCard proyecto={proyecto} />

      <CambiarEstadoProyectoDialog
        open={dialogOpen}
        actualEstado={proyecto.estadoProyecto}
        onConfirm={handleConfirmStatus}
        onCancel={() => setDialogOpen(false)}
        loading={updating}
      />
    </div>
  );
}
