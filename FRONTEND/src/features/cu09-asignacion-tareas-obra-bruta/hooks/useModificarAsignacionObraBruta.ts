import { useState } from 'react';
import { asignacionesObraBrutaService } from '../services/asignaciones-obra-bruta.service';
import type { ModificarAsignacionObraBrutaDto } from '../types/asignacion-obra-bruta.types';

export function useModificarAsignacionObraBruta() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modificarAsignacion = async (idAsignacionTarea: number, data: ModificarAsignacionObraBrutaDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asignacionesObraBrutaService.modificarAsignacionObraBruta(idAsignacionTarea, data);
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
