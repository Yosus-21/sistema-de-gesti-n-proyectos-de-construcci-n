import { useState, useEffect, useCallback } from 'react';
import { proyectosService } from '../services/proyectos.service';
import type { Proyecto, ListarProyectosParams } from '../types/proyecto.types';

interface FetchState {
  proyectos: Proyecto[];
  loading: boolean;
  error: string | null;
}

export function useProyectos() {
  const [filtros, setFiltros] = useState<ListarProyectosParams>({});
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState>({
    proyectos: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    proyectosService
      .listarProyectos(filtros)
      .then((proyectos) => {
        if (!cancelled) setState({ proyectos, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            proyectos: [],
            loading: false,
            error: err instanceof Error ? err.message : 'Error al cargar proyectos',
          });
      });
    return () => {
      cancelled = true;
    };
  }, [filtros, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return {
    proyectos: state.proyectos,
    loading: state.loading,
    error: state.error,
    refetch,
    filtros,
    setFiltros,
  };
}
