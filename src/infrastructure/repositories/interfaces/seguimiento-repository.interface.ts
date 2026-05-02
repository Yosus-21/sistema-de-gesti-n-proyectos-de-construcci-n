import { Seguimiento } from '../../../domain';

export interface SeguimientoRepositoryFindManyParams {
  idTarea?: number;
  pagina?: number;
  limite?: number;
}

export interface SeguimientoRepository {
  create: (data: Seguimiento) => Promise<Seguimiento>;
  findById: (idSeguimiento: number) => Promise<Seguimiento | null>;
  findMany: (
    params?: SeguimientoRepositoryFindManyParams,
  ) => Promise<Seguimiento[]>;
  update: (
    idSeguimiento: number,
    data: Partial<Seguimiento>,
  ) => Promise<Seguimiento>;
  delete: (idSeguimiento: number) => Promise<void>;
}
