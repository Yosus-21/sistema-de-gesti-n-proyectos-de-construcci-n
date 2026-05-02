import { EstadoAsignacion } from '../enums';

export class AsignacionMaterial {
  idAsignacionMaterial?: number;
  cantidadAsignada: number;
  fechaAsignacion: Date;
  criteriosPrioridad?: string;
  costoMaximoPermitido?: number;
  restricciones?: string;
  estadoAsignacion: EstadoAsignacion;
  generadaPorIa: boolean;
  idTarea?: number;
  idMaterial?: number;

  constructor(data: Partial<AsignacionMaterial> = {}) {
    Object.assign(this, data);
  }

  cambiarEstado(nuevoEstado: EstadoAsignacion): void {
    this.estadoAsignacion = nuevoEstado;
  }
}
