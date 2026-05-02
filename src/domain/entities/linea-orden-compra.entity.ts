export class LineaOrdenCompra {
  idLineaOrdenCompra?: number;
  cantidadSolicitada: number;
  precioUnitarioAcordado: number;
  estadoLinea?: string;
  idOrdenCompra?: number;
  idMaterial?: number;

  constructor(data: Partial<LineaOrdenCompra> = {}) {
    Object.assign(this, data);
  }

  calcularSubtotal(): number {
    return this.cantidadSolicitada * this.precioUnitarioAcordado;
  }
}
