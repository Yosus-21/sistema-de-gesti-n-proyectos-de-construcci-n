import { Cronograma } from '../../../domain';

export interface CronogramaRepositoryFindManyParams {
  idProyecto?: number;
  busqueda?: string;
  pagina?: number;
  limite?: number;
}

export interface CronogramaRepository {
  create: (data: Cronograma) => Promise<Cronograma>;
  findById: (idCronograma: number) => Promise<Cronograma | null>;
  findByProyecto: (idProyecto: number) => Promise<Cronograma | null>;
  findMany: (
    params?: CronogramaRepositoryFindManyParams,
  ) => Promise<Cronograma[]>;
  update: (
    idCronograma: number,
    data: Partial<Cronograma>,
  ) => Promise<Cronograma>;
  delete: (idCronograma: number) => Promise<void>;
  existsByProyecto: (idProyecto: number) => Promise<boolean>;
}
