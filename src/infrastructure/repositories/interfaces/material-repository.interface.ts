import { Material, TipoMaterial } from '../../../domain';

export interface MaterialRepositoryFindManyParams {
  tipoMaterial?: TipoMaterial;
  busqueda?: string;
  pagina?: number;
  limite?: number;
}

export interface MaterialRepository {
  create: (data: Material) => Promise<Material>;
  findById: (idMaterial: number) => Promise<Material | null>;
  findMany: (params?: MaterialRepositoryFindManyParams) => Promise<Material[]>;
  update: (idMaterial: number, data: Partial<Material>) => Promise<Material>;
  delete: (idMaterial: number) => Promise<void>;
  existsByNombre: (nombre: string) => Promise<boolean>;
  existsByNombreExcludingId: (
    nombre: string,
    idMaterial: number,
  ) => Promise<boolean>;
}
