import { httpClient } from '../../../shared/api/http-client';
import type { 
  EntregaMaterial, 
  RegistrarEntregaMaterialDto, 
  ListarEntregasMaterialParams,
  ConfirmarRecepcionMaterialResponse,
  VerificarEntregaContraOrdenResponse
} from '../types/entrega-material.types';

const BASE_URL = '/cu15/entregas-materiales';

export const entregasMaterialesService = {
  listarEntregasMateriales: async (params?: ListarEntregasMaterialParams): Promise<EntregaMaterial[]> => {
    let url = BASE_URL;
    if (params) {
      const query = new URLSearchParams();
      if (params.idOrdenCompra) query.append('idOrdenCompra', params.idOrdenCompra.toString());
      if (params.idMaterial) query.append('idMaterial', params.idMaterial.toString());
      if (params.pagina) query.append('pagina', params.pagina.toString());
      if (params.limite) query.append('limite', params.limite.toString());
      const queryString = query.toString();
      if (queryString) url += `?${queryString}`;
    }
    return httpClient.get<EntregaMaterial[]>(url);
  },

  consultarEntregaMaterial: async (idEntregaMaterial: number): Promise<EntregaMaterial> => {
    return httpClient.get<EntregaMaterial>(`${BASE_URL}/${idEntregaMaterial}`);
  },

  registrarEntregaMaterial: async (data: RegistrarEntregaMaterialDto): Promise<EntregaMaterial> => {
    return httpClient.post<EntregaMaterial>(BASE_URL, data);
  },

  confirmarRecepcionMaterial: async (idEntregaMaterial: number): Promise<ConfirmarRecepcionMaterialResponse> => {
    return httpClient.patch<ConfirmarRecepcionMaterialResponse>(`${BASE_URL}/${idEntregaMaterial}/confirmar-recepcion`, {});
  },

  verificarEntregaContraOrden: async (idEntregaMaterial: number, idOrdenCompra: number): Promise<VerificarEntregaContraOrdenResponse> => {
    return httpClient.get<VerificarEntregaContraOrdenResponse>(`${BASE_URL}/${idEntregaMaterial}/verificar-contra-orden/${idOrdenCompra}`);
  }
};
