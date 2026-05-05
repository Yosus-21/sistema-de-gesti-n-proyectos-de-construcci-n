import { useState } from 'react';
import { cronogramasService } from '../services/cronogramas.service';
import type { ReplanificarCronogramaDto } from '../types/cronograma.types';

export function useReplanificarCronograma() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const replanificarCronograma = async (idCronograma: number, data: ReplanificarCronogramaDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cronogramasService.replanificarCronograma(idCronograma, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al replanificar cronograma';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { replanificarCronograma, loading, error };
}
