import { useState, useCallback } from 'react';
import { pronosticoMaterialesIaService } from '../services/pronostico-materiales-ia.service';

export function useConfirmarPronosticoMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmarPronostico = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await pronosticoMaterialesIaService.confirmarPronosticoMaterial(id);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al confirmar pronóstico';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { confirmarPronostico, loading, error };
}
