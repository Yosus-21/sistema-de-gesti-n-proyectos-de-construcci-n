import { useState, useEffect, useCallback } from 'react';
import { cronogramasService } from '../services/cronogramas.service';
import type { Cronograma, ListarCronogramasParams } from '../types/cronograma.types';

interface FetchState {
  cronogramas: Cronograma[];
  loading: boolean;
  error: string | null;
}

export function useCronogramas() {
  const [filtros, setFiltros] = useState<ListarCronogramasParams>({});
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    cronogramas: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    cronogramasService
      .listarCronogramas(filtros)
      .then((cronogramas) => {
        if (!cancelled) setState({ cronogramas, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            cronogramas: [],
            loading: false,
            error: err instanceof Error ? err.message : 'Error al cargar cronogramas',
          });
      });
    return () => {
      cancelled = true;
    };
  }, [filtros, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return {
    cronogramas: state.cronogramas,
    loading: state.loading,
    error: state.error,
    refetch,
    filtros,
    setFiltros,
  };
}
