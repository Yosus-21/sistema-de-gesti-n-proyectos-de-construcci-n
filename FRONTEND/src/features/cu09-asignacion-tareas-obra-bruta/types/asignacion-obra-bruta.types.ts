import type { TareaObraBruta } from "../../cu04-gestion-tareas-obra-bruta/types/tarea-obra-bruta.types";
import type { Trabajador } from "../../cu08-gestion-trabajador/types/trabajador.types";

export type EstadoAsignacion = 'PENDIENTE' | 'CONFIRMADA' | 'REASIGNADA' | 'CANCELADA';

export interface AsignacionObraBruta {
  idAsignacionTarea: number;
  idTarea: number;
  idTrabajador: number;
  fechaAsignacion: string;
  estadoAsignacion: EstadoAsignacion;
  observaciones?: string;
  tarea?: TareaObraBruta;
  trabajador?: Trabajador;
}

export interface CrearAsignacionObraBrutaDto {
  idTarea: number;
  idTrabajador: number;
  observaciones?: string;
}

export interface ModificarAsignacionObraBrutaDto {
  idTrabajador?: number;
  estadoAsignacion?: EstadoAsignacion;
  observaciones?: string;
}

export interface ListarAsignacionesObraBrutaParams {
  idTarea?: number;
  idTrabajador?: number;
  pagina?: number;
  limite?: number;
}
