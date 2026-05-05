import { httpClient } from '../../../shared/api/http-client';
import type { 
  TareaObraFina, 
  RegistrarTareaObraFinaDto, 
  ModificarTareaObraFinaDto, 
  ListarTareasObraFinaParams 
} from '../types/tarea-obra-fina.types';

const BASE = '/cu03/tareas-obra-fina';

function buildQuery(params?: ListarTareasObraFinaParams): string {
  if (!params) return '';
  const qs = new URLSearchParams();
  if (params.idProyecto) qs.set('idProyecto', String(params.idProyecto));
  if (params.busqueda) qs.set('busqueda', params.busqueda);
  if (params.pagina !== undefined) qs.set('pagina', String(params.pagina));
  if (params.limite !== undefined) qs.set('limite', String(params.limite));
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const tareasObraFinaService = {
  listarTareasObraFina: (params?: ListarTareasObraFinaParams) => 
    httpClient.get<TareaObraFina[]>(`${BASE}${buildQuery(params)}`),

  registrarTareaObraFina: (data: RegistrarTareaObraFinaDto) => 
    httpClient.post<TareaObraFina>(BASE, data),

  modificarTareaObraFina: (idTarea: number, data: ModificarTareaObraFinaDto) => 
    httpClient.patch<TareaObraFina>(`${BASE}/${idTarea}`, data),

  eliminarTareaObraFina: (idTarea: number) => 
    httpClient.delete<void>(`${BASE}/${idTarea}`),
};
