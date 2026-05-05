import { useState } from 'react';
import { clientesService } from '../services/clientes.service';

export function useEliminarCliente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eliminarCliente = async (idCliente: number) => {
    setLoading(true);
    setError(null);
    try {
      await clientesService.eliminarCliente(idCliente);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar cliente';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarCliente, loading, error };
}
