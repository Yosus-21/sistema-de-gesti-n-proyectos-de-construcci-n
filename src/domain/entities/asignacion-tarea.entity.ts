import { EstadoAsignacion } from '../enums';

export class AsignacionTarea {
  idAsignacionTarea?: number;
  fechaAsignacion: Date;
  rolEnLaTarea: string;
  estadoAsignacion: EstadoAsignacion;
  observaciones?: string;
  asignadaPorContratista: boolean;
  idTarea?: number;
  idTrabajador?: number;

  constructor(data: Partial<AsignacionTarea> = {}) {
    Object.assign(this, data);
  }

  cambiarEstado(nuevoEstado: EstadoAsignacion): void {
    this.estadoAsignacion = nuevoEstado;
  }
}
