import { useState } from 'react';
import { clientesService } from '../services/clientes.service';
import type { ModificarClienteDto } from '../types/cliente.types';

export function useActualizarCliente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarCliente = async (idCliente: number, data: ModificarClienteDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await clientesService.modificarCliente(idCliente, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar cliente';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { actualizarCliente, loading, error };
}
