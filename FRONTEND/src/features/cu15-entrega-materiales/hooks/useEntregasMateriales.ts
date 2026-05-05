import { useState, useEffect, useCallback } from 'react';
import { entregasMaterialesService } from '../services/entregas-materiales.service';
import type { EntregaMaterial, ListarEntregasMaterialParams } from '../types/entrega-material.types';

export function useEntregasMateriales(initialParams: ListarEntregasMaterialParams = {}) {
  const [params, setParams] = useState<ListarEntregasMaterialParams>(initialParams);
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({
    entregas: [] as EntregaMaterial[],
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    let cancelled = false;
    
    entregasMaterialesService.listarEntregasMateriales(params)
      .then(data => {
        if (!cancelled) setState({ entregas: data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ entregas: [], loading: false, error: err instanceof Error ? err.message : 'Error al cargar entregas de materiales' });
      });

    return () => { cancelled = true; };
  }, [params, tick]);

  const updateParams = (newParams: ListarEntregasMaterialParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
    setState(s => ({ ...s, loading: true }));
  };

  const refetch = useCallback(() => {
    setTick(t => t + 1);
    setState(s => ({ ...s, loading: true }));
  }, []);

  return { ...state, params, updateParams, refetch };
}
