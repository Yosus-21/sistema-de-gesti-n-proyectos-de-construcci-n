import { httpClient } from '../../../shared/api/http-client';
import type {
  Proyecto,
  ListarProyectosParams,
  CrearProyectoDto,
  EstadoProyecto,
} from '../types/proyecto.types';

const BASE = '/cu02/proyectos';

function buildQuery(params?: ListarProyectosParams): string {
  if (!params) return '';
  const qs = new URLSearchParams();
  if (params.idCliente !== undefined) qs.set('idCliente', String(params.idCliente));
  if (params.busqueda) qs.set('busqueda', params.busqueda);
  if (params.pagina !== undefined) qs.set('pagina', String(params.pagina));
  if (params.limite !== undefined) qs.set('limite', String(params.limite));
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const proyectosService = {
  listarProyectos: (params?: ListarProyectosParams) =>
    httpClient.get<Proyecto[]>(`${BASE}${buildQuery(params)}`),

  consultarProyecto: (idProyecto: number) =>
    httpClient.get<Proyecto>(`${BASE}/${idProyecto}`),

  crearProyecto: (data: CrearProyectoDto) =>
    httpClient.post<Proyecto>(BASE, data),

  cambiarEstadoProyecto: (idProyecto: number, estadoProyecto: EstadoProyecto) =>
    httpClient.patch<Proyecto>(`${BASE}/${idProyecto}/estado`, { estadoProyecto }),
};
