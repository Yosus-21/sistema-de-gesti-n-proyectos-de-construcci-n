import { useState } from 'react';
import { asignacionesObraBrutaService } from '../services/asignaciones-obra-bruta.service';

export function useCancelarAsignacionObraBruta() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelarAsignacion = async (idAsignacionTarea: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asignacionesObraBrutaService.cancelarAsignacionObraBruta(idAsignacionTarea);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cancelar asignación';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { cancelarAsignacion, loading, error };
}
