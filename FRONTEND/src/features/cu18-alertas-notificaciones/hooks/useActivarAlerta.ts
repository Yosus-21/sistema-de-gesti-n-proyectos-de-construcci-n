import { useState } from 'react';
import { alertasNotificacionesService } from '../services/alertas-notificaciones.service';

export function useActivarAlerta() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activarAlerta = async (idAlerta: number) => {
    setLoading(true);
    try {
      const result = await alertasNotificacionesService.activarAlerta(idAlerta);
      setError(null);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al activar alerta';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { activarAlerta, loading, error };
}
