import { useState, useCallback } from 'react';
import { materialesService } from '../services/materiales.service';
import type { RegistrarMaterialDto } from '../types/material.types';

export function useCrearMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearMaterial = useCallback(async (data: RegistrarMaterialDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await materialesService.registrarMaterial(data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrar material';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { crearMaterial, loading, error };
}
