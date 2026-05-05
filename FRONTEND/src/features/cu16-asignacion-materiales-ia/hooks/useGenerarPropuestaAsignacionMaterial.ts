import { useState, useCallback } from 'react';
import { asignacionMaterialesIaService } from '../services/asignacion-materiales-ia.service';
import type { GenerarPropuestaAsignacionMaterialDto } from '../types/asignacion-material-ia.types';

export function useGenerarPropuestaAsignacionMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generarPropuesta = useCallback(async (data: GenerarPropuestaAsignacionMaterialDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asignacionMaterialesIaService.generarPropuestaAsignacionMaterial(data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al generar propuesta IA';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generarPropuesta, loading, error };
}
