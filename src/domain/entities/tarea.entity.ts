import {
  EstadoTarea,
  OcupacionTrabajador,
  PrioridadTarea,
  TipoTarea,
} from '../enums';

export class Tarea {
  idTarea?: number;
  nombre: string;
  descripcion: string;
  tipoTarea: TipoTarea;
  perfilRequerido: OcupacionTrabajador;
  duracionEstimada: number;
  fechaInicioPlanificada: Date;
  fechaFinPlanificada: Date;
  fechaInicioReal?: Date;
  fechaFinReal?: Date;
  estadoTarea: EstadoTarea;
  prioridad: PrioridadTarea;
  observaciones?: string;
  accionesAnteRetraso?: string;
  idCronograma?: number;

  constructor(data: Partial<Tarea> = {}) {
    Object.assign(this, data);
  }

  cambiarEstado(nuevoEstado: EstadoTarea): void {
    this.estadoTarea = nuevoEstado;
  }

  registrarInicioReal(fecha: Date): void {
    this.fechaInicioReal = fecha;
  }

  registrarFinReal(fecha: Date): void {
    this.fechaFinReal = fecha;
  }

  calcularDesviacion(): number {
    // TODO: implementar calculo real en una fase posterior.
    return 0;
  }
}
