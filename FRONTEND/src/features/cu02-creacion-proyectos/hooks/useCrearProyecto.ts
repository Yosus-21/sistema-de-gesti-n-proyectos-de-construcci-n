import { useState } from 'react';
import { proyectosService } from '../services/proyectos.service';
import type { CrearProyectoDto } from '../types/proyecto.types';

export function useCrearProyecto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearProyecto = async (data: CrearProyectoDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await proyectosService.crearProyecto(data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear proyecto';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { crearProyecto, loading, error };
}
