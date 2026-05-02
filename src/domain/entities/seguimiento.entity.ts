export class Seguimiento {
  idSeguimiento?: number;
  fechaSeguimiento: Date;
  estadoReportado: string;
  cantidadMaterialUsado: number;
  observaciones?: string;
  porcentajeAvance: number;
  idTarea?: number;

  constructor(data: Partial<Seguimiento> = {}) {
    Object.assign(this, data);
  }
}
