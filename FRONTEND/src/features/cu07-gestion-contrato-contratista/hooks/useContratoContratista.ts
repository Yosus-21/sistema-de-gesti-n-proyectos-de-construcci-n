import { useState, useEffect, useCallback } from 'react';
import { contratosContratistaService } from '../services/contratos-contratista.service';
import type { ContratoContratista } from '../types/contrato-contratista.types';

export function useContratoContratista(idContrato: number | null) {
  const [contrato, setContrato] = useState<ContratoContratista | null>(null);
  const [loading, setLoading] = useState(!!idContrato);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!idContrato) return;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true);
    });
    contratosContratistaService.consultarContratoContratista(idContrato)
      .then(data => {
        if (!cancelled) {
          setContrato(data);
          setError(null);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar contrato');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [idContrato, tick]);

  const refetch = useCallback(() => setTick(t => t + 1), []);

  return { contrato, loading, error, refetch };
}
