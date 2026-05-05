import { useState } from 'react';
import { asignacionesContratistaService } from '../services/asignaciones-contratista.service';
import type { ReasignarTrabajadorDto } from '../types/asignacion-contratista.types';

export function useReasignarTrabajadorContratista() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reasignarTrabajador = async (idAsignacionTarea: number, data: ReasignarTrabajadorDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asignacionesContratistaService.reasignarTrabajadorContratista(idAsignacionTarea, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al reasignar trabajador';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { reasignarTrabajador, loading, error };
}
