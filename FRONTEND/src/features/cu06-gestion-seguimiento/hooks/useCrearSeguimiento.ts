import { useState } from 'react';
import { seguimientosService } from '../services/seguimientos.service';
import type { RegistrarSeguimientoDto } from '../types/seguimiento.types';

export function useCrearSeguimiento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearSeguimiento = async (data: RegistrarSeguimientoDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await seguimientosService.registrarSeguimiento(data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrar seguimiento';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { crearSeguimiento, loading, error };
}
