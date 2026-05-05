import type { Material } from '../../cu12-registro-materiales/types/material.types';
import type { Proyecto } from '../../cu02-creacion-proyectos/types/proyecto.types';

export interface PronosticoMaterialIa {
  idPronosticoMaterial: number;
  idProyecto?: number;
  idMaterial?: number;
  stockMinimo?: number;
  stockMaximo?: number;
  nivelConfianza?: number;
  observaciones?: string;
  fechaGeneracion?: string;
  material?: Material;
  proyecto?: Proyecto;
}

export interface GenerarPronosticoMaterialDto {
  idProyecto: number;
  idMaterial?: number;
  stockMinimo: number;
  stockMaximo: number;
  observaciones?: string;
}

export interface AjustarPronosticoMaterialDto {
  stockMinimo: number;
  stockMaximo: number;
  observaciones?: string;
}

export interface ListarPronosticosMaterialIaParams {
  idProyecto?: number;
  idMaterial?: number;
  pagina?: number;
  limite?: number;
}

export interface CalcularConfianzaPronosticoResponse {
  idPronosticoMaterial: number;
  nivelConfianza: number; // 0-100
  factores: string[];
  ultimaActualizacion: string;
}
