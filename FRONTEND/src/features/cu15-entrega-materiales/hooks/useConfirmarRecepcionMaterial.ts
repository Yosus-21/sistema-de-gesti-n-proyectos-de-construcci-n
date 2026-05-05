import { useState, useCallback } from 'react';
import { entregasMaterialesService } from '../services/entregas-materiales.service';

export function useConfirmarRecepcionMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmarRecepcion = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await entregasMaterialesService.confirmarRecepcionMaterial(id);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al confirmar recepción de material';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { confirmarRecepcion, loading, error };
}
