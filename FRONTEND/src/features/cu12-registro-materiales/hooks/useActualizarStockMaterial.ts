import { useState, useCallback } from 'react';
import { materialesService } from '../services/materiales.service';
import type { ActualizarStockMaterialDto } from '../types/material.types';

export function useActualizarStockMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarStock = useCallback(async (idMaterial: number, data: ActualizarStockMaterialDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await materialesService.actualizarStockMaterial(idMaterial, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar stock';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { actualizarStock, loading, error };
}
