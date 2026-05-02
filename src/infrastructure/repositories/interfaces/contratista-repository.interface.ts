import { Contratista } from '../../../domain';

export interface ContratistaRepositoryFindManyParams {
  busqueda?: string;
  pagina?: number;
  limite?: number;
}

export interface ContratistaRepository {
  create: (data: Contratista) => Promise<Contratista>;
  findById: (idContratista: number) => Promise<Contratista | null>;
  findMany: (
    params?: ContratistaRepositoryFindManyParams,
  ) => Promise<Contratista[]>;
  update: (
    idContratista: number,
    data: Partial<Contratista>,
  ) => Promise<Contratista>;
  delete: (idContratista: number) => Promise<void>;
  existsByCiOrCorreo: (ci: string, correo: string) => Promise<boolean>;
  existsByCiOrCorreoExcludingId: (
    ci: string,
    correo: string,
    idContratista: number,
  ) => Promise<boolean>;
}
