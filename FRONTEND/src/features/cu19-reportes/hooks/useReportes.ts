import { useState, useEffect, useCallback } from 'react';
import { reportesService } from '../services/reportes.service';
import type { Reporte, ListarReportesParams } from '../types/reporte.types';

export function useReportes(initialParams: ListarReportesParams = {}) {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ListarReportesParams>(initialParams);

  const fetchReportes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reportesService.listarReportes(params);
      setReportes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReportes();
  }, [fetchReportes]);

  const updateParams = (newParams: ListarReportesParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return { reportes, loading, error, refetch: fetchReportes, params, updateParams };
}

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

export function useGenerarReporte() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generarReporte = async (data: any) => {
    setLoading(true);
    try {
      const result = await reportesService.generarReporte(data);
      setError(null);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al generar reporte';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generarReporte, loading, error };
}

export function useExportarReportePdf() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportarReportePdf = async (idReporte: number) => {
    setLoading(true);
    try {
      const result = await reportesService.exportarReportePdf(idReporte);
      setError(null);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al exportar reporte';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { exportarReportePdf, loading, error };
}
