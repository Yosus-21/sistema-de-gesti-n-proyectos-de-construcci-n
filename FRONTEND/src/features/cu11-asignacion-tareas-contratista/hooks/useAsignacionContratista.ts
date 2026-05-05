import { useState, useEffect, useCallback } from 'react';
import { asignacionesContratistaService } from '../services/asignaciones-contratista.service';
import type { AsignacionContratista } from '../types/asignacion-contratista.types';

interface FetchState {
  asignacion: AsignacionContratista | null;
  loading: boolean;
  error: string | null;
}

export function useAsignacionContratista(idAsignacionTarea: number) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    asignacion: null,
    loading: !!idAsignacionTarea,
    error: null,
  });

  useEffect(() => {
    if (!idAsignacionTarea) return;
    let cancelled = false;
    asignacionesContratistaService.consultarAsignacionContratista(idAsignacionTarea)
      .then(asignacion => {
        if (!cancelled) setState({ asignacion, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) {
          setState({
            asignacion: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Error al cargar asignación'
          });
        }
      });
    return () => { cancelled = true; };
  }, [idAsignacionTarea, tick]);

  const refetch = useCallback(() => setTick(t => t + 1), []);

  return { 
    asignacion: state.asignacion, 
    loading: state.loading, 
    error: state.error, 
    refetch 
  };
}
