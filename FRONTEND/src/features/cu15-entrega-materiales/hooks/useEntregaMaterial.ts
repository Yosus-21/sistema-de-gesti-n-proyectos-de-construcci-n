import { useState, useEffect, useCallback } from 'react';
import { entregasMaterialesService } from '../services/entregas-materiales.service';
import type { EntregaMaterial } from '../types/entrega-material.types';

export function useEntregaMaterial(idEntregaMaterial: number | null) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({
    entrega: null as EntregaMaterial | null,
    loading: idEntregaMaterial !== null,
    error: null as string | null,
  });

  useEffect(() => {
    if (!idEntregaMaterial) return;
    let cancelled = false;
    
    entregasMaterialesService.consultarEntregaMaterial(idEntregaMaterial)
      .then(data => {
        if (!cancelled) setState({ entrega: data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ entrega: null, loading: false, error: err instanceof Error ? err.message : 'Error al cargar detalle de entrega' });
      });

    return () => { cancelled = true; };
  }, [idEntregaMaterial, tick]);

  const refetch = useCallback(() => {
    setTick(t => t + 1);
    setState(s => ({ ...s, loading: true }));
  }, []);

  return { ...state, refetch };
}
