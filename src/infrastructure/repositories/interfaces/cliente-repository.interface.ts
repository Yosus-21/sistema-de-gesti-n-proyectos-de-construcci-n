import { Cliente } from '../../../domain';

export interface ClienteRepositoryFindManyParams {
  busqueda?: string;
  pagina?: number;
  limite?: number;
}

export interface ClienteRepository {
  create: (data: Cliente) => Promise<Cliente>;
  findById: (idCliente: number) => Promise<Cliente | null>;
  findMany: (params?: ClienteRepositoryFindManyParams) => Promise<Cliente[]>;
  update: (idCliente: number, data: Partial<Cliente>) => Promise<Cliente>;
  delete: (idCliente: number) => Promise<void>;
  existsByCorreoOrTelefono: (
    correo: string,
    telefono: string,
  ) => Promise<boolean>;
  existsByCorreoOrTelefonoExcludingId: (
    correo: string,
    telefono: string,
    idCliente: number,
  ) => Promise<boolean>;
}
