import { useState } from 'react';
import { tareasObraBrutaService } from '../services/tareas-obra-bruta.service';
import type { ModificarTareaObraBrutaDto } from '../types/tarea-obra-bruta.types';

export function useActualizarTareaObraBruta() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarTarea = async (idTarea: number, data: ModificarTareaObraBrutaDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await tareasObraBrutaService.modificarTareaObraBruta(idTarea, data);
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
