import { useState, useEffect, useCallback } from 'react';
import { materialesService } from '../services/materiales.service';
import type { Material } from '../types/material.types';

export function useMaterial(idMaterial: number | null) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({
    material: null as Material | null,
    loading: idMaterial !== null,
    error: null as string | null,
  });

  useEffect(() => {
    if (!idMaterial) return;
    let cancelled = false;
    
    materialesService.consultarMaterial(idMaterial)
      .then(data => {
        if (!cancelled) setState({ material: data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ material: null, loading: false, error: err instanceof Error ? err.message : 'Error' });
      });

    return () => { cancelled = true; };
  }, [idMaterial, tick]);

  const refetch = useCallback(() => {
    setTick(t => t + 1);
    setState(s => ({ ...s, loading: true }));
  }, []);

  return { ...state, refetch };
}
