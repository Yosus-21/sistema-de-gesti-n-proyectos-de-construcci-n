import { useState, useCallback } from 'react';
import { proveedoresService } from '../services/proveedores.service';

export function useEliminarProveedor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eliminarProveedor = useCallback(async (idProveedor: number) => {
    setLoading(true);
    setError(null);
    try {
      await proveedoresService.eliminarProveedor(idProveedor);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar proveedor';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { eliminarProveedor, loading, error };
}
