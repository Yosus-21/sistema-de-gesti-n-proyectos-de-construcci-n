import { useState } from 'react';
import { trabajadoresService } from '../services/trabajadores.service';
import type { ModificarTrabajadorDto } from '../types/trabajador.types';

export function useActualizarTrabajador() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarTrabajador = async (idTrabajador: number, data: ModificarTrabajadorDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await trabajadoresService.modificarTrabajador(idTrabajador, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar trabajador';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { actualizarTrabajador, loading, error };
}
