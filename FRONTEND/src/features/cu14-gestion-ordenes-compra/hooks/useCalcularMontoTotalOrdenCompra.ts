import { useState, useCallback } from 'react';
import { ordenesCompraService } from '../services/ordenes-compra.service';
import type { CalcularMontoTotalOrdenCompraResponse } from '../types/orden-compra.types';

export function useCalcularMontoTotalOrdenCompra() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<CalcularMontoTotalOrdenCompraResponse | null>(null);

  const calcularMonto = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordenesCompraService.calcularMontoTotalOrdenCompra(id);
      setResultado(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al calcular monto total';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { calcularMonto, loading, error, resultado };
}
