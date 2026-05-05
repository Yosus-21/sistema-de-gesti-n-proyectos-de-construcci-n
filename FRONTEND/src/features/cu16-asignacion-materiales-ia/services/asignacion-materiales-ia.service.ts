import { httpClient } from '../../../shared/api/http-client';
import type { 
  AsignacionMaterialIa, 
  GenerarPropuestaAsignacionMaterialDto, 
  AjustarAsignacionMaterialDto, 
  ValidarRestriccionesAsignacionMaterialDto,
  ListarAsignacionesMaterialIaParams,
  ValidarRestriccionesAsignacionMaterialResponse
} from '../types/asignacion-material-ia.types';

const BASE_URL = '/cu16/asignacion-materiales-ia';

export const asignacionMaterialesIaService = {
  listarAsignacionesMaterialIa: async (params?: ListarAsignacionesMaterialIaParams): Promise<AsignacionMaterialIa[]> => {
    let url = BASE_URL;
    if (params) {
      const query = new URLSearchParams();
      if (params.idTarea) query.append('idTarea', params.idTarea.toString());
      if (params.pagina) query.append('pagina', params.pagina.toString());
      if (params.limite) query.append('limite', params.limite.toString());
      const queryString = query.toString();
      if (queryString) url += `?${queryString}`;
    }
    return httpClient.get<AsignacionMaterialIa[]>(url);
  },

  generarPropuestaAsignacionMaterial: async (data: GenerarPropuestaAsignacionMaterialDto): Promise<AsignacionMaterialIa> => {
    return httpClient.post<AsignacionMaterialIa>(`${BASE_URL}/propuestas`, data);
  },

  confirmarAsignacionMaterial: async (idAsignacionMaterial: number): Promise<AsignacionMaterialIa> => {
    return httpClient.patch<AsignacionMaterialIa>(`${BASE_URL}/${idAsignacionMaterial}/confirmar`, {});
  },

  ajustarAsignacionMaterial: async (idAsignacionMaterial: number, data: AjustarAsignacionMaterialDto): Promise<AsignacionMaterialIa> => {
    return httpClient.patch<AsignacionMaterialIa>(`${BASE_URL}/${idAsignacionMaterial}/ajustar`, data);
  },

  validarRestriccionesAsignacionMaterial: async (data: ValidarRestriccionesAsignacionMaterialDto): Promise<ValidarRestriccionesAsignacionMaterialResponse> => {
    return httpClient.post<ValidarRestriccionesAsignacionMaterialResponse>(`${BASE_URL}/validar-restricciones`, data);
  }
};
