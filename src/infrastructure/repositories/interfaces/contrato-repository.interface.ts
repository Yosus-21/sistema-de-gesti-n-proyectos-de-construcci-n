import { Contrato } from '../../../domain';

export interface ContratoRepositoryFindManyParams {
  idProyecto?: number;
  idContratista?: number;
  pagina?: number;
  limite?: number;
}

export interface ContratoRepository {
  create: (data: Contrato) => Promise<Contrato>;
  findById: (idContrato: number) => Promise<Contrato | null>;
  findMany: (params?: ContratoRepositoryFindManyParams) => Promise<Contrato[]>;
  update: (idContrato: number, data: Partial<Contrato>) => Promise<Contrato>;
  delete: (idContrato: number) => Promise<void>;
}
