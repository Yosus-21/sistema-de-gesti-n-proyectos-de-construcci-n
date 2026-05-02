import { EntregaMaterial } from '../../../domain';

export interface EntregaMaterialRepositoryFindManyParams {
  idOrdenCompra?: number;
  idMaterial?: number;
  pagina?: number;
  limite?: number;
}

export interface EntregaMaterialRepository {
  create: (data: EntregaMaterial) => Promise<EntregaMaterial>;
  findById: (idEntregaMaterial: number) => Promise<EntregaMaterial | null>;
  findMany: (
    params?: EntregaMaterialRepositoryFindManyParams,
  ) => Promise<EntregaMaterial[]>;
  update: (
    idEntregaMaterial: number,
    data: Partial<EntregaMaterial>,
  ) => Promise<EntregaMaterial>;
  delete: (idEntregaMaterial: number) => Promise<void>;
}
