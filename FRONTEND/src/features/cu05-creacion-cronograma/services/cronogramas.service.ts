import { httpClient } from '../../../shared/api/http-client';
import type {
  Cronograma,
  ListarCronogramasParams,
  CrearCronogramaDto,
  ReplanificarCronogramaDto,
} from '../types/cronograma.types';

const BASE = '/cu05/cronogramas';

function buildQuery(params?: ListarCronogramasParams): string {
  if (!params) return '';
  const qs = new URLSearchParams();
  if (params.idProyecto !== undefined) qs.set('idProyecto', String(params.idProyecto));
  if (params.busqueda) qs.set('busqueda', params.busqueda);
  if (params.pagina !== undefined) qs.set('pagina', String(params.pagina));
  if (params.limite !== undefined) qs.set('limite', String(params.limite));
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const cronogramasService = {
  listarCronogramas: (params?: ListarCronogramasParams) =>
    httpClient.get<Cronograma[]>(`${BASE}${buildQuery(params)}`),

  consultarCronograma: (idCronograma: number) =>
    httpClient.get<Cronograma>(`${BASE}/${idCronograma}`),

  crearCronograma: (data: CrearCronogramaDto) =>
    httpClient.post<Cronograma>(BASE, data),

  replanificarCronograma: (idCronograma: number, data: ReplanificarCronogramaDto) =>
    httpClient.patch<Cronograma>(`${BASE}/${idCronograma}/replanificar`, data),
};
