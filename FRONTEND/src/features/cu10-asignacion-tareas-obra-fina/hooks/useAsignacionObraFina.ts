import { useState, useEffect, useCallback } from 'react';
import { asignacionesObraFinaService } from '../services/asignaciones-obra-fina.service';
import type { AsignacionObraFina } from '../types/asignacion-obra-fina.types';

interface FetchState {
  asignacion: AsignacionObraFina | null;
  loading: boolean;
  error: string | null;
}

export function useAsignacionObraFina(idAsignacionTarea: number) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    asignacion: null,
    loading: !!idAsignacionTarea,
    error: null,
  });

  useEffect(() => {
    if (!idAsignacionTarea) return;
    let cancelled = false;
    asignacionesObraFinaService.consultarAsignacionObraFina(idAsignacionTarea)
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
