export interface Seguimiento {
  idSeguimiento: number;
  idTarea: number;
  fechaSeguimiento: string;
  porcentajeAvance: number;
  observaciones?: string;
  fechaInicioReal?: string;
  fechaFinReal?: string;
  estadoTarea?: string;
  tarea?: unknown; // Unified task info if backend provides it
}

export interface RegistrarSeguimientoDto {
  idTarea: number;
  fechaSeguimiento: string;
  porcentajeAvance: number;
  observaciones?: string;
  fechaInicioReal?: string;
  fechaFinReal?: string;
}

export interface ModificarSeguimientoDto {
  fechaSeguimiento?: string;
  porcentajeAvance?: number;
  observaciones?: string;
  fechaInicioReal?: string;
  fechaFinReal?: string;
}

export interface ListarSeguimientosParams {
  idTarea?: number;
  pagina?: number;
  limite?: number;
}

export interface CalcularDesviacionResponse {
  idTarea: number;
  diasDesviacion: number;
  atrasada: boolean;
}
