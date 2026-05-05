import type { TareaObraBruta } from "../../cu04-gestion-tareas-obra-bruta/types/tarea-obra-bruta.types";
import type { Trabajador } from "../../cu08-gestion-trabajador/types/trabajador.types";

export type EstadoAsignacion = 'PENDIENTE' | 'CONFIRMADA' | 'REASIGNADA' | 'CANCELADA';

export interface AsignacionContratista {
  idAsignacionTarea: number;
  idTarea: number;
  idTrabajador: number;
  idContratista?: number;
  fechaAsignacion: string;
  estadoAsignacion: EstadoAsignacion;
  observaciones?: string;
  asignadaPorContratista?: boolean;
  tarea?: TareaObraBruta;
  trabajador?: Trabajador;
}

export interface CrearAsignacionContratistaDto {
  idTarea: number;
  idTrabajador: number;
  idContratista?: number;
  observaciones?: string;
}

export interface ReasignarTrabajadorDto {
  idTrabajador: number;
  observaciones?: string;
}

export interface ListarAsignacionesContratistaParams {
  idTarea?: number;
  idTrabajador?: number;
  pagina?: number;
  limite?: number;
}
