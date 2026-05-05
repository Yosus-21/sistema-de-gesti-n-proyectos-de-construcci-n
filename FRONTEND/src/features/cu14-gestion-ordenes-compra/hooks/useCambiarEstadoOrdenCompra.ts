import { useState, useCallback } from 'react';
import { ordenesCompraService } from '../services/ordenes-compra.service';
import type { EstadoOrden } from '../types/orden-compra.types';

export function useCambiarEstadoOrdenCompra() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cambiarEstado = useCallback(async (id: number, estado: EstadoOrden) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ordenesCompraService.cambiarEstadoOrdenCompra(id, estado);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cambiar estado de la orden';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cambiarEstado, loading, error };
}
