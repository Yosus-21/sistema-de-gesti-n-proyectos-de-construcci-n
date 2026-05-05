import { useState } from 'react';
import { alertasNotificacionesService } from '../services/alertas-notificaciones.service';
import type { ConfigurarAlertaDto } from '../types/alerta-notificacion.types';

export function useConfigurarAlerta() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configurarAlerta = async (data: ConfigurarAlertaDto) => {
    setLoading(true);
    try {
      const result = await alertasNotificacionesService.configurarAlerta(data);
      setError(null);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al configurar alerta';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { configurarAlerta, loading, error };
}

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

export function useGenerarNotificacion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generarNotificacion = async (idAlerta: number, data: any) => {
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
