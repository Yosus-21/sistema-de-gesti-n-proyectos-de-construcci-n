export class Contrato {
  idContrato?: number;
  fechaInicio: Date;
  fechaFin: Date;
  costoTotal: number;
  metodoPago: string;
  terminosYCondiciones: string;
  estadoContrato: string;
  idProyecto?: number;
  idContratista?: number;

  constructor(data: Partial<Contrato> = {}) {
    Object.assign(this, data);
  }
}
