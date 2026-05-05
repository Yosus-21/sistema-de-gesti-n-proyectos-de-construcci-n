import { useState, useCallback } from 'react';
import { asignacionMaterialesIaService } from '../services/asignacion-materiales-ia.service';

export function useConfirmarAsignacionMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmarAsignacion = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asignacionMaterialesIaService.confirmarAsignacionMaterial(id);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al confirmar asignación';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { confirmarAsignacion, loading, error };
}
