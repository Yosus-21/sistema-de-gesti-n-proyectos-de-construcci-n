import { useState } from 'react';
import { clientesService } from '../services/clientes.service';
import type { RegistrarClienteDto } from '../types/cliente.types';

export function useCrearCliente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearCliente = async (data: RegistrarClienteDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await clientesService.registrarCliente(data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear cliente';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { crearCliente, loading, error };
}
