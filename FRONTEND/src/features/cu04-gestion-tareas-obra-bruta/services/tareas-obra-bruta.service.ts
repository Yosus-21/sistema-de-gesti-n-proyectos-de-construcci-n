import { httpClient } from '../../../shared/api/http-client';
import type { 
  TareaObraBruta, 
  RegistrarTareaObraBrutaDto, 
  ModificarTareaObraBrutaDto, 
  ListarTareasObraBrutaParams 
} from '../types/tarea-obra-bruta.types';

const BASE = '/cu04/tareas-obra-bruta';

function buildQuery(params?: ListarTareasObraBrutaParams): string {
  if (!params) return '';
  const qs = new URLSearchParams();
  if (params.idProyecto) qs.set('idProyecto', String(params.idProyecto));
  if (params.busqueda) qs.set('busqueda', params.busqueda);
  if (params.pagina !== undefined) qs.set('pagina', String(params.pagina));
  if (params.limite !== undefined) qs.set('limite', String(params.limite));
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const tareasObraBrutaService = {
  listarTareasObraBruta: (params?: ListarTareasObraBrutaParams) => 
    httpClient.get<TareaObraBruta[]>(`${BASE}${buildQuery(params)}`),

  registrarTareaObraBruta: (data: RegistrarTareaObraBrutaDto) => 
    httpClient.post<TareaObraBruta>(BASE, data),

  modificarTareaObraBruta: (idTarea: number, data: ModificarTareaObraBrutaDto) => 
    httpClient.patch<TareaObraBruta>(`${BASE}/${idTarea}`, data),

  eliminarTareaObraBruta: (idTarea: number) => 
    httpClient.delete<void>(`${BASE}/${idTarea}`),
};
