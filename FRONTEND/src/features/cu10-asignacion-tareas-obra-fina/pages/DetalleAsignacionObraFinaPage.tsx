import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, EmptyState } from '../../../shared/components';
import { useAsignacionObraFina } from '../hooks/useAsignacionObraFina';
import { AsignacionObraFinaDetailCard } from '../components/AsignacionObraFinaDetailCard';
import '../styles/asignaciones-obra-fina.css';

export function DetalleAsignacionObraFinaPage() {
  const { idAsignacionTarea } = useParams();
  const navigate = useNavigate();
  const { asignacion, loading, error } = useAsignacionObraFina(Number(idAsignacionTarea));

  if (loading) return <Loader />;
  if (error) return <div className="error-banner">{error}</div>;
  if (!asignacion) return <EmptyState title="No encontrado" description="La asignación no existe." />;

  return (
    <div className="page-container small-page">
      <div className="page-header">
        <h1>Detalle de Asignación - Obra Fina</h1>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => navigate('/asignaciones/obra-fina')}>
            Volver
          </Button>
          {asignacion.estadoAsignacion !== 'CANCELADA' && (
            <Button onClick={() => navigate(`/asignaciones/obra-fina/${idAsignacionTarea}/editar`)}>
              Editar
            </Button>
          )}
        </div>
      </div>

      <AsignacionObraFinaDetailCard asignacion={asignacion} />
    </div>
  );
}
