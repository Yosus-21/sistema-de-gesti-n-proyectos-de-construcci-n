import { useState } from 'react';
import { alertasNotificacionesService } from '../services/alertas-notificaciones.service';

export function useDesactivarAlerta() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const desactivarAlerta = async (idAlerta: number) => {
    setLoading(true);
    try {
      const result = await alertasNotificacionesService.desactivarAlerta(idAlerta);
      setError(null);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al desactivar alerta';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { desactivarAlerta, loading, error };
}
