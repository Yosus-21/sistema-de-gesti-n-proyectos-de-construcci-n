import { useState } from 'react';
import { asignacionesObraFinaService } from '../services/asignaciones-obra-fina.service';
import type { ModificarAsignacionObraFinaDto } from '../types/asignacion-obra-fina.types';

export function useModificarAsignacionObraFina() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modificarAsignacion = async (idAsignacionTarea: number, data: ModificarAsignacionObraFinaDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asignacionesObraFinaService.modificarAsignacionObraFina(idAsignacionTarea, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al modificar asignación';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { modificarAsignacion, loading, error };
}
