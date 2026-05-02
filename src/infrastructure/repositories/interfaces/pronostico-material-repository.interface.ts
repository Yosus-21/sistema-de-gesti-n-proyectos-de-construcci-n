import { PronosticoMaterial } from '../../../domain';

export interface PronosticoMaterialRepositoryFindManyParams {
  idProyecto?: number;
  idMaterial?: number;
  pagina?: number;
  limite?: number;
}

export interface PronosticoMaterialRepository {
  create: (data: PronosticoMaterial) => Promise<PronosticoMaterial>;
  findById: (
    idPronosticoMaterial: number,
  ) => Promise<PronosticoMaterial | null>;
  findMany: (
    params?: PronosticoMaterialRepositoryFindManyParams,
  ) => Promise<PronosticoMaterial[]>;
  update: (
    idPronosticoMaterial: number,
    data: Partial<PronosticoMaterial>,
  ) => Promise<PronosticoMaterial>;
  delete: (idPronosticoMaterial: number) => Promise<void>;
}
