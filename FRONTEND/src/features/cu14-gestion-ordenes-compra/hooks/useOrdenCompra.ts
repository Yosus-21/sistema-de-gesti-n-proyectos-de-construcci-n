import { useState, useEffect, useCallback } from 'react';
import { ordenesCompraService } from '../services/ordenes-compra.service';
import type { OrdenCompra } from '../types/orden-compra.types';

export function useOrdenCompra(idOrdenCompra: number | null) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({
    orden: null as OrdenCompra | null,
    loading: idOrdenCompra !== null,
    error: null as string | null,
  });

  useEffect(() => {
    if (!idOrdenCompra) return;
    let cancelled = false;
    
    ordenesCompraService.consultarOrdenCompra(idOrdenCompra)
      .then(data => {
        if (!cancelled) setState({ orden: data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ orden: null, loading: false, error: err instanceof Error ? err.message : 'Error al cargar detalle de orden' });
      });

    return () => { cancelled = true; };
  }, [idOrdenCompra, tick]);

  const refetch = useCallback(() => {
    setTick(t => t + 1);
    setState(s => ({ ...s, loading: true }));
  }, []);

  return { ...state, refetch };
}
