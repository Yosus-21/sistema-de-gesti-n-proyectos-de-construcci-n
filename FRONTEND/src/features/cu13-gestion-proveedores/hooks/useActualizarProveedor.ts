import { useState, useCallback } from 'react';
import { proveedoresService } from '../services/proveedores.service';
import type { ModificarProveedorDto } from '../types/proveedor.types';

export function useActualizarProveedor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarProveedor = useCallback(async (idProveedor: number, data: ModificarProveedorDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await proveedoresService.modificarProveedor(idProveedor, data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar proveedor';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { actualizarProveedor, loading, error };
}
