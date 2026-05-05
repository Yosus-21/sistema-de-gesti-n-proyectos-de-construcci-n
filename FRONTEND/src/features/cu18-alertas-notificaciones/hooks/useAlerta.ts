import { useState, useEffect, useCallback } from 'react';
import { alertasNotificacionesService } from '../services/alertas-notificaciones.service';
import type { Alerta } from '../types/alerta-notificacion.types';

export function useAlerta(idAlerta?: number) {
  const [alerta, setAlerta] = useState<Alerta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerta = useCallback(async () => {
    if (!idAlerta) return;
    setLoading(true);
    try {
      const data = await alertasNotificacionesService.consultarAlerta(idAlerta);
      setAlerta(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar alerta');
    } finally {
      setLoading(false);
    }
  }, [idAlerta]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAlerta();
  }, [fetchAlerta]);

  return { alerta, loading, error, refetch: fetchAlerta };
}
