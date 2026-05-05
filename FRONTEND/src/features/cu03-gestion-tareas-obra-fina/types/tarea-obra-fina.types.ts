export type EstadoTarea = 'PENDIENTE' | 'EN_PROGRESO' | 'FINALIZADA' | 'CANCELADA';
export type PrioridadTarea = 'BAJA' | 'MEDIA' | 'ALTA';
export type PerfilObraFina = 'VIDRIERO' | 'CARPINTERO';

export interface TareaObraFina {
  idTarea: number;
  idProyecto: number;
  idCronograma?: number;
  nombre: string;
  descripcion?: string;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
  prioridadTarea: PrioridadTarea;
  estadoTarea: EstadoTarea;
  perfilRequerido: PerfilObraFina;
  tipoTarea: 'OBRA_FINA';
}

export interface RegistrarTareaObraFinaDto {
  idProyecto: number;
  idCronograma?: number;
  nombre: string;
  descripcion?: string;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
  prioridadTarea: PrioridadTarea;
  perfilRequerido: PerfilObraFina;
}

export interface ModificarTareaObraFinaDto {
  nombre?: string;
  descripcion?: string;
  fechaInicioPlanificada?: string;
  fechaFinPlanificada?: string;
  prioridadTarea?: PrioridadTarea;
  estadoTarea?: EstadoTarea;
  perfilRequerido?: PerfilObraFina;
}

export interface ListarTareasObraFinaParams {
  idProyecto?: number;
  busqueda?: string;
  pagina?: number;
  limite?: number;
}
