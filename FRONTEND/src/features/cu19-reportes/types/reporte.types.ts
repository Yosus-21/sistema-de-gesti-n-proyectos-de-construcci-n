export type TipoReporte = 'AVANCE_PROYECTO' | 'MATERIALES' | 'COMPRAS' | 'CONTRATOS' | 'GENERAL';

export interface Reporte {
  idReporte: number;
  idProyecto?: number;
  tipoReporte?: TipoReporte;
  fechaGeneracion?: string;
  fechaInicioPeriodo?: string;
  fechaFinPeriodo?: string;
  porcentajeAvanceGeneral?: number;
  contenidoResumen?: string;
  rutaArchivoPdf?: string;
  // Relaciones
  proyecto?: { nombre: string };
}

export interface GenerarReporteDto {
  idProyecto?: number;
  tipoReporte: TipoReporte;
  fechaInicioPeriodo?: string;
  fechaFinPeriodo?: string;
}

export interface ListarReportesParams {
  idProyecto?: number;
  tipoReporte?: TipoReporte;
  pagina?: number;
  limite?: number;
}

export interface ExportarReportePdfResponse {
  idReporte: number;
  rutaArchivoPdf: string;
  generado: boolean;
}
