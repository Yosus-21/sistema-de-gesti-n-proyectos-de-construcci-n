import { useState, useCallback } from 'react';
import { contratosContratistaService } from '../services/contratos-contratista.service';
import type { ModificarContratoContratistaDto } from '../types/contrato-contratista.types';

export function useActualizarContratoContratista() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarContrato = useCallback(async (idContrato: number, data: ModificarContratoContratistaDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await contratosContratistaService.modificarContratoContratista(idContrato, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar contrato';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { actualizarContrato, loading, error };
}
