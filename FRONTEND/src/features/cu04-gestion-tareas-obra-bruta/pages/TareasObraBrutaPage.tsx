import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, EmptyState, ConfirmDialog } from '../../../shared/components';
import { useTareasObraBruta } from '../hooks/useTareasObraBruta';
import { useActualizarTareaObraBruta } from '../hooks/useActualizarTareaObraBruta';
import { useEliminarTareaObraBruta } from '../hooks/useEliminarTareaObraBruta';
import { TareasObraBrutaTable } from '../components/TareasObraBrutaTable';
import { TareaObraBrutaFilters } from '../components/TareaObraBrutaFilters';
import { TareaObraBrutaForm } from '../components/TareaObraBrutaForm';
import type { TareaObraBruta, RegistrarTareaObraBrutaDto, ModificarTareaObraBrutaDto } from '../types/tarea-obra-bruta.types';
import '../styles/tareas-obra-bruta.css';

export function TareasObraBrutaPage() {
  const navigate = useNavigate();
  const { tareas, loading, error, setFiltros, refetch } = useTareasObraBruta();
  const { actualizarTarea, loading: updating } = useActualizarTareaObraBruta();
  const { eliminarTarea, loading: deleting } = useEliminarTareaObraBruta();

  const [tareaParaEditar, setTareaParaEditar] = useState<TareaObraBruta | null>(null);
  const [tareaParaEliminar, setTareaParaEliminar] = useState<TareaObraBruta | null>(null);

  const handleBuscar = (busqueda: string, idProyecto?: number) => {
    setFiltros({ busqueda, idProyecto });
  };

  const handleEliminar = async () => {
    if (!tareaParaEliminar) return;
    try {
      await eliminarTarea(tareaParaEliminar.idTarea);
      setTareaParaEliminar(null);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleActualizar = async (data: RegistrarTareaObraBrutaDto | ModificarTareaObraBrutaDto) => {
    if (!tareaParaEditar) return;
    try {
      await actualizarTarea(tareaParaEditar.idTarea, data as ModificarTareaObraBrutaDto);
      setTareaParaEditar(null);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="tareas-container">
      <header className="tareas-header">
        <h1>Gestión de Tareas Obra Bruta</h1>
        <Button onClick={() => navigate('/tareas/obra-bruta/nuevo')}>
          Nueva Tarea
        </Button>
      </header>

      <TareaObraBrutaFilters onBuscar={handleBuscar} onLimpiar={() => setFiltros({})} />

      {error && <div className="feedback-banner error">{error}</div>}

      {loading && !tareas.length ? (
        <Loader text="Cargando tareas..." />
      ) : tareas.length > 0 ? (
        <TareasObraBrutaTable
          tareas={tareas}
          loading={loading}
          onEdit={setTareaParaEditar}
          onDelete={setTareaParaEliminar}
        />
      ) : (
        <EmptyState
          title="Sin tareas"
          description="No se encontraron tareas de obra bruta registradas."
          action={<Button onClick={() => navigate('/tareas/obra-bruta/nuevo')}>Registrar primera tarea</Button>}
        />
      )}

      {/* Modal de Edición */}
      {tareaParaEditar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setTareaParaEditar(null)}>&times;</button>
            <h2>Editar Tarea</h2>
            <TareaObraBrutaForm
              initialData={tareaParaEditar}
              onSubmit={handleActualizar}
              loading={updating}
              isEdit
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!tareaParaEliminar}
        title="Eliminar Tarea"
        message={`¿Está seguro que desea eliminar la tarea "${tareaParaEliminar?.nombre}"?`}
        onConfirm={handleEliminar}
        onCancel={() => setTareaParaEliminar(null)}
        loading={deleting}
      />
    </div>
  );
}
