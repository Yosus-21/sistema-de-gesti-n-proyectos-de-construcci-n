import { httpClient } from '../../../shared/api/http-client';
import type { 
  Material, 
  RegistrarMaterialDto, 
  ModificarMaterialDto, 
  ListarMaterialesParams, 
  ActualizarStockMaterialDto, 
  DisponibilidadMaterialResponse 
} from '../types/material.types';

const BASE_URL = '/cu12/materiales';

export const materialesService = {
  listarMateriales: async (params?: ListarMaterialesParams): Promise<Material[]> => {
    let url = BASE_URL;
    if (params) {
      const query = new URLSearchParams();
      if (params.tipoMaterial) query.append('tipoMaterial', params.tipoMaterial);
      if (params.busqueda) query.append('busqueda', params.busqueda);
      if (params.pagina) query.append('pagina', params.pagina.toString());
      if (params.limite) query.append('limite', params.limite.toString());
      const queryString = query.toString();
      if (queryString) url += `?${queryString}`;
    }
    return httpClient.get<Material[]>(url);
  },

  consultarMaterial: async (idMaterial: number): Promise<Material> => {
    return httpClient.get<Material>(`${BASE_URL}/${idMaterial}`);
  },

  registrarMaterial: async (data: RegistrarMaterialDto): Promise<Material> => {
    return httpClient.post<Material>(BASE_URL, data);
  },

  modificarMaterial: async (idMaterial: number, data: ModificarMaterialDto): Promise<Material> => {
    return httpClient.patch<Material>(`${BASE_URL}/${idMaterial}`, data);
  },

  eliminarMaterial: async (idMaterial: number): Promise<void> => {
    return httpClient.delete<void>(`${BASE_URL}/${idMaterial}`);
  },

  actualizarStockMaterial: async (idMaterial: number, data: ActualizarStockMaterialDto): Promise<Material> => {
    return httpClient.patch<Material>(`${BASE_URL}/${idMaterial}/stock`, data);
  },

  verificarDisponibilidadMaterial: async (idMaterial: number, cantidadRequerida: number): Promise<DisponibilidadMaterialResponse> => {
    return httpClient.get<DisponibilidadMaterialResponse>(`${BASE_URL}/${idMaterial}/disponibilidad?cantidadRequerida=${cantidadRequerida}`);
  }
};
