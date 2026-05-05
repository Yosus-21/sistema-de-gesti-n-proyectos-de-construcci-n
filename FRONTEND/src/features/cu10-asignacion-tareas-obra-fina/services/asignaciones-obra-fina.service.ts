import { httpClient } from '../../../shared/api/http-client';
import type { 
  AsignacionObraFina, 
  CrearAsignacionObraFinaDto, 
  ModificarAsignacionObraFinaDto, 
  ListarAsignacionesObraFinaParams 
} from '../types/asignacion-obra-fina.types';

const BASE = '/cu10/asignaciones-obra-fina';

function buildQuery(params?: ListarAsignacionesObraFinaParams): string {
  if (!params) return '';
  const qs = new URLSearchParams();
  if (params.idTarea) qs.set('idTarea', String(params.idTarea));
  if (params.idTrabajador) qs.set('idTrabajador', String(params.idTrabajador));
  if (params.pagina !== undefined) qs.set('pagina', String(params.pagina));
  if (params.limite !== undefined) qs.set('limite', String(params.limite));
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const asignacionesObraFinaService = {
  listarAsignacionesObraFina: (params?: ListarAsignacionesObraFinaParams) => 
    httpClient.get<AsignacionObraFina[]>(`${BASE}${buildQuery(params)}`),

  consultarAsignacionObraFina: (idAsignacionTarea: number) => 
    httpClient.get<AsignacionObraFina>(`${BASE}/${idAsignacionTarea}`),

  crearAsignacionObraFina: (data: CrearAsignacionObraFinaDto) => 
    httpClient.post<AsignacionObraFina>(BASE, data),

  modificarAsignacionObraFina: (idAsignacionTarea: number, data: ModificarAsignacionObraFinaDto) => 
    httpClient.patch<AsignacionObraFina>(`${BASE}/${idAsignacionTarea}`, data),

  cancelarAsignacionObraFina: (idAsignacionTarea: number) => 
    httpClient.patch<AsignacionObraFina>(`${BASE}/${idAsignacionTarea}/cancelar`, {}),
};
