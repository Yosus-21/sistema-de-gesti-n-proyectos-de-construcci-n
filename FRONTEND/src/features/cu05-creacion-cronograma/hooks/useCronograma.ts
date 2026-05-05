import { useState, useEffect, useCallback } from 'react';
import { cronogramasService } from '../services/cronogramas.service';
import type { Cronograma } from '../types/cronograma.types';

interface FetchState {
  cronograma: Cronograma | null;
  loading: boolean;
  error: string | null;
}

export function useCronograma(idCronograma: number | null) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    cronograma: null,
    loading: idCronograma !== null,
    error: null,
  });

  useEffect(() => {
    if (idCronograma === null) return;
    let cancelled = false;
    cronogramasService
      .consultarCronograma(idCronograma)
      .then((cronograma) => {
        if (!cancelled) setState({ cronograma, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            cronograma: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Error al cargar cronograma',
          });
      });
    return () => {
      cancelled = true;
    };
  }, [idCronograma, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return {
    cronograma: state.cronograma,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}
