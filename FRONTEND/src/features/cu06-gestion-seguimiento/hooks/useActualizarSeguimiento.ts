import { useState } from 'react';
import { seguimientosService } from '../services/seguimientos.service';
import type { ModificarSeguimientoDto } from '../types/seguimiento.types';

export function useActualizarSeguimiento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarSeguimiento = async (idSeguimiento: number, data: ModificarSeguimientoDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await seguimientosService.modificarSeguimiento(idSeguimiento, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar seguimiento';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { actualizarSeguimiento, loading, error };
}
