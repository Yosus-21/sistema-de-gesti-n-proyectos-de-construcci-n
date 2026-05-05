import { useState, useEffect, useCallback } from 'react';
import { tareasObraFinaService } from '../services/tareas-obra-fina.service';
import type { TareaObraFina, ListarTareasObraFinaParams } from '../types/tarea-obra-fina.types';

interface FetchState {
  tareas: TareaObraFina[];
  loading: boolean;
  error: string | null;
}

export function useTareasObraFina() {
  const [filtros, setFiltros] = useState<ListarTareasObraFinaParams>({});
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    tareas: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    tareasObraFinaService
      .listarTareasObraFina(filtros)
      .then((tareas) => {
        if (!cancelled) setState({ tareas, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            tareas: [],
            loading: false,
            error: err instanceof Error ? err.message : 'Error al cargar tareas de obra fina',
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
