import { useState } from 'react';
import { trabajadoresService } from '../services/trabajadores.service';
import type { 
  VerificarDisponibilidadTrabajadorParams, 
  DisponibilidadTrabajadorResponse 
} from '../types/trabajador.types';

export function useVerificarDisponibilidadTrabajador() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<DisponibilidadTrabajadorResponse | null>(null);

  const verificarDisponibilidad = async (idTrabajador: number, params: VerificarDisponibilidadTrabajadorParams) => {
    setLoading(true);
    setError(null);
    setResultado(null);
    try {
      const res = await trabajadoresService.verificarDisponibilidadTrabajador(idTrabajador, params);
      setResultado(res);
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al verificar disponibilidad';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const limpiarResultado = () => setResultado(null);

  return { verificarDisponibilidad, resultado, loading, error, limpiarResultado };
}
