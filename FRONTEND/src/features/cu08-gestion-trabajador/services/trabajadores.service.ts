import { httpClient } from '../../../shared/api/http-client';
import type {
  Trabajador,
  ListarTrabajadoresParams,
  RegistrarTrabajadorDto,
  ModificarTrabajadorDto,
  VerificarDisponibilidadTrabajadorParams,
  DisponibilidadTrabajadorResponse,
} from '../types/trabajador.types';

const BASE = '/cu08/trabajadores';

function buildQuery(params?: ListarTrabajadoresParams): string {
  if (!params) return '';
  const qs = new URLSearchParams();
  if (params.ocupacion) qs.set('ocupacion', params.ocupacion);
  if (params.busqueda) qs.set('busqueda', params.busqueda);
  if (params.pagina !== undefined) qs.set('pagina', String(params.pagina));
  if (params.limite !== undefined) qs.set('limite', String(params.limite));
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const trabajadoresService = {
  listarTrabajadores: (params?: ListarTrabajadoresParams) =>
    httpClient.get<Trabajador[]>(`${BASE}${buildQuery(params)}`),

  consultarTrabajador: (idTrabajador: number) =>
    httpClient.get<Trabajador>(`${BASE}/${idTrabajador}`),

  registrarTrabajador: (data: RegistrarTrabajadorDto) =>
    httpClient.post<Trabajador>(BASE, data),

  modificarTrabajador: (idTrabajador: number, data: ModificarTrabajadorDto) =>
    httpClient.patch<Trabajador>(`${BASE}/${idTrabajador}`, data),

  eliminarTrabajador: (idTrabajador: number) =>
    httpClient.delete<void>(`${BASE}/${idTrabajador}`),

  verificarDisponibilidadTrabajador: (idTrabajador: number, params: VerificarDisponibilidadTrabajadorParams) => {
    const qs = new URLSearchParams();
    qs.set('fechaInicio', params.fechaInicio);
    qs.set('fechaFin', params.fechaFin);
    return httpClient.get<DisponibilidadTrabajadorResponse>(`${BASE}/${idTrabajador}/disponibilidad?${qs.toString()}`);
  }
};
