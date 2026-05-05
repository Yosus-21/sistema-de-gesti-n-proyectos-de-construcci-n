import { useState, useEffect, useCallback } from 'react';
import { seguimientosService } from '../services/seguimientos.service';
import type { Seguimiento, ListarSeguimientosParams } from '../types/seguimiento.types';

interface FetchState {
  seguimientos: Seguimiento[];
  loading: boolean;
  error: string | null;
}

export function useSeguimientos(initialParams?: ListarSeguimientosParams) {
  const [filtros, setFiltros] = useState<ListarSeguimientosParams>(initialParams || {});
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    seguimientos: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    
    seguimientosService.listarSeguimientos(filtros)
      .then(seguimientos => {
        if (!cancelled) setState({ seguimientos, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) {
          setState({
            seguimientos: [],
            loading: false,
            error: err instanceof Error ? err.message : 'Error al cargar seguimientos'
          });
        }
      });

    return () => { cancelled = true; };
  }, [filtros, tick]);

  const refetch = useCallback(() => setTick(t => t + 1), []);

  return { 
    seguimientos: state.seguimientos, 
    loading: state.loading, 
    error: state.error, 
    filtros, 
    setFiltros, 
    refetch 
  };
}
