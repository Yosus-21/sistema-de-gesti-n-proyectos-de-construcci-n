import { useState } from 'react';
import { tareasObraFinaService } from '../services/tareas-obra-fina.service';
import type { ModificarTareaObraFinaDto } from '../types/tarea-obra-fina.types';

export function useActualizarTareaObraFina() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarTarea = async (idTarea: number, data: ModificarTareaObraFinaDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await tareasObraFinaService.modificarTareaObraFina(idTarea, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar tarea';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { actualizarTarea, loading, error };
}
