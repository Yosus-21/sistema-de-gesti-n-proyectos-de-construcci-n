import { useState } from 'react';
import { tareasObraFinaService } from '../services/tareas-obra-fina.service';
import type { RegistrarTareaObraFinaDto } from '../types/tarea-obra-fina.types';

export function useCrearTareaObraFina() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearTarea = async (data: RegistrarTareaObraFinaDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await tareasObraFinaService.registrarTareaObraFina(data);
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
