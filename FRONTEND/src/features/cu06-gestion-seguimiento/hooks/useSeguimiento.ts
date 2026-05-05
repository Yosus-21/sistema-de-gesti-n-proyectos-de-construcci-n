import { useState, useEffect, useCallback } from 'react';
import { seguimientosService } from '../services/seguimientos.service';
import type { Seguimiento } from '../types/seguimiento.types';

interface FetchState {
  seguimiento: Seguimiento | null;
  loading: boolean;
  error: string | null;
}

export function useSeguimiento(idSeguimiento: number) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    seguimiento: null,
    loading: !!idSeguimiento,
    error: null,
  });

  useEffect(() => {
    if (!idSeguimiento) return;

    let cancelled = false;
    seguimientosService.consultarSeguimiento(idSeguimiento)
      .then(seguimiento => {
        if (!cancelled) setState({ seguimiento, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) {
          setState({
            seguimiento: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Error al cargar el seguimiento'
          });
        }
      });

    return () => { cancelled = true; };
  }, [idSeguimiento, tick]);

  const refetch = useCallback(() => setTick(t => t + 1), []);

  return { 
    seguimiento: state.seguimiento, 
    loading: state.loading, 
    error: state.error, 
    refetch 
  };
}
