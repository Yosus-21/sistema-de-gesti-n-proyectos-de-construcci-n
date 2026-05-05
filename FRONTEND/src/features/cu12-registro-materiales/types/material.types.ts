export type TipoMaterial = 'CEMENTO' | 'ARENA' | 'GRAVA' | 'LADRILLO' | 'ACERO' | 'MADERA' | 'VIDRIO' | 'PINTURA' | 'HERRAMIENTA' | 'OTRO';

export interface Material {
  idMaterial: number;
  nombre: string;
  descripcion?: string;
  tipoMaterial?: TipoMaterial;
  unidadMedida?: string;
  cantidadDisponible?: number;
  stockMinimo?: number;
  costoUnitario?: number;
  activo?: boolean;
  fechaRegistro?: string;
}

export interface RegistrarMaterialDto {
  nombre: string;
  descripcion?: string;
  tipoMaterial?: TipoMaterial;
  unidadMedida?: string;
  cantidadDisponible?: number;
  stockMinimo?: number;
  costoUnitario?: number;
}

export interface ModificarMaterialDto extends Partial<RegistrarMaterialDto> {
  activo?: boolean;
}

export interface ListarMaterialesParams {
  tipoMaterial?: TipoMaterial;
  busqueda?: string;
  pagina?: number;
  limite?: number;
}

export interface ActualizarStockMaterialDto {
  cantidad: number;
  motivo?: string;
}

export interface DisponibilidadMaterialResponse {
  idMaterial: number;
  nombre: string;
  cantidadRequerida: number;
  cantidadDisponible: number;
  esDisponible: boolean;
  mensaje: string;
}
