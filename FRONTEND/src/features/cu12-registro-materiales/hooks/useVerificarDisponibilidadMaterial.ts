import { useState, useCallback } from 'react';
import { materialesService } from '../services/materiales.service';
import type { DisponibilidadMaterialResponse } from '../types/material.types';

export function useVerificarDisponibilidadMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<DisponibilidadMaterialResponse | null>(null);

  const verificarDisponibilidad = useCallback(async (idMaterial: number, cantidad: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await materialesService.verificarDisponibilidadMaterial(idMaterial, cantidad);
      setResultado(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al verificar disponibilidad';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { verificarDisponibilidad, loading, error, resultado };
}
