import { httpClient } from '../../../shared/api/http-client';
import type {
  Cliente,
  ListarClientesParams,
  ModificarClienteDto,
  RegistrarClienteDto,
} from '../types/cliente.types';

const BASE = '/cu01/clientes';

function buildQuery(params?: ListarClientesParams): string {
  if (!params) return '';
  const qs = new URLSearchParams();
  if (params.busqueda) qs.set('busqueda', params.busqueda);
  if (params.pagina !== undefined) qs.set('pagina', String(params.pagina));
  if (params.limite !== undefined) qs.set('limite', String(params.limite));
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const clientesService = {
  listarClientes: (params?: ListarClientesParams) =>
    httpClient.get<Cliente[]>(`${BASE}${buildQuery(params)}`),

  consultarCliente: (idCliente: number) =>
    httpClient.get<Cliente>(`${BASE}/${idCliente}`),

  registrarCliente: (data: RegistrarClienteDto) =>
    httpClient.post<Cliente>(BASE, data),

  modificarCliente: (idCliente: number, data: ModificarClienteDto) =>
    httpClient.patch<Cliente>(`${BASE}/${idCliente}`, data),

  eliminarCliente: (idCliente: number) =>
    httpClient.delete<void>(`${BASE}/${idCliente}`),
};
