import type { Material } from '../../cu12-registro-materiales/types/material.types';
import type { Proveedor } from '../../cu13-gestion-proveedores/types/proveedor.types';

export type EstadoOrden = 'BORRADOR' | 'EMITIDA' | 'RECIBIDA' | 'CANCELADA';

export interface LineaOrdenCompra {
  idLineaOrdenCompra?: number;
  idOrdenCompra?: number;
  idMaterial: number;
  cantidadSolicitada: number;
  precioUnitarioAcordado: number;
  estadoLinea?: string;
  material?: Material;
}

export interface OrdenCompra {
  idOrdenCompra: number;
  idProveedor: number;
  fechaEmision?: string;
  fechaEntregaEstimada?: string;
  estadoOrden?: EstadoOrden;
  observaciones?: string;
  montoTotal?: number;
  proveedor?: Proveedor;
  lineas?: LineaOrdenCompra[];
}

export interface CrearOrdenCompraDto {
  idProveedor: number;
  fechaEmision?: string;
  fechaEntregaEstimada?: string;
  observaciones?: string;
}

export type ModificarOrdenCompraDto = Partial<CrearOrdenCompraDto>;

export interface AgregarLineaOrdenCompraDto {
  idMaterial: number;
  cantidadSolicitada: number;
  precioUnitarioAcordado: number;
}

export interface ListarOrdenesCompraParams {
  idProveedor?: number;
  estadoOrden?: EstadoOrden;
  pagina?: number;
  limite?: number;
}

export interface CalcularMontoTotalOrdenCompraResponse {
  idOrdenCompra: number;
  montoTotal: number;
  moneda: string;
}
