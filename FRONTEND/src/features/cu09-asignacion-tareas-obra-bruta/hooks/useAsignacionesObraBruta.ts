import { useState, useEffect, useCallback } from 'react';
import { asignacionesObraBrutaService } from '../services/asignaciones-obra-bruta.service';
import type { AsignacionObraBruta, ListarAsignacionesObraBrutaParams } from '../types/asignacion-obra-bruta.types';

interface FetchState {
  asignaciones: AsignacionObraBruta[];
  loading: boolean;
  error: string | null;
}

export function useAsignacionesObraBruta(initialParams?: ListarAsignacionesObraBrutaParams) {
  const [filtros, setFiltros] = useState<ListarAsignacionesObraBrutaParams>(initialParams || {});
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    asignaciones: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    asignacionesObraBrutaService.listarAsignacionesObraBruta(filtros)
      .then(asignaciones => {
        if (!cancelled) setState({ asignaciones, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) {
          setState({
            asignaciones: [],
            loading: false,
            error: err instanceof Error ? err.message : 'Error al cargar asignaciones'
          });
        }
      });
    return () => { cancelled = true; };
  }, [filtros, tick]);

  const refetch = useCallback(() => setTick(t => t + 1), []);

  return { 
    asignaciones: state.asignaciones, 
    loading: state.loading, 
    error: state.error, 
    filtros, 
    setFiltros, 
    refetch 
  };
}
