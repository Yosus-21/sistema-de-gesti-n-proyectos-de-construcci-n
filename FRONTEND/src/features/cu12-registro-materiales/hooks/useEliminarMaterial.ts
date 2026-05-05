import { useState, useCallback } from 'react';
import { materialesService } from '../services/materiales.service';

export function useEliminarMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eliminarMaterial = useCallback(async (idMaterial: number) => {
    setLoading(true);
    setError(null);
    try {
      await materialesService.eliminarMaterial(idMaterial);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar material';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { eliminarMaterial, loading, error };
}
