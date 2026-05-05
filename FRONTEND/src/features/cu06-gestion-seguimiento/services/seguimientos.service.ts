import { httpClient } from '../../../shared/api/http-client';
import type {
  Seguimiento,
  RegistrarSeguimientoDto,
  ModificarSeguimientoDto,
  ListarSeguimientosParams,
  CalcularDesviacionResponse,
} from '../types/seguimiento.types';

const BASE = '/cu06/seguimientos';

function buildQuery(params?: ListarSeguimientosParams): string {
  if (!params) return '';
  const qs = new URLSearchParams();
  if (params.idTarea !== undefined) qs.set('idTarea', String(params.idTarea));
  if (params.pagina !== undefined) qs.set('pagina', String(params.pagina));
  if (params.limite !== undefined) qs.set('limite', String(params.limite));
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const seguimientosService = {
  listarSeguimientos: (params?: ListarSeguimientosParams) =>
    httpClient.get<Seguimiento[]>(`${BASE}${buildQuery(params)}`),

  consultarSeguimiento: (idSeguimiento: number) =>
    httpClient.get<Seguimiento>(`${BASE}/${idSeguimiento}`),

  registrarSeguimiento: (data: RegistrarSeguimientoDto) =>
    httpClient.post<Seguimiento>(BASE, data),

  modificarSeguimiento: (idSeguimiento: number, data: ModificarSeguimientoDto) =>
    httpClient.patch<Seguimiento>(`${BASE}/${idSeguimiento}`, data),

  calcularDesviacion: (idTarea: number) =>
    httpClient.get<CalcularDesviacionResponse>(`${BASE}/tareas/${idTarea}/desviacion`),
};
