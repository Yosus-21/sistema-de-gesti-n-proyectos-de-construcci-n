import { useState, useEffect, useCallback } from 'react';
import { reportesService } from '../services/reportes.service';
import type { Reporte } from '../types/reporte.types';

export function useReporte(idReporte?: number) {
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReporte = useCallback(async () => {
    if (!idReporte) return;
    setLoading(true);
    try {
      const data = await reportesService.consultarReporte(idReporte);
      setReporte(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar reporte');
    } finally {
      setLoading(false);
    }
  }, [idReporte]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReporte();
  }, [fetchReporte]);

  return { reporte, loading, error, refetch: fetchReporte };
}
