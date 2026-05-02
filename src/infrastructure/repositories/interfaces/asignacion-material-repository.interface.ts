import { AsignacionMaterial, EstadoAsignacion } from '../../../domain';

export interface AsignacionMaterialRepositoryFindManyParams {
  idTarea?: number;
  idMaterial?: number;
  estadoAsignacion?: EstadoAsignacion;
  pagina?: number;
  limite?: number;
}

export interface AsignacionMaterialRepository {
  create: (data: AsignacionMaterial) => Promise<AsignacionMaterial>;
  findById: (
    idAsignacionMaterial: number,
  ) => Promise<AsignacionMaterial | null>;
  findMany: (
    params?: AsignacionMaterialRepositoryFindManyParams,
  ) => Promise<AsignacionMaterial[]>;
  update: (
    idAsignacionMaterial: number,
    data: Partial<AsignacionMaterial>,
  ) => Promise<AsignacionMaterial>;
  delete: (idAsignacionMaterial: number) => Promise<void>;
}
