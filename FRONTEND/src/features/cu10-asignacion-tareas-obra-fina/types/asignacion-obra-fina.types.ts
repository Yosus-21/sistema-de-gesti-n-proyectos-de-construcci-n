import type { TareaObraFina } from "../../cu03-gestion-tareas-obra-fina/types/tarea-obra-fina.types";
import type { Trabajador } from "../../cu08-gestion-trabajador/types/trabajador.types";

export type EstadoAsignacion = 'PENDIENTE' | 'CONFIRMADA' | 'REASIGNADA' | 'CANCELADA';

export interface AsignacionObraFina {
  idAsignacionTarea: number;
  idTarea: number;
  idTrabajador: number;
  fechaAsignacion: string;
  estadoAsignacion: EstadoAsignacion;
  observaciones?: string;
  tarea?: TareaObraFina;
  trabajador?: Trabajador;
}

export interface CrearAsignacionObraFinaDto {
  idTarea: number;
  idTrabajador: number;
  observaciones?: string;
}

export interface ModificarAsignacionObraFinaDto {
  idTrabajador?: number;
  estadoAsignacion?: EstadoAsignacion;
  observaciones?: string;
}

export interface ListarAsignacionesObraFinaParams {
  idTarea?: number;
  idTrabajador?: number;
  pagina?: number;
  limite?: number;
}
