import { useState } from 'react';
import { proyectosService } from '../services/proyectos.service';
import type { EstadoProyecto } from '../types/proyecto.types';

export function useCambiarEstadoProyecto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cambiarEstadoProyecto = async (idProyecto: number, estadoProyecto: EstadoProyecto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await proyectosService.cambiarEstadoProyecto(idProyecto, estadoProyecto);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cambiar estado del proyecto';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { cambiarEstadoProyecto, loading, error };
}
