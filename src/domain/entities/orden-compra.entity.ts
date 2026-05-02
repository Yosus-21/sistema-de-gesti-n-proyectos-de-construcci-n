import { EstadoOrdenCompra } from '../enums';

export class OrdenCompra {
  idOrdenCompra?: number;
  fechaOrden: Date;
  fechaEntregaEstimada?: Date;
  estadoOrden: EstadoOrdenCompra;
  idProveedor?: number;

  constructor(data: Partial<OrdenCompra> = {}) {
    Object.assign(this, data);
  }

  actualizarEstado(nuevoEstado: EstadoOrdenCompra): void {
    this.estadoOrden = nuevoEstado;
  }
}
