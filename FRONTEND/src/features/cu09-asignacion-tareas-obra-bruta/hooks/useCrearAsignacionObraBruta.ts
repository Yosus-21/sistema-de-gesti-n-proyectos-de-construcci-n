import { useState } from 'react';
import { asignacionesObraBrutaService } from '../services/asignaciones-obra-bruta.service';
import type { CrearAsignacionObraBrutaDto } from '../types/asignacion-obra-bruta.types';

export function useCrearAsignacionObraBruta() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearAsignacion = async (data: CrearAsignacionObraBrutaDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asignacionesObraBrutaService.crearAsignacionObraBruta(data);
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
