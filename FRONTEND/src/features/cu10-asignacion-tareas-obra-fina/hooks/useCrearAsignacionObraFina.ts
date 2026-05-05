import { useState } from 'react';
import { asignacionesObraFinaService } from '../services/asignaciones-obra-fina.service';
import type { CrearAsignacionObraFinaDto } from '../types/asignacion-obra-fina.types';

export function useCrearAsignacionObraFina() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearAsignacion = async (data: CrearAsignacionObraFinaDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asignacionesObraFinaService.crearAsignacionObraFina(data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear asignación';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { crearAsignacion, loading, error };
}
