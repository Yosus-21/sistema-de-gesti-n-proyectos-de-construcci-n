export type EstadoTarea = 'PENDIENTE' | 'EN_PROGRESO' | 'FINALIZADA' | 'CANCELADA';
export type PrioridadTarea = 'BAJA' | 'MEDIA' | 'ALTA';
export type PerfilObraBruta = 'ALBANIL' | 'PLOMERO' | 'ELECTRICISTA';

export interface TareaObraBruta {
  idTarea: number;
  idProyecto: number;
  idCronograma?: number;
  nombre: string;
  descripcion?: string;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
  prioridadTarea: PrioridadTarea;
  estadoTarea: EstadoTarea;
  perfilRequerido: PerfilObraBruta;
  tipoTarea: 'OBRA_BRUTA';
}

export interface RegistrarTareaObraBrutaDto {
  idProyecto: number;
  idCronograma?: number;
  nombre: string;
  descripcion?: string;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
  prioridadTarea: PrioridadTarea;
  perfilRequerido: PerfilObraBruta;
}

export interface ModificarTareaObraBrutaDto {
  nombre?: string;
  descripcion?: string;
  fechaInicioPlanificada?: string;
  fechaFinPlanificada?: string;
  prioridadTarea?: PrioridadTarea;
  estadoTarea?: EstadoTarea;
  perfilRequerido?: PerfilObraBruta;
}

export interface ListarTareasObraBrutaParams {
  idProyecto?: number;
  busqueda?: string;
  pagina?: number;
  limite?: number;
}
