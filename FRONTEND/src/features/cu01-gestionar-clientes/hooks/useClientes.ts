import { useState, useEffect, useCallback } from 'react';
import { clientesService } from '../services/clientes.service';
import type { Cliente, ListarClientesParams } from '../types/cliente.types';

interface FetchState {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
}

export function useClientes() {
  const [filtros, setFiltros] = useState<ListarClientesParams>({});
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    clientes: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    clientesService
      .listarClientes(filtros)
      .then((clientes) => {
        if (!cancelled) setState({ clientes, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            clientes: [],
            loading: false,
            error: err instanceof Error ? err.message : 'Error al cargar clientes',
          });
      });
    return () => {
      cancelled = true;
    };
  }, [filtros, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return {
    clientes: state.clientes,
    loading: state.loading,
    error: state.error,
    refetch,
    filtros,
    setFiltros,
  };
}
