import { useState, useCallback } from 'react';
import { ordenesCompraService } from '../services/ordenes-compra.service';
import type { ModificarOrdenCompraDto } from '../types/orden-compra.types';

export function useActualizarOrdenCompra() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarOrden = useCallback(async (id: number, data: ModificarOrdenCompraDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ordenesCompraService.modificarOrdenCompra(id, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar orden de compra';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { actualizarOrden, loading, error };
}
