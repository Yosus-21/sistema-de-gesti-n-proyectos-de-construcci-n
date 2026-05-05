import { useState, useEffect, useCallback } from 'react';
import { ordenesCompraService } from '../services/ordenes-compra.service';
import type { OrdenCompra, ListarOrdenesCompraParams } from '../types/orden-compra.types';

export function useOrdenesCompra(initialParams: ListarOrdenesCompraParams = {}) {
  const [params, setParams] = useState<ListarOrdenesCompraParams>(initialParams);
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({
    ordenes: [] as OrdenCompra[],
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    let cancelled = false;
    
    ordenesCompraService.listarOrdenesCompra(params)
      .then(data => {
        if (!cancelled) setState({ ordenes: data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ ordenes: [], loading: false, error: err instanceof Error ? err.message : 'Error al cargar órdenes de compra' });
      });

    return () => { cancelled = true; };
  }, [params, tick]);

  const updateParams = (newParams: ListarOrdenesCompraParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
    setState(s => ({ ...s, loading: true }));
  };

  const refetch = useCallback(() => {
    setTick(t => t + 1);
    setState(s => ({ ...s, loading: true }));
  }, []);

  return { ...state, params, updateParams, refetch };
}
