import { useState, useCallback } from 'react';
import { proveedoresService } from '../services/proveedores.service';
import type { RegistrarProveedorDto } from '../types/proveedor.types';

export function useCrearProveedor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearProveedor = useCallback(async (data: RegistrarProveedorDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await proveedoresService.registrarProveedor(data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrar proveedor';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { crearProveedor, loading, error };
}
