import { useState, useEffect, useCallback } from 'react';
import { tareasObraBrutaService } from '../services/tareas-obra-bruta.service';
import type { TareaObraBruta, ListarTareasObraBrutaParams } from '../types/tarea-obra-bruta.types';

interface FetchState {
  tareas: TareaObraBruta[];
  loading: boolean;
  error: string | null;
}

export function useTareasObraBruta() {
  const [filtros, setFiltros] = useState<ListarTareasObraBrutaParams>({});
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    tareas: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    tareasObraBrutaService
      .listarTareasObraBruta(filtros)
      .then((tareas) => {
        if (!cancelled) setState({ tareas, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            tareas: [],
            loading: false,
            error: err instanceof Error ? err.message : 'Error al cargar tareas de obra bruta',
          });
      });
    return () => {
      cancelled = true;
    };
  }, [filtros, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return {
    tareas: state.tareas,
    loading: state.loading,
    error: state.error,
    refetch,
    filtros,
    setFiltros,
  };
}
