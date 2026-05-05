import { httpClient } from '../../../shared/api/http-client';
import type { 
  PronosticoMaterialIa, 
  GenerarPronosticoMaterialDto, 
  AjustarPronosticoMaterialDto, 
  ListarPronosticosMaterialIaParams,
  CalcularConfianzaPronosticoResponse
} from '../types/pronostico-material-ia.types';

const BASE_URL = '/cu17/pronostico-materiales-ia';

export const pronosticoMaterialesIaService = {
  listarPronosticosMaterialIa: async (params?: ListarPronosticosMaterialIaParams): Promise<PronosticoMaterialIa[]> => {
    let url = BASE_URL;
    if (params) {
      const query = new URLSearchParams();
      if (params.idProyecto) query.append('idProyecto', params.idProyecto.toString());
      if (params.idMaterial) query.append('idMaterial', params.idMaterial.toString());
      if (params.pagina) query.append('pagina', params.pagina.toString());
      if (params.limite) query.append('limite', params.limite.toString());
      const queryString = query.toString();
      if (queryString) url += `?${queryString}`;
    }
    return httpClient.get<PronosticoMaterialIa[]>(url);
  },

  generarPronosticoMaterial: async (data: GenerarPronosticoMaterialDto): Promise<PronosticoMaterialIa> => {
    return httpClient.post<PronosticoMaterialIa>(BASE_URL, data);
  },

  ajustarPronosticoMaterial: async (idPronosticoMaterial: number, data: AjustarPronosticoMaterialDto): Promise<PronosticoMaterialIa> => {
    return httpClient.patch<PronosticoMaterialIa>(`${BASE_URL}/${idPronosticoMaterial}/ajustar`, data);
  },

  confirmarPronosticoMaterial: async (idPronosticoMaterial: number): Promise<PronosticoMaterialIa> => {
    return httpClient.patch<PronosticoMaterialIa>(`${BASE_URL}/${idPronosticoMaterial}/confirmar`, {});
  },

  calcularConfianzaPronostico: async (idPronosticoMaterial: number): Promise<CalcularConfianzaPronosticoResponse> => {
    return httpClient.get<CalcularConfianzaPronosticoResponse>(`${BASE_URL}/${idPronosticoMaterial}/confianza`);
  }
};
