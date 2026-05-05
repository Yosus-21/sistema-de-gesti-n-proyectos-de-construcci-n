import { useState, useEffect, useCallback } from 'react';
import { asignacionesObraFinaService } from '../services/asignaciones-obra-fina.service';
import type { AsignacionObraFina, ListarAsignacionesObraFinaParams } from '../types/asignacion-obra-fina.types';

interface FetchState {
  asignaciones: AsignacionObraFina[];
  loading: boolean;
  error: string | null;
}

export function useAsignacionesObraFina(initialParams?: ListarAsignacionesObraFinaParams) {
  const [filtros, setFiltros] = useState<ListarAsignacionesObraFinaParams>(initialParams || {});
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    asignaciones: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    asignacionesObraFinaService.listarAsignacionesObraFina(filtros)
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
