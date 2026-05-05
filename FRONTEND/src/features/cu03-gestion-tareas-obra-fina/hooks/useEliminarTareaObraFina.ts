import { useState } from 'react';
import { tareasObraFinaService } from '../services/tareas-obra-fina.service';

export function useEliminarTareaObraFina() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eliminarTarea = async (idTarea: number) => {
    setLoading(true);
    setError(null);
    try {
      await tareasObraFinaService.eliminarTareaObraFina(idTarea);
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
