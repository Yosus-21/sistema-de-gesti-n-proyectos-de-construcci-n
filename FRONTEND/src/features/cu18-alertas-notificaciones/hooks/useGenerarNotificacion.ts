import { useState } from 'react';
import { alertasNotificacionesService } from '../services/alertas-notificaciones.service';
import type { GenerarNotificacionDto } from '../types/alerta-notificacion.types';

export function useGenerarNotificacion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generarNotificacion = async (idAlerta: number, data: GenerarNotificacionDto) => {
    setLoading(true);
    try {
      const result = await alertasNotificacionesService.generarNotificacion(idAlerta, data);
      setError(null);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al generar notificación';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generarNotificacion, loading, error };
}
