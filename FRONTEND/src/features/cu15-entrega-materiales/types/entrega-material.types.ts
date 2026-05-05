import type { Material } from '../../cu12-registro-materiales/types/material.types';
import type { OrdenCompra } from '../../cu14-gestion-ordenes-compra/types/orden-compra.types';

export type EstadoEntrega = 'REGISTRADA' | 'RECIBIDA';

export interface EntregaMaterial {
  idEntregaMaterial: number;
  idOrdenCompra: number;
  idMaterial: number;
  cantidadEntregada: number;
  fechaEntrega?: string;
  estadoEntrega?: EstadoEntrega;
  observaciones?: string;
  material?: Material;
  ordenCompra?: OrdenCompra;
}

export interface RegistrarEntregaMaterialDto {
  idOrdenCompra: number;
  idMaterial: number;
  cantidadEntregada: number;
  fechaEntrega?: string;
  observaciones?: string;
}

export interface ListarEntregasMaterialParams {
  idOrdenCompra?: number;
  idMaterial?: number;
  pagina?: number;
  limite?: number;
}

export interface ConfirmarRecepcionMaterialResponse {
  idEntregaMaterial: number;
  estadoAnterior: string;
  nuevoEstado: string;
  stockActualizado: number;
  ordenCompletada: boolean;
}

export interface VerificarEntregaContraOrdenResponse {
  idEntregaMaterial: number;
  idOrdenCompra: number;
  coincide: boolean;
  diferencia: number;
  mensaje: string;
}
