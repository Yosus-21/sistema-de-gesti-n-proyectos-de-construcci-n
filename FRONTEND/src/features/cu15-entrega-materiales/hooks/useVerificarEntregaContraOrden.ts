import { useState, useCallback } from 'react';
import { entregasMaterialesService } from '../services/entregas-materiales.service';
import type { VerificarEntregaContraOrdenResponse } from '../types/entrega-material.types';

export function useVerificarEntregaContraOrden() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<VerificarEntregaContraOrdenResponse | null>(null);

  const verificar = useCallback(async (idEntrega: number, idOrden: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await entregasMaterialesService.verificarEntregaContraOrden(idEntrega, idOrden);
      setResultado(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al verificar entrega contra orden';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { verificar, loading, error, resultado };
}
