export class EntregaMaterial {
  idEntregaMaterial?: number;
  fechaEntrega: Date;
  estadoEntrega: string;
  observaciones?: string;
  cantidadEntregada: number;
  idOrdenCompra?: number;
  idMaterial?: number;

  constructor(data: Partial<EntregaMaterial> = {}) {
    Object.assign(this, data);
  }
}
