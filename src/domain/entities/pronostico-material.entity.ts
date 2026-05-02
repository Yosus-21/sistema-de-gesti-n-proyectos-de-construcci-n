export class PronosticoMaterial {
  idPronosticoMaterial?: number;
  periodoAnalisis: string;
  stockMinimo: number;
  stockMaximo: number;
  fechaGeneracion: Date;
  nivelConfianza: number;
  observaciones?: string;
  idProyecto?: number;
  idMaterial?: number;

  constructor(data: Partial<PronosticoMaterial> = {}) {
    Object.assign(this, data);
  }
}
