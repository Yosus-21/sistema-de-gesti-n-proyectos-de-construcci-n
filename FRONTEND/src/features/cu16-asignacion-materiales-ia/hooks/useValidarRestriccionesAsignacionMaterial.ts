import { useState, useCallback } from 'react';
import { asignacionMaterialesIaService } from '../services/asignacion-materiales-ia.service';
import type { 
  ValidarRestriccionesAsignacionMaterialDto, 
  ValidarRestriccionesAsignacionMaterialResponse 
} from '../types/asignacion-material-ia.types';

export function useValidarRestriccionesAsignacionMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ValidarRestriccionesAsignacionMaterialResponse | null>(null);

  const validarRestricciones = useCallback(async (data: ValidarRestriccionesAsignacionMaterialDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await asignacionMaterialesIaService.validarRestriccionesAsignacionMaterial(data);
      setResultado(res);
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al validar restricciones';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { validarRestricciones, loading, error, resultado };
}
