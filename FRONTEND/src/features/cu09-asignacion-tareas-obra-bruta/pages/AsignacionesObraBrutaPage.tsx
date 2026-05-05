import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, ConfirmDialog, Loader, EmptyState } from '../../../shared/components';
import { useAsignacionesObraBruta } from '../hooks/useAsignacionesObraBruta';
import { useCancelarAsignacionObraBruta } from '../hooks/useCancelarAsignacionObraBruta';
import { AsignacionesObraBrutaTable } from '../components/AsignacionesObraBrutaTable';
import { AsignacionObraBrutaFilters } from '../components/AsignacionObraBrutaFilters';
import '../styles/asignaciones-obra-bruta.css';

export function AsignacionesObraBrutaPage() {
  const navigate = useNavigate();
  const { asignaciones, loading, error, setFiltros, refetch } = useAsignacionesObraBruta();
  const { cancelarAsignacion, loading: canceling } = useCancelarAsignacionObraBruta();
  
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
        <h1>Asignaciones de Obra Bruta</h1>
        <Button onClick={() => navigate('/asignaciones/obra-bruta/nueva')}>
          Nueva Asignación
        </Button>
      </div>

      <Card>
        <AsignacionObraBrutaFilters 
          onBuscar={(params) => setFiltros(params)}
          onLimpiar={() => setFiltros({})}
        />
      </Card>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <Loader />
      ) : asignaciones.length > 0 ? (
        <Card>
          <AsignacionesObraBrutaTable 
            data={asignaciones}
            onVer={(id) => navigate(`/asignaciones/obra-bruta/${id}`)}
            onEditar={(id) => navigate(`/asignaciones/obra-bruta/${id}/editar`)}
            onCancelar={(id) => setIdACancelar(id)}
          />
        </Card>
      ) : (
        <EmptyState 
          title="No hay asignaciones" 
          description="No se encontraron asignaciones de obra bruta con los filtros aplicados."
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
