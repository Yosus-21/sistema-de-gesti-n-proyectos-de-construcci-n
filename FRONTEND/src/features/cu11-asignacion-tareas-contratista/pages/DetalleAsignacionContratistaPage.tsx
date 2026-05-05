import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, EmptyState } from '../../../shared/components';
import { useAsignacionContratista } from '../hooks/useAsignacionContratista';
import { AsignacionContratistaDetailCard } from '../components/AsignacionContratistaDetailCard';
import '../styles/asignaciones-contratista.css';

export function DetalleAsignacionContratistaPage() {
  const { idAsignacionTarea } = useParams();
  const navigate = useNavigate();
  const { asignacion, loading, error } = useAsignacionContratista(Number(idAsignacionTarea));

  if (loading) return <Loader />;
  if (error) return <div className="error-banner">{error}</div>;
  if (!asignacion) return <EmptyState title="No encontrado" description="La asignación no existe." />;

  return (
    <div className="page-container small-page">
      <div className="page-header">
        <h1>Detalle de Asignación - Contratista</h1>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => navigate('/asignaciones/contratista')}>
            Volver
          </Button>
        </div>
      </div>

      <AsignacionContratistaDetailCard asignacion={asignacion} />
    </div>
  );
}
