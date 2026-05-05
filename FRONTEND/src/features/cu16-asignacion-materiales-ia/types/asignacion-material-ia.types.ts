import type { Material } from '../../cu12-registro-materiales/types/material.types';

export type EstadoAsignacionIa = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'AJUSTADA';

export interface AsignacionMaterialIa {
  idAsignacionMaterial: number;
  idTarea?: number;
  idMaterial?: number;
  cantidadAsignada?: number;
  costoEstimado?: number;
  estadoAsignacion?: EstadoAsignacionIa;
  generadaPorIa?: boolean;
  restricciones?: string;
  fechaGeneracion?: string;
  observaciones?: string;
  material?: Material;
  tarea?: unknown; 
}

export interface GenerarPropuestaAsignacionMaterialDto {
  idProyecto?: number;
  idTarea?: number;
  costoMaximoPermitido?: number;
  restricciones?: string;
}

export interface AjustarAsignacionMaterialDto {
  cantidadAsignada: number;
  costoEstimado: number;
  restricciones?: string;
  observaciones?: string;
}

export interface ValidarRestriccionesAsignacionMaterialDto {
  idProyecto: number;
  idTarea: number;
  idMaterial: number;
  cantidad: number;
  restricciones: string;
}

export interface ListarAsignacionesMaterialIaParams {
  idTarea?: number;
  pagina?: number;
  limite?: number;
}

export interface ValidarRestriccionesAsignacionMaterialResponse {
  cumpleRestricciones: boolean;
  mensajes: string[];
  nivelRiesgo: 'BAJO' | 'MEDIO' | 'ALTO';
}
