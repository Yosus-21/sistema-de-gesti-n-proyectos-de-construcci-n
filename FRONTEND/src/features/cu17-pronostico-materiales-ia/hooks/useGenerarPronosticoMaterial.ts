import { useState, useCallback } from 'react';
import { pronosticoMaterialesIaService } from '../services/pronostico-materiales-ia.service';
import type { GenerarPronosticoMaterialDto } from '../types/pronostico-material-ia.types';

export function useGenerarPronosticoMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generarPronostico = useCallback(async (data: GenerarPronosticoMaterialDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await pronosticoMaterialesIaService.generarPronosticoMaterial(data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al generar pronóstico IA';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generarPronostico, loading, error };
}
