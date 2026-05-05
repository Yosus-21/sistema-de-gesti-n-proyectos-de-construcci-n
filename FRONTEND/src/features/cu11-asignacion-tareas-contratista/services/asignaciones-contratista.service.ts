import { httpClient } from '../../../shared/api/http-client';
import type { 
  AsignacionContratista, 
  CrearAsignacionContratistaDto, 
  ReasignarTrabajadorDto, 
  ListarAsignacionesContratistaParams 
} from '../types/asignacion-contratista.types';

const BASE = '/cu11/asignaciones-contratista';

function buildQuery(params?: ListarAsignacionesContratistaParams): string {
  if (!params) return '';
  const qs = new URLSearchParams();
  if (params.idTarea) qs.set('idTarea', String(params.idTarea));
  if (params.idTrabajador) qs.set('idTrabajador', String(params.idTrabajador));
  if (params.pagina !== undefined) qs.set('pagina', String(params.pagina));
  if (params.limite !== undefined) qs.set('limite', String(params.limite));
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const asignacionesContratistaService = {
  listarAsignacionesContratista: (params?: ListarAsignacionesContratistaParams) => 
    httpClient.get<AsignacionContratista[]>(`${BASE}${buildQuery(params)}`),

  consultarAsignacionContratista: (idAsignacionTarea: number) => 
    httpClient.get<AsignacionContratista>(`${BASE}/${idAsignacionTarea}`),

  crearAsignacionContratista: (data: CrearAsignacionContratistaDto) => 
    httpClient.post<AsignacionContratista>(BASE, data),

  reasignarTrabajadorContratista: (idAsignacionTarea: number, data: ReasignarTrabajadorDto) => 
    httpClient.patch<AsignacionContratista>(`${BASE}/${idAsignacionTarea}/reasignar`, data),

  cancelarAsignacionContratista: (idAsignacionTarea: number) => 
    httpClient.patch<AsignacionContratista>(`${BASE}/${idAsignacionTarea}/cancelar`, {}),
};
