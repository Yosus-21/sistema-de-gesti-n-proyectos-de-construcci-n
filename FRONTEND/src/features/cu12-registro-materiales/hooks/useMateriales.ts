import { useState, useEffect, useCallback } from 'react';
import { materialesService } from '../services/materiales.service';
import type { Material, ListarMaterialesParams } from '../types/material.types';

export function useMateriales(initialParams: ListarMaterialesParams = {}) {
  const [params, setParams] = useState<ListarMaterialesParams>(initialParams);
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({
    materiales: [] as Material[],
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    let cancelled = false;
    // Don't call setState(p => ({...p, loading: true})) here to avoid lint.
    // The loading state should be managed by the resolve/reject.
    
    materialesService.listarMateriales(params)
      .then(data => {
        if (!cancelled) setState({ materiales: data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ materiales: [], loading: false, error: err instanceof Error ? err.message : 'Error' });
      });

    return () => { cancelled = true; };
  }, [params, tick]);

  const updateParams = (newParams: ListarMaterialesParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
    setState(s => ({ ...s, loading: true })); // This is outside useEffect, so it's fine.
  };

  const refetch = useCallback(() => {
    setTick(t => t + 1);
    setState(s => ({ ...s, loading: true }));
  }, []);

  return { ...state, params, updateParams, refetch };
}
