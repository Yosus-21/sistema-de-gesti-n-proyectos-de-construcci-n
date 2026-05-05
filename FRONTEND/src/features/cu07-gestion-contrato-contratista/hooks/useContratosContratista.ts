import { useState, useEffect, useCallback } from 'react';
import { contratosContratistaService } from '../services/contratos-contratista.service';
import type { ContratoContratista, ListarContratosContratistaParams } from '../types/contrato-contratista.types';

export function useContratosContratista(initialParams?: ListarContratosContratistaParams) {
  const [contratos, setContratos] = useState<ContratoContratista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ListarContratosContratistaParams | undefined>(initialParams);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true);
    });
    contratosContratistaService.listarContratosContratista(params)
      .then(data => {
        if (!cancelled) {
          setContratos(data);
          setError(null);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar contratos');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [params, tick]);

  const refetch = useCallback(() => setTick(t => t + 1), []);
  const updateParams = useCallback((newParams: ListarContratosContratistaParams) => setParams(newParams), []);

  return { contratos, loading, error, refetch, updateParams };
}
