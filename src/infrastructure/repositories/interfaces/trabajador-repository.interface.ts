import { OcupacionTrabajador, Trabajador } from '../../../domain';

export interface TrabajadorRepositoryFindManyParams {
  ocupacion?: OcupacionTrabajador;
  busqueda?: string;
  pagina?: number;
  limite?: number;
}

export interface TrabajadorRepository {
  create: (data: Trabajador) => Promise<Trabajador>;
  findById: (idTrabajador: number) => Promise<Trabajador | null>;
  findMany: (
    params?: TrabajadorRepositoryFindManyParams,
  ) => Promise<Trabajador[]>;
  update: (
    idTrabajador: number,
    data: Partial<Trabajador>,
  ) => Promise<Trabajador>;
  delete: (idTrabajador: number) => Promise<void>;
  existsByCiOrCorreo: (ci: string, correo: string) => Promise<boolean>;
  existsByCiOrCorreoExcludingId: (
    ci: string,
    correo: string,
    idTrabajador: number,
  ) => Promise<boolean>;
}
