import type { Proyecto } from '../../cu02-creacion-proyectos/types/proyecto.types';

export const EstadoCronograma = {
  ACTIVO: 'ACTIVO',
  REPLANIFICADO: 'REPLANIFICADO',
  FINALIZADO: 'FINALIZADO',
  CANCELADO: 'CANCELADO',
} as const;

export type EstadoCronograma = typeof EstadoCronograma[keyof typeof EstadoCronograma];

export interface Cronograma {
  idCronograma: number;
  idProyecto: number;
  fechaCreacion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  fechaInicioPlanificada?: string;
  fechaFinPlanificada?: string;
  estadoCronograma: EstadoCronograma;
  accionesAnteRetraso?: string;
  motivoReplanificacion?: string;
  fechaUltimaModificacion?: string;
  proyecto?: Proyecto;
}

export interface CrearCronogramaDto {
  idProyecto: number;
  fechaInicio?: string;
  fechaFin?: string;
  fechaInicioPlanificada?: string;
  fechaFinPlanificada?: string;
  accionesAnteRetraso?: string;
}

export interface ReplanificarCronogramaDto {
  fechaInicio?: string;
  fechaFin?: string;
  motivoReplanificacion: string;
  accionesAnteRetraso?: string;
}

export interface ListarCronogramasParams {
  idProyecto?: number;
  busqueda?: string;
  pagina?: number;
  limite?: number;
}
