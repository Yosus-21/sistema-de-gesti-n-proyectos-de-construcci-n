import type { Cliente } from '../../cu01-gestionar-clientes/types/cliente.types';

export const EstadoProyecto = {
  PLANIFICACION: 'PLANIFICACION',
  EN_PROGRESO: 'EN_PROGRESO',
  FINALIZADO: 'FINALIZADO',
  CANCELADO: 'CANCELADO',
} as const;

export type EstadoProyecto = typeof EstadoProyecto[keyof typeof EstadoProyecto];

export interface Proyecto {
  idProyecto: number;
  idCliente: number;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  presupuesto?: number;
  fechaInicio: string;
  fechaFinEstimada: string;
  especificacionesTecnicas?: string;
  estadoProyecto: EstadoProyecto;
  fechaRegistro?: string;
  cliente?: Cliente;
}

export interface CrearProyectoDto {
  idCliente: number;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  presupuesto?: number;
  fechaInicio: string;
  fechaFinEstimada: string;
  especificacionesTecnicas?: string;
}

export interface CambiarEstadoProyectoDto {
  estadoProyecto: EstadoProyecto;
}

export interface ListarProyectosParams {
  idCliente?: number;
  busqueda?: string;
  pagina?: number;
  limite?: number;
}
