import { useState, useEffect, useCallback } from 'react';
import { pronosticoMaterialesIaService } from '../services/pronostico-materiales-ia.service';
import type { PronosticoMaterialIa, ListarPronosticosMaterialIaParams } from '../types/pronostico-material-ia.types';

export function usePronosticosMaterialIa(initialParams: ListarPronosticosMaterialIaParams = {}) {
  const [params, setParams] = useState<ListarPronosticosMaterialIaParams>(initialParams);
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({
    pronosticos: [] as PronosticoMaterialIa[],
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    let cancelled = false;
    
    pronosticoMaterialesIaService.listarPronosticosMaterialIa(params)
      .then(data => {
        if (!cancelled) setState({ pronosticos: data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ pronosticos: [], loading: false, error: err instanceof Error ? err.message : 'Error al cargar pronósticos IA' });
      });

    return () => { cancelled = true; };
  }, [params, tick]);

  const updateParams = (newParams: ListarPronosticosMaterialIaParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
    setState(s => ({ ...s, loading: true }));
  };

  const refetch = useCallback(() => {
    setTick(t => t + 1);
    setState(s => ({ ...s, loading: true }));
  }, []);

  return { ...state, params, updateParams, refetch };
}
