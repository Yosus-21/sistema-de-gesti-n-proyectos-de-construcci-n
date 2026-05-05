import { useState, useCallback } from 'react';
import { pronosticoMaterialesIaService } from '../services/pronostico-materiales-ia.service';
import type { CalcularConfianzaPronosticoResponse } from '../types/pronostico-material-ia.types';

export function useCalcularConfianzaPronostico() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<CalcularConfianzaPronosticoResponse | null>(null);

  const calcularConfianza = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await pronosticoMaterialesIaService.calcularConfianzaPronostico(id);
      setResultado(res);
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al calcular confianza';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { calcularConfianza, loading, error, resultado };
}
