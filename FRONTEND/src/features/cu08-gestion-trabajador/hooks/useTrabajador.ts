import { useState, useEffect, useCallback } from 'react';
import { trabajadoresService } from '../services/trabajadores.service';
import type { Trabajador } from '../types/trabajador.types';

interface FetchState {
  trabajador: Trabajador | null;
  loading: boolean;
  error: string | null;
}

export function useTrabajador(idTrabajador: number | null) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    trabajador: null,
    loading: idTrabajador !== null,
    error: null,
  });

  useEffect(() => {
    if (idTrabajador === null) return;
    let cancelled = false;
    trabajadoresService
      .consultarTrabajador(idTrabajador)
      .then((trabajador) => {
        if (!cancelled) setState({ trabajador, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            trabajador: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Error al cargar trabajador',
          });
      });
    return () => {
      cancelled = true;
    };
  }, [idTrabajador, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return {
    trabajador: state.trabajador,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}
