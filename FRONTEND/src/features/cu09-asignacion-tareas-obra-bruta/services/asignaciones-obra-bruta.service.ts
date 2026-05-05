import { httpClient } from '../../../shared/api/http-client';
import type { 
  AsignacionObraBruta, 
  CrearAsignacionObraBrutaDto, 
  ModificarAsignacionObraBrutaDto, 
  ListarAsignacionesObraBrutaParams 
} from '../types/asignacion-obra-bruta.types';

const BASE = '/cu09/asignaciones-obra-bruta';

function buildQuery(params?: ListarAsignacionesObraBrutaParams): string {
  if (!params) return '';
  const qs = new URLSearchParams();
  if (params.idTarea) qs.set('idTarea', String(params.idTarea));
  if (params.idTrabajador) qs.set('idTrabajador', String(params.idTrabajador));
  if (params.pagina !== undefined) qs.set('pagina', String(params.pagina));
  if (params.limite !== undefined) qs.set('limite', String(params.limite));
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const asignacionesObraBrutaService = {
  listarAsignacionesObraBruta: (params?: ListarAsignacionesObraBrutaParams) => 
    httpClient.get<AsignacionObraBruta[]>(`${BASE}${buildQuery(params)}`),

  consultarAsignacionObraBruta: (idAsignacionTarea: number) => 
    httpClient.get<AsignacionObraBruta>(`${BASE}/${idAsignacionTarea}`),

  crearAsignacionObraBruta: (data: CrearAsignacionObraBrutaDto) => 
    httpClient.post<AsignacionObraBruta>(BASE, data),

  modificarAsignacionObraBruta: (idAsignacionTarea: number, data: ModificarAsignacionObraBrutaDto) => 
    httpClient.patch<AsignacionObraBruta>(`${BASE}/${idAsignacionTarea}`, data),

  cancelarAsignacionObraBruta: (idAsignacionTarea: number) => 
    httpClient.patch<AsignacionObraBruta>(`${BASE}/${idAsignacionTarea}/cancelar`, {}),
};
