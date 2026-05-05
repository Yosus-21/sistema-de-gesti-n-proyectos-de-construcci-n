import { httpClient } from '../../../shared/api/http-client';
import type { 
  Alerta, 
  ConfigurarAlertaDto, 
  GenerarNotificacionDto, 
  ListarAlertasParams, 
  GenerarNotificacionResponse 
} from '../types/alerta-notificacion.types';

const BASE_URL = '/cu18/alertas-notificaciones';

export const alertasNotificacionesService = {
  listarAlertas: async (params?: ListarAlertasParams): Promise<Alerta[]> => {
    let url = BASE_URL;
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.idProyecto) queryParams.append('idProyecto', params.idProyecto.toString());
      if (params.idTarea) queryParams.append('idTarea', params.idTarea.toString());
      if (params.idMaterial) queryParams.append('idMaterial', params.idMaterial.toString());
      if (params.tipoAlerta) queryParams.append('tipoAlerta', params.tipoAlerta);
      if (params.estadoAlerta) queryParams.append('estadoAlerta', params.estadoAlerta);
      if (params.pagina) queryParams.append('pagina', params.pagina.toString());
      if (params.limite) queryParams.append('limite', params.limite.toString());
      
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return httpClient.get<Alerta[]>(url);
  },

  consultarAlerta: async (idAlerta: number): Promise<Alerta> => {
    return httpClient.get<Alerta>(`${BASE_URL}/${idAlerta}`);
  },

  configurarAlerta: async (data: ConfigurarAlertaDto): Promise<Alerta> => {
    return httpClient.post<Alerta>(BASE_URL, data);
  },

  activarAlerta: async (idAlerta: number): Promise<Alerta> => {
    return httpClient.patch<Alerta>(`${BASE_URL}/${idAlerta}/activar`, {});
  },

  desactivarAlerta: async (idAlerta: number): Promise<Alerta> => {
    return httpClient.patch<Alerta>(`${BASE_URL}/${idAlerta}/desactivar`, {});
  },

  generarNotificacion: async (idAlerta: number, data: GenerarNotificacionDto): Promise<GenerarNotificacionResponse> => {
    return httpClient.post<GenerarNotificacionResponse>(`${BASE_URL}/${idAlerta}/notificar`, data);
  }
};
