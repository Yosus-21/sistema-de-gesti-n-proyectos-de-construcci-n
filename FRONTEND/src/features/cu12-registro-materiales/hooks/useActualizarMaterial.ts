import { useState, useCallback } from 'react';
import { materialesService } from '../services/materiales.service';
import type { ModificarMaterialDto } from '../types/material.types';

export function useActualizarMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarMaterial = useCallback(async (idMaterial: number, data: ModificarMaterialDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await materialesService.modificarMaterial(idMaterial, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar material';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { actualizarMaterial, loading, error };
}
