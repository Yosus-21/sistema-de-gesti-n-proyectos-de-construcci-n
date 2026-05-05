import { useState, useCallback } from 'react';
import { proveedoresService } from '../services/proveedores.service';
import type { ValidarProveedorResponse } from '../types/proveedor.types';

export function useValidarProveedor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ValidarProveedorResponse | null>(null);

  const validarProveedor = useCallback(async (idProveedor: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await proveedoresService.validarProveedor(idProveedor);
      setResultado(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al validar proveedor';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { validarProveedor, loading, error, resultado };
}
