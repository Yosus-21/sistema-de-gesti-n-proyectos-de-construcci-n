import { useState, useEffect, useCallback } from 'react';
import { alertasNotificacionesService } from '../services/alertas-notificaciones.service';
import type { Alerta, ListarAlertasParams } from '../types/alerta-notificacion.types';

export function useAlertas(initialParams: ListarAlertasParams = {}) {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ListarAlertasParams>(initialParams);

  const fetchAlertas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await alertasNotificacionesService.listarAlertas(params);
      setAlertas(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar alertas');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAlertas();
  }, [fetchAlertas]);

  const updateParams = (newParams: ListarAlertasParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return { alertas, loading, error, refetch: fetchAlertas, params, updateParams };
}
