import { useState, useEffect, useCallback } from 'react';
import { asignacionesContratistaService } from '../services/asignaciones-contratista.service';
import type { AsignacionContratista, ListarAsignacionesContratistaParams } from '../types/asignacion-contratista.types';

interface FetchState {
  asignaciones: AsignacionContratista[];
  loading: boolean;
  error: string | null;
}

export function useAsignacionesContratista(initialParams?: ListarAsignacionesContratistaParams) {
  const [filtros, setFiltros] = useState<ListarAsignacionesContratistaParams>(initialParams || {});
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    asignaciones: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    asignacionesContratistaService.listarAsignacionesContratista(filtros)
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
