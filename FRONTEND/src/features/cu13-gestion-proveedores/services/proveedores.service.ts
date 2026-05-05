import { httpClient } from '../../../shared/api/http-client';
import type { 
  Proveedor, 
  RegistrarProveedorDto, 
  ModificarProveedorDto, 
  ListarProveedoresParams, 
  ValidarProveedorResponse 
} from '../types/proveedor.types';

const BASE_URL = '/cu13/proveedores';

export const proveedoresService = {
  listarProveedores: async (params?: ListarProveedoresParams): Promise<Proveedor[]> => {
    let url = BASE_URL;
    if (params) {
      const query = new URLSearchParams();
      if (params.busqueda) query.append('busqueda', params.busqueda);
      if (params.pagina) query.append('pagina', params.pagina.toString());
      if (params.limite) query.append('limite', params.limite.toString());
      const queryString = query.toString();
      if (queryString) url += `?${queryString}`;
    }
    return httpClient.get<Proveedor[]>(url);
  },

  consultarProveedor: async (idProveedor: number): Promise<Proveedor> => {
    return httpClient.get<Proveedor>(`${BASE_URL}/${idProveedor}`);
  },

  registrarProveedor: async (data: RegistrarProveedorDto): Promise<Proveedor> => {
    return httpClient.post<Proveedor>(BASE_URL, data);
  },

  modificarProveedor: async (idProveedor: number, data: ModificarProveedorDto): Promise<Proveedor> => {
    return httpClient.patch<Proveedor>(`${BASE_URL}/${idProveedor}`, data);
  },

  eliminarProveedor: async (idProveedor: number): Promise<void> => {
    return httpClient.delete<void>(`${BASE_URL}/${idProveedor}`);
  },

  validarProveedor: async (idProveedor: number): Promise<ValidarProveedorResponse> => {
    return httpClient.get<ValidarProveedorResponse>(`${BASE_URL}/${idProveedor}/validar`);
  }
};
