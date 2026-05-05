import { useState, useEffect, useCallback } from 'react';
import { seguimientosService } from '../services/seguimientos.service';
import type { CalcularDesviacionResponse } from '../types/seguimiento.types';

interface FetchState {
  resultado: CalcularDesviacionResponse | null;
  loading: boolean;
  error: string | null;
}

export function useCalcularDesviacion() {
  const [idTarea, setIdTarea] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    resultado: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (idTarea === null) return;

    let cancelled = false;
    
    seguimientosService.calcularDesviacion(idTarea)
      .then(resultado => {
        if (!cancelled) setState({ resultado, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) {
          setState({
            resultado: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Error al calcular desviación'
          });
        }
      });

    return () => { cancelled = true; };
  }, [idTarea, tick]);

  const calcular = useCallback((id: number) => {
    setIdTarea(id);
    setTick(t => t + 1);
  }, []);

  const limpiarResultado = useCallback(() => {
    setIdTarea(null);
    setState({ resultado: null, loading: false, error: null });
  }, []);

  return { 
    calcularDesviacion: calcular, 
    resultado: state.resultado, 
    loading: state.loading, 
    error: state.error, 
    limpiarResultado 
  };
}
