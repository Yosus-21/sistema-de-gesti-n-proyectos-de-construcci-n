import { useState, useEffect, useCallback } from 'react';
import { clientesService } from '../services/clientes.service';
import type { Cliente } from '../types/cliente.types';

interface FetchState {
  cliente: Cliente | null;
  loading: boolean;
  error: string | null;
}

export function useCliente(idCliente: number | null) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    cliente: null,
    loading: idCliente !== null,
    error: null,
  });

  useEffect(() => {
    if (idCliente === null) return;
    let cancelled = false;
    clientesService
      .consultarCliente(idCliente)
      .then((cliente) => {
        if (!cancelled) setState({ cliente, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            cliente: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Error al cargar cliente',
          });
      });
    return () => {
      cancelled = true;
    };
  }, [idCliente, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return {
    cliente: state.cliente,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}
