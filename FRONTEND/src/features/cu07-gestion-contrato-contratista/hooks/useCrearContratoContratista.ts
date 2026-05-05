import { useState, useCallback } from 'react';
import { contratosContratistaService } from '../services/contratos-contratista.service';
import type { RegistrarContratoContratistaDto } from '../types/contrato-contratista.types';

export function useCrearContratoContratista() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearContrato = useCallback(async (data: RegistrarContratoContratistaDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await contratosContratistaService.registrarContratoContratista(data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrar contrato';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { crearContrato, loading, error };
}
