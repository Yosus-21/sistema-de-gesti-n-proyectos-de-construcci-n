import { httpClient } from '../../../shared/api/http-client';
import type { 
  Reporte, 
  GenerarReporteDto, 
  ListarReportesParams, 
  ExportarReportePdfResponse 
} from '../types/reporte.types';

const BASE_URL = '/cu19/reportes';

export const reportesService = {
  listarReportes: async (params?: ListarReportesParams): Promise<Reporte[]> => {
    let url = BASE_URL;
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.idProyecto) queryParams.append('idProyecto', params.idProyecto.toString());
      if (params.tipoReporte) queryParams.append('tipoReporte', params.tipoReporte);
      if (params.pagina) queryParams.append('pagina', params.pagina.toString());
      if (params.limite) queryParams.append('limite', params.limite.toString());
      
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return httpClient.get<Reporte[]>(url);
  },

  consultarReporte: async (idReporte: number): Promise<Reporte> => {
    return httpClient.get<Reporte>(`${BASE_URL}/${idReporte}`);
  },

  generarReporte: async (data: GenerarReporteDto): Promise<Reporte> => {
    return httpClient.post<Reporte>(BASE_URL, data);
  },

  exportarReportePdf: async (idReporte: number): Promise<ExportarReportePdfResponse> => {
    return httpClient.patch<ExportarReportePdfResponse>(`${BASE_URL}/${idReporte}/exportar-pdf`, {});
  }
};
