import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, ConfirmDialog, Loader, EmptyState } from '../../../shared/components';
import { useAsignacionesContratista } from '../hooks/useAsignacionesContratista';
import { useCancelarAsignacionContratista } from '../hooks/useCancelarAsignacionContratista';
import { useReasignarTrabajadorContratista } from '../hooks/useReasignarTrabajadorContratista';
import { AsignacionesContratistaTable } from '../components/AsignacionesContratistaTable';
import { AsignacionContratistaFilters } from '../components/AsignacionContratistaFilters';
import { ReasignarTrabajadorContratistaDialog } from '../components/ReasignarTrabajadorContratistaDialog';
import '../styles/asignaciones-contratista.css';

export function AsignacionesContratistaPage() {
  const navigate = useNavigate();
  const { asignaciones, loading, error, setFiltros, refetch } = useAsignacionesContratista();
  const { cancelarAsignacion, loading: canceling } = useCancelarAsignacionContratista();
  const { reasignarTrabajador, loading: reassigning, error: errorReassign } = useReasignarTrabajadorContratista();
  
  const [idACancelar, setIdACancelar] = useState<number | null>(null);
  const [idAReasignar, setIdAReasignar] = useState<number | null>(null);

  const handleCancelar = async () => {
    if (idACancelar) {
      try {
        await cancelarAsignacion(idACancelar);
        setIdACancelar(null);
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleReasignar = async (data: { idTrabajador: number; observaciones?: string }) => {
    if (idAReasignar) {
      try {
        await reasignarTrabajador(idAReasignar, data);
        setIdAReasignar(null);
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Asignaciones por Contratista</h1>
        <Button onClick={() => navigate('/asignaciones/contratista/nueva')}>
          Nueva Asignación
        </Button>
      </div>

      <Card>
        <AsignacionContratistaFilters 
          onBuscar={(params) => setFiltros(params)}
          onLimpiar={() => setFiltros({})}
        />
      </Card>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <Loader />
      ) : asignaciones.length > 0 ? (
        <Card>
          <AsignacionesContratistaTable 
            data={asignaciones}
            onVer={(id) => navigate(`/asignaciones/contratista/${id}`)}
            onReasignar={(id) => setIdAReasignar(id)}
            onCancelar={(id) => setIdACancelar(id)}
          />
        </Card>
      ) : (
        <EmptyState 
          title="No hay asignaciones" 
          description="No se encontraron asignaciones por contratista con los filtros aplicados."
        />
      )}

      <ConfirmDialog
        open={!!idACancelar}
        title="Cancelar Asignación"
        message="¿Está seguro que desea cancelar esta asignación? Esta acción no se puede deshacer."
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
        onConfirm={handleCancelar}
        onCancel={() => setIdACancelar(null)}
        loading={canceling}
      />

      <ReasignarTrabajadorContratistaDialog
        open={!!idAReasignar}
        onConfirm={handleReasignar}
        onCancel={() => setIdAReasignar(null)}
        loading={reassigning}
        error={errorReassign}
      />
    </div>
  );
}
