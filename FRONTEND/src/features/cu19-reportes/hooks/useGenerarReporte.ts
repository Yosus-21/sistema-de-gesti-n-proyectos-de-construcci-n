import { useState } from 'react';
import { reportesService } from '../services/reportes.service';
import type { GenerarReporteDto } from '../types/reporte.types';

export function useGenerarReporte() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generarReporte = async (data: GenerarReporteDto) => {
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
