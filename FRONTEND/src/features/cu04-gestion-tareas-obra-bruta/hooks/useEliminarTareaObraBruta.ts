import { useState } from 'react';
import { tareasObraBrutaService } from '../services/tareas-obra-bruta.service';

export function useEliminarTareaObraBruta() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eliminarTarea = async (idTarea: number) => {
    setLoading(true);
    setError(null);
    try {
      await tareasObraBrutaService.eliminarTareaObraBruta(idTarea);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar tarea';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarTarea, loading, error };
}
