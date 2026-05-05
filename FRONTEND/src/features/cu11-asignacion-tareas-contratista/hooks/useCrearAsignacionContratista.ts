import { useState } from 'react';
import { asignacionesContratistaService } from '../services/asignaciones-contratista.service';
import type { CrearAsignacionContratistaDto } from '../types/asignacion-contratista.types';

export function useCrearAsignacionContratista() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearAsignacion = async (data: CrearAsignacionContratistaDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asignacionesContratistaService.crearAsignacionContratista(data);
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
