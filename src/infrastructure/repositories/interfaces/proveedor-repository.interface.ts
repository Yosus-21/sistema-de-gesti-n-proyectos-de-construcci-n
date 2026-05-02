import { Proveedor } from '../../../domain';

export interface ProveedorRepositoryFindManyParams {
  busqueda?: string;
  pagina?: number;
  limite?: number;
}

export interface ProveedorRepository {
  create: (data: Proveedor) => Promise<Proveedor>;
  findById: (idProveedor: number) => Promise<Proveedor | null>;
  findMany: (
    params?: ProveedorRepositoryFindManyParams,
  ) => Promise<Proveedor[]>;
  update: (idProveedor: number, data: Partial<Proveedor>) => Promise<Proveedor>;
  delete: (idProveedor: number) => Promise<void>;
  existsByNombreOrCorreo: (nombre: string, correo: string) => Promise<boolean>;
  existsByNombreOrCorreoExcludingId: (
    nombre: string,
    correo: string,
    idProveedor: number,
  ) => Promise<boolean>;
}
