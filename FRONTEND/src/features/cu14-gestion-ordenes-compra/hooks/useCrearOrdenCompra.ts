import { useState, useCallback } from 'react';
import { ordenesCompraService } from '../services/ordenes-compra.service';
import type { CrearOrdenCompraDto } from '../types/orden-compra.types';

export function useCrearOrdenCompra() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearOrden = useCallback(async (data: CrearOrdenCompraDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ordenesCompraService.crearOrdenCompra(data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear orden de compra';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { crearOrden, loading, error };
}
