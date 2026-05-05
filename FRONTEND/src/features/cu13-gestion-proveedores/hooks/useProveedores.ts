import { useState, useEffect, useCallback } from 'react';
import { proveedoresService } from '../services/proveedores.service';
import type { Proveedor, ListarProveedoresParams } from '../types/proveedor.types';

export function useProveedores(initialParams: ListarProveedoresParams = {}) {
  const [params, setParams] = useState<ListarProveedoresParams>(initialParams);
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({
    proveedores: [] as Proveedor[],
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    let cancelled = false;
    
    proveedoresService.listarProveedores(params)
      .then(data => {
        if (!cancelled) setState({ proveedores: data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ proveedores: [], loading: false, error: err instanceof Error ? err.message : 'Error' });
      });

    return () => { cancelled = true; };
  }, [params, tick]);

  const updateParams = (newParams: ListarProveedoresParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
    setState(s => ({ ...s, loading: true }));
  };

  const refetch = useCallback(() => {
    setTick(t => t + 1);
    setState(s => ({ ...s, loading: true }));
  }, []);

  return { ...state, params, updateParams, refetch };
}
