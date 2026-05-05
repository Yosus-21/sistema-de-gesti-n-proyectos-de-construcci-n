import { useState, useCallback } from 'react';
import { asignacionMaterialesIaService } from '../services/asignacion-materiales-ia.service';
import type { AjustarAsignacionMaterialDto } from '../types/asignacion-material-ia.types';

export function useAjustarAsignacionMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ajustarAsignacion = useCallback(async (id: number, data: AjustarAsignacionMaterialDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asignacionMaterialesIaService.ajustarAsignacionMaterial(id, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al ajustar asignación';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { ajustarAsignacion, loading, error };
}
