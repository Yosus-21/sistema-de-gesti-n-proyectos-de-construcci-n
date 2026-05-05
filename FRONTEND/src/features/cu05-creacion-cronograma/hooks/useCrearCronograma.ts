import { useState } from 'react';
import { cronogramasService } from '../services/cronogramas.service';
import type { CrearCronogramaDto } from '../types/cronograma.types';

export function useCrearCronograma() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearCronograma = async (data: CrearCronogramaDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cronogramasService.crearCronograma(data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear cronograma';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { crearCronograma, loading, error };
}
