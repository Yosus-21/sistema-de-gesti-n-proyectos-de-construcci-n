import { useState, useEffect, useCallback } from 'react';
import { proveedoresService } from '../services/proveedores.service';
import type { Proveedor } from '../types/proveedor.types';

export function useProveedor(idProveedor: number | null) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({
    proveedor: null as Proveedor | null,
    loading: idProveedor !== null,
    error: null as string | null,
  });

  useEffect(() => {
    if (!idProveedor) return;
    let cancelled = false;
    
    proveedoresService.consultarProveedor(idProveedor)
      .then(data => {
        if (!cancelled) setState({ proveedor: data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ proveedor: null, loading: false, error: err instanceof Error ? err.message : 'Error' });
      });

    return () => { cancelled = true; };
  }, [idProveedor, tick]);

  const refetch = useCallback(() => {
    setTick(t => t + 1);
    setState(s => ({ ...s, loading: true }));
  }, []);

  return { ...state, refetch };
}
