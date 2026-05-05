import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, EmptyState } from '../../../shared/components';
import { useAsignacionObraBruta } from '../hooks/useAsignacionObraBruta';
import { AsignacionObraBrutaDetailCard } from '../components/AsignacionObraBrutaDetailCard';
import '../styles/asignaciones-obra-bruta.css';

export function DetalleAsignacionObraBrutaPage() {
  const { idAsignacionTarea } = useParams();
  const navigate = useNavigate();
  const { asignacion, loading, error } = useAsignacionObraBruta(Number(idAsignacionTarea));

  if (loading) return <Loader />;
  if (error) return <div className="error-banner">{error}</div>;
  if (!asignacion) return <EmptyState title="No encontrado" description="La asignación no existe." />;

  return (
    <div className="page-container small-page">
      <div className="page-header">
        <h1>Detalle de Asignación</h1>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => navigate('/asignaciones/obra-bruta')}>
            Volver
          </Button>
          {asignacion.estadoAsignacion !== 'CANCELADA' && (
            <Button onClick={() => navigate(`/asignaciones/obra-bruta/${idAsignacionTarea}/editar`)}>
              Editar
            </Button>
          )}
        </div>
      </div>

      <AsignacionObraBrutaDetailCard asignacion={asignacion} />
    </div>
  );
}
