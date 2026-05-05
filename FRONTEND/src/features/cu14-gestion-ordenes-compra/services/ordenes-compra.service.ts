import { httpClient } from '../../../shared/api/http-client';
import type { 
  OrdenCompra, 
  LineaOrdenCompra,
  CrearOrdenCompraDto, 
  ModificarOrdenCompraDto, 
  AgregarLineaOrdenCompraDto, 
  ListarOrdenesCompraParams,
  CalcularMontoTotalOrdenCompraResponse,
  EstadoOrden
} from '../types/orden-compra.types';

const BASE_URL = '/cu14/ordenes-compra';

export const ordenesCompraService = {
  listarOrdenesCompra: async (params?: ListarOrdenesCompraParams): Promise<OrdenCompra[]> => {
    let url = BASE_URL;
    if (params) {
      const query = new URLSearchParams();
      if (params.idProveedor) query.append('idProveedor', params.idProveedor.toString());
      if (params.estadoOrden) query.append('estadoOrden', params.estadoOrden);
      if (params.pagina) query.append('pagina', params.pagina.toString());
      if (params.limite) query.append('limite', params.limite.toString());
      const queryString = query.toString();
      if (queryString) url += `?${queryString}`;
    }
    return httpClient.get<OrdenCompra[]>(url);
  },

  consultarOrdenCompra: async (idOrdenCompra: number): Promise<OrdenCompra> => {
    return httpClient.get<OrdenCompra>(`${BASE_URL}/${idOrdenCompra}`);
  },

  crearOrdenCompra: async (data: CrearOrdenCompraDto): Promise<OrdenCompra> => {
    return httpClient.post<OrdenCompra>(BASE_URL, data);
  },

  modificarOrdenCompra: async (idOrdenCompra: number, data: ModificarOrdenCompraDto): Promise<OrdenCompra> => {
    return httpClient.patch<OrdenCompra>(`${BASE_URL}/${idOrdenCompra}`, data);
  },

  agregarLineaOrdenCompra: async (idOrdenCompra: number, data: AgregarLineaOrdenCompraDto): Promise<LineaOrdenCompra> => {
    return httpClient.post<LineaOrdenCompra>(`${BASE_URL}/${idOrdenCompra}/lineas`, data);
  },

  cambiarEstadoOrdenCompra: async (idOrdenCompra: number, estadoOrden: EstadoOrden): Promise<OrdenCompra> => {
    return httpClient.patch<OrdenCompra>(`${BASE_URL}/${idOrdenCompra}/estado`, { estadoOrden });
  },

  calcularMontoTotalOrdenCompra: async (idOrdenCompra: number): Promise<CalcularMontoTotalOrdenCompraResponse> => {
    return httpClient.get<CalcularMontoTotalOrdenCompraResponse>(`${BASE_URL}/${idOrdenCompra}/monto-total`);
  }
};
