import {
  EstadoOrdenCompra,
  LineaOrdenCompra,
  OrdenCompra,
} from '../../../domain';

export interface OrdenCompraRepositoryFindManyParams {
  idProveedor?: number;
  estadoOrden?: EstadoOrdenCompra;
  pagina?: number;
  limite?: number;
}

export interface OrdenCompraRepository {
  create: (data: OrdenCompra) => Promise<OrdenCompra>;
  findById: (idOrdenCompra: number) => Promise<OrdenCompra | null>;
  findMany: (
    params?: OrdenCompraRepositoryFindManyParams,
  ) => Promise<OrdenCompra[]>;
  update: (
    idOrdenCompra: number,
    data: Partial<OrdenCompra>,
  ) => Promise<OrdenCompra>;
  delete: (idOrdenCompra: number) => Promise<void>;
  addLinea: (data: LineaOrdenCompra) => Promise<LineaOrdenCompra>;
  findLineasByOrden: (idOrdenCompra: number) => Promise<LineaOrdenCompra[]>;
  calcularMontoTotal: (idOrdenCompra: number) => Promise<number>;
}
