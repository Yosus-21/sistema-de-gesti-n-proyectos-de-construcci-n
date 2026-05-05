import { useState, useEffect, useCallback } from 'react';
import { proyectosService } from '../services/proyectos.service';
import type { Proyecto } from '../types/proyecto.types';

interface FetchState {
  proyecto: Proyecto | null;
  loading: boolean;
  error: string | null;
}

export function useProyecto(idProyecto: number | null) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    proyecto: null,
    loading: idProyecto !== null,
    error: null,
  });

  useEffect(() => {
    if (idProyecto === null) return;
    let cancelled = false;
    proyectosService
      .consultarProyecto(idProyecto)
      .then((proyecto) => {
        if (!cancelled) setState({ proyecto, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            proyecto: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Error al cargar proyecto',
          });
      });
    return () => {
      cancelled = true;
    };
  }, [idProyecto, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return {
    proyecto: state.proyecto,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}
