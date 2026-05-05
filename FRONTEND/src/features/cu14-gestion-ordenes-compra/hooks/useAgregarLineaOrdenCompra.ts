import { useState, useCallback } from 'react';
import { ordenesCompraService } from '../services/ordenes-compra.service';
import type { AgregarLineaOrdenCompraDto } from '../types/orden-compra.types';

export function useAgregarLineaOrdenCompra() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agregarLinea = useCallback(async (id: number, data: AgregarLineaOrdenCompraDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ordenesCompraService.agregarLineaOrdenCompra(id, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al agregar línea a la orden';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { agregarLinea, loading, error };
}
