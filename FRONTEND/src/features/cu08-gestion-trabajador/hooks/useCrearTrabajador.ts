import { useState } from 'react';
import { trabajadoresService } from '../services/trabajadores.service';
import type { RegistrarTrabajadorDto } from '../types/trabajador.types';

export function useCrearTrabajador() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearTrabajador = async (data: RegistrarTrabajadorDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await trabajadoresService.registrarTrabajador(data);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrar trabajador';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { crearTrabajador, loading, error };
}
