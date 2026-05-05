import { useState, useEffect, useCallback } from 'react';
import { asignacionMaterialesIaService } from '../services/asignacion-materiales-ia.service';
import type { AsignacionMaterialIa, ListarAsignacionesMaterialIaParams } from '../types/asignacion-material-ia.types';

export function useAsignacionesMaterialIa(initialParams: ListarAsignacionesMaterialIaParams = {}) {
  const [params, setParams] = useState<ListarAsignacionesMaterialIaParams>(initialParams);
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({
    asignaciones: [] as AsignacionMaterialIa[],
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    let cancelled = false;
    
    asignacionMaterialesIaService.listarAsignacionesMaterialIa(params)
      .then(data => {
        if (!cancelled) setState({ asignaciones: data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ asignaciones: [], loading: false, error: err instanceof Error ? err.message : 'Error al cargar asignaciones IA' });
      });

    return () => { cancelled = true; };
  }, [params, tick]);

  const updateParams = (newParams: ListarAsignacionesMaterialIaParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
    setState(s => ({ ...s, loading: true }));
  };

  const refetch = useCallback(() => {
    setTick(t => t + 1);
    setState(s => ({ ...s, loading: true }));
  }, []);

  return { ...state, params, updateParams, refetch };
}
