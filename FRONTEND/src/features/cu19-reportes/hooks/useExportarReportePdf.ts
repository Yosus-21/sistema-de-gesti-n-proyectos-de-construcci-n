import { useState } from 'react';
import { reportesService } from '../services/reportes.service';

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
