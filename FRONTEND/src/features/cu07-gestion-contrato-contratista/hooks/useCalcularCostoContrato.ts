import { useState, useCallback } from 'react';
import { contratosContratistaService } from '../services/contratos-contratista.service';
import type { CalcularCostoContratoResponse } from '../types/contrato-contratista.types';

export function useCalcularCostoContrato() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<CalcularCostoContratoResponse | null>(null);

  const calcularCosto = useCallback(async (idContrato: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contratosContratistaService.calcularCostoContrato(idContrato);
      setResultado(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al calcular costo';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { calcularCosto, loading, error, resultado };
}
