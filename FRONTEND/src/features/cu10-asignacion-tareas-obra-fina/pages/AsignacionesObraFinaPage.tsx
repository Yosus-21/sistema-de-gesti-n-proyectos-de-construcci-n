import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, ConfirmDialog, Loader, EmptyState } from '../../../shared/components';
import { useAsignacionesObraFina } from '../hooks/useAsignacionesObraFina';
import { useCancelarAsignacionObraFina } from '../hooks/useCancelarAsignacionObraFina';
import { AsignacionesObraFinaTable } from '../components/AsignacionesObraFinaTable';
import { AsignacionObraFinaFilters } from '../components/AsignacionObraFinaFilters';
import '../styles/asignaciones-obra-fina.css';

export function AsignacionesObraFinaPage() {
  const navigate = useNavigate();
  const { asignaciones, loading, error, setFiltros, refetch } = useAsignacionesObraFina();
  const { cancelarAsignacion, loading: canceling } = useCancelarAsignacionObraFina();
  
  const [idACancelar, setIdACancelar] = useState<number | null>(null);

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

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Asignaciones de Obra Fina</h1>
        <Button onClick={() => navigate('/asignaciones/obra-fina/nueva')}>
          Nueva Asignación
        </Button>
      </div>

      <Card>
        <AsignacionObraFinaFilters 
          onBuscar={(params) => setFiltros(params)}
          onLimpiar={() => setFiltros({})}
        />
      </Card>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <Loader />
      ) : asignaciones.length > 0 ? (
        <Card>
          <AsignacionesObraFinaTable 
            data={asignaciones}
            onVer={(id) => navigate(`/asignaciones/obra-fina/${id}`)}
            onEditar={(id) => navigate(`/asignaciones/obra-fina/${id}/editar`)}
            onCancelar={(id) => setIdACancelar(id)}
          />
        </Card>
      ) : (
        <EmptyState 
          title="No hay asignaciones" 
          description="No se encontraron asignaciones de obra fina con los filtros aplicados."
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
    </div>
  );
}
