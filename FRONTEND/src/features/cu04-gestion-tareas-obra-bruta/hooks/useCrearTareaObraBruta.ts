import { useState } from 'react';
import { tareasObraBrutaService } from '../services/tareas-obra-bruta.service';
import type { RegistrarTareaObraBrutaDto } from '../types/tarea-obra-bruta.types';

export function useCrearTareaObraBruta() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearTarea = async (data: RegistrarTareaObraBrutaDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await tareasObraBrutaService.registrarTareaObraBruta(data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrar tarea';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { crearTarea, loading, error };
}
