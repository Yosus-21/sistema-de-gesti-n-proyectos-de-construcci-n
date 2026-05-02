import { Alerta, EstadoAlerta, TipoAlerta } from '../../../domain';

export interface AlertaRepositoryFindManyParams {
  idProyecto?: number;
  idTarea?: number;
  idMaterial?: number;
  tipoAlerta?: TipoAlerta;
  estadoAlerta?: EstadoAlerta;
  pagina?: number;
  limite?: number;
}

export interface AlertaRepository {
  create: (data: Alerta) => Promise<Alerta>;
  findById: (idAlerta: number) => Promise<Alerta | null>;
  findMany: (params?: AlertaRepositoryFindManyParams) => Promise<Alerta[]>;
  update: (idAlerta: number, data: Partial<Alerta>) => Promise<Alerta>;
  delete: (idAlerta: number) => Promise<void>;
}
