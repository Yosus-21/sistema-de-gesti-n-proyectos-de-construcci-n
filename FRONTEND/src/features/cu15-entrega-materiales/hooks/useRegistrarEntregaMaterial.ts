import { useState, useCallback } from 'react';
import { entregasMaterialesService } from '../services/entregas-materiales.service';
import type { RegistrarEntregaMaterialDto } from '../types/entrega-material.types';

export function useRegistrarEntregaMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registrarEntrega = useCallback(async (data: RegistrarEntregaMaterialDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await entregasMaterialesService.registrarEntregaMaterial(data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrar entrega de material';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { registrarEntrega, loading, error };
}
