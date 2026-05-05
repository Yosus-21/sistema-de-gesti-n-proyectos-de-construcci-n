import { useState, useCallback } from 'react';
import { pronosticoMaterialesIaService } from '../services/pronostico-materiales-ia.service';
import type { AjustarPronosticoMaterialDto } from '../types/pronostico-material-ia.types';

export function useAjustarPronosticoMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ajustarPronostico = useCallback(async (id: number, data: AjustarPronosticoMaterialDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await pronosticoMaterialesIaService.ajustarPronosticoMaterial(id, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al ajustar pronóstico';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { ajustarPronostico, loading, error };
}
