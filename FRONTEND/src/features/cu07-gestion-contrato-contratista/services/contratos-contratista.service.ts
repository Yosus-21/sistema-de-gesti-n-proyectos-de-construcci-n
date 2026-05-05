import { httpClient } from '../../../shared/api/http-client';
import type {
  ContratoContratista,
  RegistrarContratoContratistaDto,
  ModificarContratoContratistaDto,
  ListarContratosContratistaParams,
  CalcularCostoContratoResponse,
  ValidarVigenciaContratoResponse,
} from '../types/contrato-contratista.types';

const BASE_URL = '/cu07/contratos-contratistas';

export const contratosContratistaService = {
  listarContratosContratista: async (params?: ListarContratosContratistaParams): Promise<ContratoContratista[]> => {
    let url = BASE_URL;
    if (params) {
      const query = new URLSearchParams();
      if (params.idProyecto) query.append('idProyecto', params.idProyecto.toString());
      if (params.idContratista) query.append('idContratista', params.idContratista.toString());
      if (params.pagina) query.append('pagina', params.pagina.toString());
      if (params.limite) query.append('limite', params.limite.toString());
      const queryString = query.toString();
      if (queryString) url += `?${queryString}`;
    }
    const response = await httpClient.get<ContratoContratista[]>(url);
    return response;
  },

  consultarContratoContratista: async (idContrato: number): Promise<ContratoContratista> => {
    const response = await httpClient.get<ContratoContratista>(`${BASE_URL}/${idContrato}`);
    return response;
  },

  registrarContratoContratista: async (data: RegistrarContratoContratistaDto): Promise<ContratoContratista> => {
    const response = await httpClient.post<ContratoContratista>(BASE_URL, data);
    return response;
  },

  modificarContratoContratista: async (
    idContrato: number,
    data: ModificarContratoContratistaDto
  ): Promise<ContratoContratista> => {
    const response = await httpClient.patch<ContratoContratista>(`${BASE_URL}/${idContrato}`, data);
    return response;
  },

  calcularCostoContrato: async (idContrato: number): Promise<CalcularCostoContratoResponse> => {
    const response = await httpClient.get<CalcularCostoContratoResponse>(`${BASE_URL}/${idContrato}/costo`);
    return response;
  },

  validarVigenciaContrato: async (idContrato: number): Promise<ValidarVigenciaContratoResponse> => {
    const response = await httpClient.get<ValidarVigenciaContratoResponse>(`${BASE_URL}/${idContrato}/vigencia`);
    return response;
  },
};
