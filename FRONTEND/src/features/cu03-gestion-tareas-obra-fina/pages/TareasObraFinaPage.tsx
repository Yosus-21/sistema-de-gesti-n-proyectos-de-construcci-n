import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, EmptyState, ConfirmDialog } from '../../../shared/components';
import { useTareasObraFina } from '../hooks/useTareasObraFina';
import { useActualizarTareaObraFina } from '../hooks/useActualizarTareaObraFina';
import { useEliminarTareaObraFina } from '../hooks/useEliminarTareaObraFina';
import { TareasObraFinaTable } from '../components/TareasObraFinaTable';
import { TareaObraFinaFilters } from '../components/TareaObraFinaFilters';
import { TareaObraFinaForm } from '../components/TareaObraFinaForm';
import type { TareaObraFina, RegistrarTareaObraFinaDto, ModificarTareaObraFinaDto } from '../types/tarea-obra-fina.types';
import '../styles/tareas-obra-fina.css';

export function TareasObraFinaPage() {
  const navigate = useNavigate();
  const { tareas, loading, error, setFiltros, refetch } = useTareasObraFina();
  const { actualizarTarea, loading: updating } = useActualizarTareaObraFina();
  const { eliminarTarea, loading: deleting } = useEliminarTareaObraFina();

  const [tareaParaEditar, setTareaParaEditar] = useState<TareaObraFina | null>(null);
  const [tareaParaEliminar, setTareaParaEliminar] = useState<TareaObraFina | null>(null);

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

  const handleActualizar = async (data: RegistrarTareaObraFinaDto | ModificarTareaObraFinaDto) => {
    if (!tareaParaEditar) return;
    try {
      await actualizarTarea(tareaParaEditar.idTarea, data as ModificarTareaObraFinaDto);
      setTareaParaEditar(null);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="tareas-container">
      <header className="tareas-header">
        <h1>Gestión de Tareas Obra Fina</h1>
        <Button onClick={() => navigate('/tareas/obra-fina/nuevo')}>
          Nueva Tarea
        </Button>
      </header>

      <TareaObraFinaFilters onBuscar={handleBuscar} onLimpiar={() => setFiltros({})} />

      {error && <div className="feedback-banner error">{error}</div>}

      {loading && !tareas.length ? (
        <Loader text="Cargando tareas..." />
      ) : tareas.length > 0 ? (
        <TareasObraFinaTable
          tareas={tareas}
          loading={loading}
          onEdit={setTareaParaEditar}
          onDelete={setTareaParaEliminar}
        />
      ) : (
        <EmptyState
          title="Sin tareas"
          description="No se encontraron tareas de obra fina registradas."
          action={<Button onClick={() => navigate('/tareas/obra-fina/nuevo')}>Registrar primera tarea</Button>}
        />
      )}

      {/* Modal de Edición */}
      {tareaParaEditar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setTareaParaEditar(null)}>&times;</button>
            <h2>Editar Tarea</h2>
            <TareaObraFinaForm
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
