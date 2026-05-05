import { useState, useCallback } from 'react';
import { contratosContratistaService } from '../services/contratos-contratista.service';
import type { ValidarVigenciaContratoResponse } from '../types/contrato-contratista.types';

export function useValidarVigenciaContrato() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ValidarVigenciaContratoResponse | null>(null);

  const validarVigencia = useCallback(async (idContrato: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contratosContratistaService.validarVigenciaContrato(idContrato);
      setResultado(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al validar vigencia';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { validarVigencia, loading, error, resultado };
}
