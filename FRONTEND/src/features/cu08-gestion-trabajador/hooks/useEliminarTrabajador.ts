import { useState } from 'react';
import { trabajadoresService } from '../services/trabajadores.service';

export function useEliminarTrabajador() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eliminarTrabajador = async (idTrabajador: number) => {
    setLoading(true);
    setError(null);
    try {
      await trabajadoresService.eliminarTrabajador(idTrabajador);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar trabajador';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarTrabajador, loading, error };
}
