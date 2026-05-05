import { useState, useEffect, useCallback } from 'react';
import { trabajadoresService } from '../services/trabajadores.service';
import type { Trabajador, ListarTrabajadoresParams } from '../types/trabajador.types';

interface FetchState {
  trabajadores: Trabajador[];
  loading: boolean;
  error: string | null;
}

export function useTrabajadores() {
  const [filtros, setFiltros] = useState<ListarTrabajadoresParams>({});
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    trabajadores: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    trabajadoresService
      .listarTrabajadores(filtros)
      .then((trabajadores) => {
        if (!cancelled) setState({ trabajadores, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            trabajadores: [],
            loading: false,
            error: err instanceof Error ? err.message : 'Error al cargar trabajadores',
          });
      });
    return () => {
      cancelled = true;
    };
  }, [filtros, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return {
    trabajadores: state.trabajadores,
    loading: state.loading,
    error: state.error,
    refetch,
    filtros,
    setFiltros,
  };
}
