import { TipoReporte } from '../enums';

export class Reporte {
  idReporte?: number;
  tipoReporte: TipoReporte;
  fechaGeneracion: Date;
  fechaInicioPeriodo?: Date;
  fechaFinPeriodo?: Date;
  porcentajeAvanceGeneral?: number;
  contenidoResumen: string;
  rutaArchivoPdf?: string;
  idProyecto?: number;

  constructor(data: Partial<Reporte> = {}) {
    Object.assign(this, data);
  }
}
