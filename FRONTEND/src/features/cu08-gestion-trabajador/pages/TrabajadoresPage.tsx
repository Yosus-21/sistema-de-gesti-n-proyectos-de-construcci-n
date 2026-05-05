import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, EmptyState, ConfirmDialog } from '../../../shared/components';
import { useTrabajadores } from '../hooks/useTrabajadores';
import { useEliminarTrabajador } from '../hooks/useEliminarTrabajador';
import { useVerificarDisponibilidadTrabajador } from '../hooks/useVerificarDisponibilidadTrabajador';
import { TrabajadoresTable } from '../components/TrabajadoresTable';
import { TrabajadorFilters } from '../components/TrabajadorFilters';
import { VerificarDisponibilidadDialog } from '../components/VerificarDisponibilidadDialog';
import type { Trabajador, OcupacionTrabajador, VerificarDisponibilidadTrabajadorParams } from '../types/trabajador.types';
import '../styles/trabajadores.css';

export function TrabajadoresPage() {
  const navigate = useNavigate();
  const { trabajadores, loading, error, setFiltros, refetch } = useTrabajadores();
  const { eliminarTrabajador, loading: deleting } = useEliminarTrabajador();
  const { 
    verificarDisponibilidad, 
    resultado, 
    loading: checking, 
    error: checkingError,
    limpiarResultado
  } = useVerificarDisponibilidadTrabajador();

  const [trabajadorParaEliminar, setTrabajadorParaEliminar] = useState<Trabajador | null>(null);
  const [trabajadorParaDisponibilidad, setTrabajadorParaDisponibilidad] = useState<Trabajador | null>(null);

  const handleBuscar = (busqueda: string, ocupacion?: OcupacionTrabajador) => {
    setFiltros({ busqueda, ocupacion });
  };

  const handleLimpiar = () => {
    setFiltros({});
  };

  const handleEliminar = async () => {
    if (!trabajadorParaEliminar) return;
    try {
      await eliminarTrabajador(trabajadorParaEliminar.idTrabajador);
      setTrabajadorParaEliminar(null);
      refetch();
    } catch {
      // Error handled by hook
    }
  };

  const handleVerificarDisp = (params: VerificarDisponibilidadTrabajadorParams) => {
    if (!trabajadorParaDisponibilidad) return;
    verificarDisponibilidad(trabajadorParaDisponibilidad.idTrabajador, params);
  };

  const handleCloseDispDialog = () => {
    setTrabajadorParaDisponibilidad(null);
    limpiarResultado();
  };

  return (
    <div className="trabajadores-container">
      <header className="trabajadores-header">
        <h1>Gestión de Trabajadores</h1>
        <Button onClick={() => navigate('/trabajadores/nuevo')}>
          Nuevo Trabajador
        </Button>
      </header>

      {error && <div className="feedback-banner error">{error}</div>}

      <TrabajadorFilters onBuscar={handleBuscar} onLimpiar={handleLimpiar} />

      {loading && !trabajadores.length ? (
        <Loader text="Cargando trabajadores..." />
      ) : trabajadores.length > 0 ? (
        <TrabajadoresTable 
          trabajadores={trabajadores} 
          loading={loading} 
          onEliminar={setTrabajadorParaEliminar}
          onVerificarDisponibilidad={setTrabajadorParaDisponibilidad}
        />
      ) : (
        <EmptyState
          title="Sin trabajadores"
          description="No se encontraron trabajadores registrados en el sistema."
          action={
            <Button onClick={() => navigate('/trabajadores/nuevo')}>
              Registrar primer trabajador
            </Button>
          }
        />
      )}

      <ConfirmDialog
        open={!!trabajadorParaEliminar}
        title="Eliminar Trabajador"
        message={`¿Está seguro que desea eliminar a ${trabajadorParaEliminar?.nombres}? Esta acción no se puede deshacer.`}
        onConfirm={handleEliminar}
        onCancel={() => setTrabajadorParaEliminar(null)}
        loading={deleting}
      />

      {trabajadorParaDisponibilidad && (
        <VerificarDisponibilidadDialog
          open={!!trabajadorParaDisponibilidad}
          trabajador={trabajadorParaDisponibilidad}
          onVerificar={handleVerificarDisp}
          onClose={handleCloseDispDialog}
          loading={checking}
          resultado={resultado}
          error={checkingError}
        />
      )}
    </div>
  );
}
