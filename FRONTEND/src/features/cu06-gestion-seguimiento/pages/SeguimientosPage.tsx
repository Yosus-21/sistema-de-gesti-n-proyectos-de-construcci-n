import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, EmptyState } from '../../../shared/components';
import { useSeguimientos } from '../hooks/useSeguimientos';
import { SeguimientosTable } from '../components/SeguimientosTable';
import { SeguimientoFilters } from '../components/SeguimientoFilters';
import { CalcularDesviacionDialog } from '../components/CalcularDesviacionDialog';
import type { Seguimiento } from '../types/seguimiento.types';
import '../styles/seguimientos.css';

export function SeguimientosPage() {
  const navigate = useNavigate();
  const { seguimientos, loading, error, setFiltros } = useSeguimientos();
  const [tareaDesviacion, setTareaDesviacion] = useState<{ id: number; nombre?: string } | null>(null);

  const handleBuscar = (idTarea?: number) => {
    setFiltros({ idTarea });
  };

  const handleView = (s: Seguimiento) => navigate(`/seguimientos/${s.idSeguimiento}`);
  const handleEdit = (s: Seguimiento) => navigate(`/seguimientos/${s.idSeguimiento}/editar`);
  const handleCalcular = (s: Seguimiento) => setTareaDesviacion({ id: s.idTarea });

  return (
    <div className="seguimientos-container">
      <header className="seguimientos-header">
        <h1>Seguimiento de Tareas</h1>
        <Button onClick={() => navigate('/seguimientos/nuevo')}>
          Nuevo Seguimiento
        </Button>
      </header>

      <SeguimientoFilters onBuscar={handleBuscar} onLimpiar={() => setFiltros({})} />

      {error && <div className="feedback-banner error">{error}</div>}

      {loading && !seguimientos.length ? (
        <Loader text="Cargando seguimientos..." />
      ) : seguimientos.length > 0 ? (
        <SeguimientosTable
          seguimientos={seguimientos}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onCalcularDesviacion={handleCalcular}
        />
      ) : (
        <EmptyState
          title="Sin seguimientos"
          description="No se han registrado seguimientos para ninguna tarea aún."
          action={<Button onClick={() => navigate('/seguimientos/nuevo')}>Registrar primer seguimiento</Button>}
        />
      )}

      <CalcularDesviacionDialog
        idTarea={tareaDesviacion?.id || null}
        onClose={() => setTareaDesviacion(null)}
      />
    </div>
  );
}
